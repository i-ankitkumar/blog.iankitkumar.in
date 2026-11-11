import type { APIRoute } from 'astro'
import { renderOgCard } from '~/lib/og'
import { SITE } from '~/lib/site'

export const GET: APIRoute = async () => {
  const png = await renderOgCard({
    title: SITE.tagline,
    description: SITE.description,
    eyebrow: 'Infrastructure notes · Splunk · Azure · Terraform',
    footer: SITE.name.toUpperCase(),
  })

  return new Response(png as BodyInit, {
    headers: {
      'content-type': 'image/png',
      'cache-control': 'public, max-age=31536000, immutable',
    },
  })
}
