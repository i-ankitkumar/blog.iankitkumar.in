# blog.iankitkumar.in

The field log for [blog.iankitkumar.in](https://blog.iankitkumar.in) — short,
practical notes from Ankit Kumar's production work: DevOps, cloud, Splunk,
Azure, Terraform, automation, and reliability.

The portfolio at [iankitkumar.in](https://iankitkumar.in) holds the record of
what has been built; this holds the notes.

## Stack

- [Astro 7](https://astro.build) — static output, content collections
- Plain CSS with a token layer (`src/styles/tokens.css`), no framework
- Light and dark themes, with a toggle that overrides the system preference
- Self-hosted IBM Plex Sans / IBM Plex Mono — no third-party request at runtime
- [Satori](https://github.com/vercel/satori) + resvg for Open Graph cards, rendered at build time
- Biome for lint and format, `astro check` for types
- Cloudflare Pages (`blog-iankitkumar-in`)

## Layout

```
src/
  components/    Header, Footer, Ledger
  content/blog/  the posts (markdown)
  layouts/       Base (head, SEO, JSON-LD), Post
  lib/
    site.ts      identity, links, metadata — the single source of truth
    posts.ts     published-post helpers, tag slugs, date and reading-time formats
    og.ts        the Open Graph card renderer
  pages/         routes
  styles/        tokens.css, fonts.css, global.css
```

## Local

```bash
npm install
npm run dev          # http://localhost:4321
npm run dev -- --background   # background server; see `astro dev logs`
```

## Writing a post

Create `src/content/blog/<slug>.md`:

```markdown
---
title: The title
description: One sentence, used in the list and the meta description.
pubDate: 2026-08-04T09:30:00Z
author: Ankit Kumar
tags:
  - Splunk
draft: false
---

The body.
```

`draft: true` keeps the post out of the site entirely — not built, not listed,
not in the feed.

## Before pushing

```bash
npm run check    # astro check + biome check
npm run build
```

## Deploy

Pushing to `main` builds and deploys through GitHub Actions. To deploy by
hand, or to publish a preview branch:

```bash
npm run deploy
npx wrangler pages deploy dist --project-name=blog-iankitkumar-in --branch=preview
```

The API token lives outside the repository: `~/services/iankitkumar-deploy/.env`
locally, and the `CLOUDFLARE_API_TOKEN` / `CLOUDFLARE_ACCOUNT_ID` secrets in
CI.

## Related

- Portfolio: [iankitkumar.in](https://iankitkumar.in)
- Source: [github.com/i-ankitkumar/blog.iankitkumar.in](https://github.com/i-ankitkumar/blog.iankitkumar.in)
