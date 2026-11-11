import rss from '@astrojs/rss'
import { getPublishedPosts } from '~/lib/posts'
import { SITE } from '~/lib/site'

export async function GET(context: { site: URL | undefined }) {
  const posts = await getPublishedPosts()

  return rss({
    title: SITE.blogName,
    description: SITE.description,
    site: context.site ?? SITE.siteUrl,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: `/blog/${post.id}/`,
      categories: post.data.tags,
      author: post.data.author,
    })),
    customData: '<language>en-gb</language>',
  })
}
