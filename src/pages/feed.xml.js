import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';

export async function GET(context) {
  const blog = (await getCollection('blog')).filter((post) => !post.data.draft);
  return rss({
    title: 'blog.iankitkumar.in',
    description: 'Learning notes by Ankit Kumar — DevOps, cloud, and infrastructure.',
    stylesheet: false,
    site: context.site,
    items: blog.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: `/blog/${post.id}/`,
    })),
    customData: '<language>en-us</language>',
    canonicalUrl: 'https://blog.iankitkumar.in',
  });
}
