import sitemap from '@astrojs/sitemap'
import { defineConfig } from 'astro/config'

// blog.iankitkumar.in — a static site on Cloudflare Pages.
//
// `site` is what every canonical URL, the sitemap, and the RSS feed are
// built from, so it must match the zone the Pages project is bound to.
// `trailingSlash: 'ignore'` lets /notes and /notes/ resolve to the same
// page; the canonical we emit is always the non-slashed form.
export default defineConfig({
  site: 'https://blog.iankitkumar.in',
  trailingSlash: 'ignore',
  build: {
    format: 'directory',
    inlineStylesheets: 'auto',
  },
  compressHTML: true,
  markdown: {
    shikiConfig: {
      theme: 'github-light',
      wrap: true,
    },
  },
  integrations: [
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
    }),
  ],
})
