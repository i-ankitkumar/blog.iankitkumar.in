import type { APIRoute } from 'astro'
import { renderOgCard } from '~/lib/og'
import { formatDate, getPublishedPosts } from '~/lib/posts'

export async function getStaticPaths() {
  const posts = await getPublishedPosts()
  return posts.map((post) => ({
    params: { slug: post.id },
    props: {
      title: post.data.title,
      description: post.data.description,
      eyebrow: `${formatDate(post.data.pubDate)} · ${post.data.tags.join(' · ')}`,
    },
  }))
}

export const GET: APIRoute = async ({ props }) => {
  const png = await renderOgCard({
    title: props.title,
    description: props.description,
    eyebrow: props.eyebrow,
  })

  return new Response(png as BodyInit, {
    headers: {
      'content-type': 'image/png',
      'cache-control': 'public, max-age=31536000, immutable',
    },
  })
}
