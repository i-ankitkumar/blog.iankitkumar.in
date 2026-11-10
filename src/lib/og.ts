import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import satori, { type Font, type FontWeight } from 'satori'

/**
 * blog.iankitkumar.in — Open Graph card renderer
 *
 * The card is drawn with satori and rasterised with resvg at build time.
 * The fonts are read from the installed @fontsource packages, so a build
 * never reaches out to a third-party CDN for a font: if the network is
 * down, the build still produces the same image.
 *
 * Two satori quirks are worth knowing before editing this file:
 *
 *   1. `justify-content: space-between` does not distribute the free
 *      space in a row — the second child is pushed past the right edge
 *      and clipped. A right-aligned label is therefore a fixed-width
 *      child with `text-align: right`.
 *   2. `letter-spacing` is not counted in the measured width of a text
 *      run, so a letter-spaced label needs its trailing space to come
 *      out of a fixed-width box rather than out of the page edge.
 */

type Node = {
  type: string
  props: {
    style: Record<string, string | number>
    children?: Node | Node[] | string
  }
}

const WIDTH = 1200
const HEIGHT = 630

/** The card's inner width: the canvas minus the 72px gutter on each side. */
const CONTENT = WIDTH - 144
/** The width reserved for a right-aligned label in a header or footer row. */
const RIGHT_COLUMN = 420

const PAPER = '#F8F6EF'
const INK = '#1C1B16'
const SOFT = '#3A382F'
const MUTED = '#6E6A5C'
const RULE = '#C9C4B6'
const ACCENT = '#1B4B8F'

const sans = async (weight: FontWeight): Promise<Font> => ({
  name: 'IBM Plex Sans',
  data: await readFile(
    join(
      process.cwd(),
      'node_modules',
      '@fontsource',
      'ibm-plex-sans',
      'files',
      `ibm-plex-sans-latin-${weight}-normal.woff`,
    ),
  ),
  weight,
  style: 'normal',
})

const mono = async (weight: FontWeight): Promise<Font> => ({
  name: 'IBM Plex Mono',
  data: await readFile(
    join(
      process.cwd(),
      'node_modules',
      '@fontsource',
      'ibm-plex-mono',
      'files',
      `ibm-plex-mono-latin-${weight}-normal.woff`,
    ),
  ),
  weight,
  style: 'normal',
})

const fonts: Font[] = [await sans(400), await sans(600), await mono(500)]

export interface OgCard {
  title: string
  description?: string
  eyebrow?: string
  footer?: string
}

function node(
  type: string,
  style: Record<string, string | number>,
  children?: Node | Node[] | string,
): Node {
  return { type, props: { style, children } }
}

/** Draws the card and returns the raw PNG bytes. */
export async function renderOgCard(card: OgCard): Promise<Uint8Array> {
  const monoLabel = {
    fontFamily: 'IBM Plex Mono',
    fontSize: 26,
    fontWeight: 500,
    letterSpacing: 4,
  }

  // Masthead: the sheet's own letterhead line.
  const head = node(
    'div',
    {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      borderBottom: `2px solid ${INK}`,
      paddingBottom: '22px',
    },
    [
      node('div', { ...monoLabel, color: INK, width: CONTENT - RIGHT_COLUMN }, 'BLOG.IANKITKUMAR.IN'),
      node(
        'div',
        { ...monoLabel, color: MUTED, width: RIGHT_COLUMN, textAlign: 'right' },
        'FIELD LOG',
      ),
    ],
  )

  const body: Node[] = []

  if (card.eyebrow) {
    body.push(
      node(
        'div',
        {
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 16,
          fontFamily: 'IBM Plex Mono',
          fontSize: 26,
          fontWeight: 500,
          letterSpacing: 3,
          color: MUTED,
          marginBottom: 28,
        },
        [
          node('div', { width: 12, height: 12, backgroundColor: ACCENT, borderRadius: 2 }),
          node('div', { display: 'flex' }, card.eyebrow.toUpperCase()),
        ],
      ),
    )
  }

  body.push(
    node(
      'div',
      {
        display: 'flex',
        fontSize: card.title.length > 46 ? 58 : 70,
        fontWeight: 600,
        lineHeight: 1.12,
        letterSpacing: -1.6,
        maxWidth: CONTENT,
      },
      card.title,
    ),
  )

  if (card.description) {
    body.push(
      node(
        'div',
        {
          display: 'flex',
          marginTop: 26,
          fontSize: 30,
          lineHeight: 1.4,
          color: SOFT,
          maxWidth: CONTENT - 40,
        },
        card.description,
      ),
    )
  }

  const foot = node(
    'div',
    {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      borderTop: `2px solid ${RULE}`,
      paddingTop: 22,
      fontFamily: 'IBM Plex Mono',
      fontSize: 24,
      fontWeight: 500,
      letterSpacing: 2,
      color: MUTED,
    },
    [
      node('div', { display: 'flex', width: CONTENT - RIGHT_COLUMN }, card.footer ?? 'ANKIT KUMAR'),
      node(
        'div',
        { color: ACCENT, width: RIGHT_COLUMN, textAlign: 'right' },
        'IANKITKUMAR.IN',
      ),
    ],
  )

  const root = node(
    'div',
    {
      // Satori treats the root's width and height as the content box and
      // adds the padding on top, so the canvas comes out at 1200x630
      // only if the root itself is the inset size.
      width: CONTENT,
      height: HEIGHT - 128,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      backgroundColor: PAPER,
      color: INK,
      padding: '64px 72px',
      fontFamily: 'IBM Plex Sans',
    },
    [
      head,
      node(
        'div',
        {
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          paddingBlock: '36px',
        },
        body,
      ),
      foot,
    ],
  )

  const svg = await satori(root as never, { width: WIDTH, height: HEIGHT, fonts })

  const { Resvg } = await import('@resvg/resvg-js')
  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: WIDTH },
  })
  return resvg.render().asPng()
}
