import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import { z } from 'astro/zod'

/**
 * blog.iankitkumar.in — Content schema
 *
 * Every fact a post carries about itself lives in its frontmatter, and
 * the schema is what decides whether that frontmatter is valid. A post
 * that is missing a description, or that carries a date the site cannot
 * read, fails the build instead of failing quietly on the page.
 */
const blog = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    author: z.string().default('Ankit Kumar'),
    // ISO-8601. `z.coerce.date()` accepts '2026-08-04' and
    // '2026-08-04T09:30:00Z' and rejects '08/04/2026', which is
    // ambiguous enough to be read two different ways.
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
})

export const collections = { blog }
