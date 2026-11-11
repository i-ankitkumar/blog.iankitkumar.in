import { type CollectionEntry, getCollection } from 'astro:content'

/**
 * blog.iankitkumar.in — Post helpers
 *
 * Every page that lists posts goes through these helpers, so a draft can
 * never leak into the site from one page and not another. The rule is
 * simple: a post is published when `draft` is false, and the published
 * list is always sorted newest first.
 */

export type Post = CollectionEntry<'blog'>

/** A post that is safe to publish. */
export function isPublished(post: Post): boolean {
  return !post.data.draft
}

/** Published posts, newest first. */
export async function getPublishedPosts(): Promise<Post[]> {
  const posts = await getCollection('blog')
  return posts
    .filter(isPublished)
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
}

/** A tag slug: lowercase, hyphenated, safe in a URL. */
export function slugifyTag(tag: string): string {
  return tag
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Every published tag with the posts filed under it, plus a count.
 * Sorted by post count descending, then alphabetically, so the topic
 * index reads as a ranked list rather than an unordered tag cloud.
 */
export async function getTags(): Promise<{ tag: string; slug: string; posts: Post[] }[]> {
  const posts = await getPublishedPosts()
  const byTag = new Map<string, { tag: string; slug: string; posts: Post[] }>()

  for (const post of posts) {
    for (const raw of post.data.tags) {
      const slug = slugifyTag(raw)
      if (!slug) continue
      const entry = byTag.get(slug) ?? { tag: raw, slug, posts: [] }
      entry.posts.push(post)
      byTag.set(slug, entry)
    }
  }

  return [...byTag.values()].sort(
    (a, b) => b.posts.length - a.posts.length || a.tag.localeCompare(b.tag),
  )
}

/** The published posts filed under one tag slug. */
export async function getPostsByTag(slug: string): Promise<Post[]> {
  const posts = await getPublishedPosts()
  return posts.filter((post) => post.data.tags.some((tag) => slugifyTag(tag) === slug))
}

/** `2026-08-04` → `04 Aug 2026`, in the log's own date style. */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date)
}

/** `2026-08-04` → `04.08.2026`, for the ledger column. */
export function formatLedgerDate(date: Date): string {
  const day = String(date.getUTCDate()).padStart(2, '0')
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  return `${day}.${month}.${date.getUTCFullYear()}`
}

/** ISO date for a machine-readable attribute. */
export function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10)
}

/** Minutes of reading, rounded up, at 200 words a minute. */
export function readingTime(body: string | undefined): number {
  if (!body) return 1
  const words = body.split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 200))
}
