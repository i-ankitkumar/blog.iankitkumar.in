## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Before you commit

```
npm run check    # astro check + biome check
npm run build
```

`npm run check` must be clean. `astro check` reports type errors across `.astro`
and `.ts` files; `biome check` reports lint and formatting problems.

## Writing a post

Posts live in `src/content/blog/` as markdown. The frontmatter schema is in
`src/content.config.ts` and it is strict:

- `pubDate` is an ISO-8601 date (`2026-08-04T09:30:00Z`). The schema uses
  `z.coerce.date()`, which still accepts `08/04/2026` — but that string is
  ambiguous, so write the ISO form.
- `draft: true` keeps a post out of the site entirely. It is not built, not
  listed, and not in the feed. Every list on the site goes through
  `getPublishedPosts()` in `src/lib/posts.ts`; never call `getCollection()`
  directly in a page, or a draft can leak into the build.
- `tags` are free text. The URL slug is derived by `slugifyTag()`.

## Conventions

- Design tokens live in `src/styles/tokens.css`. Colours, spacing, and type
  sizes are never written inline in a component.
- `src/lib/site.ts` is the single source of truth for identity, links, and
  metadata. A page should not hard-code a URL that file already owns.
- The palette and the typefaces are deliberately the same family as
  iankitkumar.in. If you change one, change both.
- Fonts are self-hosted in `public/fonts/`. Nothing on the site may request a
  font, a script, or an image from a third-party origin at runtime.
- Open Graph cards are rendered at build time by `src/lib/og.ts`. The fonts
  for those cards are read from `node_modules/@fontsource/*`, so a build
  never reaches the network for a font.

## Deploying

The Cloudflare Pages project is `blog-iankitkumar-in` and it has no Git
integration, so deploys are direct uploads.

```bash
npm run deploy
```

The API token is not in this repository. It lives in
`~/services/iankitkumar-deploy/.env` for local deploys, and in the
`CLOUDFLARE_API_TOKEN` / `CLOUDFLARE_ACCOUNT_ID` repository secrets for CI.
Pushing to `main` runs `.github/workflows/deploy.yml`, which builds and
uploads for you.

To see a change on a preview URL before it reaches production:

```bash
npm run build
npx wrangler pages deploy dist --project-name=blog-iankitkumar-in --branch=preview
```
