---
title: Domain, DNS, and Pages without breaking email
description: How iankitkumar.in got Cloudflare DNS, Email Routing, and two Pages sites — without touching MX/SPF/DKIM.
pubDate: 2026-08-04T13:00:00Z
author: Ankit Kumar
tags:
  - Cloudflare
  - DNS
  - DevOps
draft: false
---

I bought `iankitkumar.in`, pointed nameservers at **Cloudflare**, then attached:

- Portfolio → `iankitkumar.in` (static Pages project)
- Blog → `blog.iankitkumar.in` (this Astro site)

## The rule that saved me

**Never edit MX / SPF / DKIM when shipping websites.** Email Routing (`mail@iankitkumar.in` + catch-all) keeps working if you only *add* web CNAMEs.

## Layout that worked

| Name | Type | Target |
|---|---|---|
| `@` / `www` | CNAME (proxied) | portfolio Pages |
| `blog` | CNAME (proxied) | blog Pages |
| MX + SPF + DKIM | email | Cloudflare Email Routing |

## Takeaway

Same zone can host sites and forward email. Split portfolio and blog into **two Pages projects** so each can use the right toolchain and fail independently.
