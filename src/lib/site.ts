/**
 * blog.iankitkumar.in — Site configuration
 *
 * Single source of truth for identity, links, and metadata. Anything the
 * site states about its author lives here, so a page never hard-codes a
 * URL or a name that this file already owns.
 */

export const SITE = {
  name: 'Ankit Kumar',
  blogName: 'blog.iankitkumar.in',
  title: 'Field log',
  tagline: 'DevOps, cloud & infrastructure notes from production work.',
  description:
    'Short, practical notes from production work — Splunk, Azure, AWS, Terraform, automation, and reliability.',

  // Canonical identity
  siteUrl: 'https://blog.iankitkumar.in',
  portfolioUrl: 'https://iankitkumar.in',
  email: 'mail@iankitkumar.in',

  // Public handles
  github: 'https://github.com/i-ankitkumar',
  linkedin: 'https://www.linkedin.com/in/i-ankitkumar',

  // Static assets
  faviconUrl: '/favicon.svg',
  defaultOgImage: '/og/default.png',

  // Hosting
  hosting: 'Cloudflare Pages · project blog-iankitkumar-in',

  // Primary navigation
  nav: [
    { label: 'Notes', href: '/blog/', external: false },
    { label: 'Topics', href: '/topics/', external: false },
    { label: 'Portfolio', href: 'https://iankitkumar.in', external: true },
    { label: 'RSS', href: '/feed.xml', external: false },
  ],
} as const

export type SiteConfig = typeof SITE
