---
title: An MCP server that queries Splunk like an SRE
description: Exposing SPL authoring, cluster health, and error tails to MCP clients — with read-only roles, scoped indexes, and an audit log of every tool call.
pubDate: 2026-05-21T16:00:00Z
author: Ankit Kumar
tags:
  - MCP
  - Splunk
  - AI
  - TypeScript
draft: false
---

SPL authoring is a craft. Writing `| eval` and `| stats` by hand is slow, and during an incident it is slow at exactly the wrong moment. The question I wanted to answer was narrow: **can a model query Splunk the way an SRE would, without becoming a new thing to defend?**

The answer is a Model Context Protocol server, and the interesting part is not the tools — it is the boundaries around them.

## The tools

| Tool | What it does |
|---|---|
| `splan_search` | Validates and runs a **read-only** SPL query against a scoped index |
| `cluster_status` | Multi-site indexer cluster health summary |
| `recent_errors` | Tails recent errors for a given sourcetype |

`cluster_status` is the one that changed my own workflow. Asking for cluster health as a structured response, rather than reading it off a dashboard, removes the step where I reconstruct the state in my head before I can reason about it.

## The boundaries

An MCP server that can run arbitrary SPL against a production index is a very large thing to hand to a language model. So it is not one:

- **A dedicated read-only Splunk account.** The server's credentials cannot write, cannot delete, cannot restart anything.
- **Scoped indexes.** The server can only see the indexes it was scoped to, not the estate.
- **Every tool invocation is audited** into a dedicated Splunk index. Not sampled — every one.
- **Rate limiting per session**, so a confused loop cannot hammer the search tier.

The audit log is the piece I would keep even if the rest were free. It is the difference between "the model did something" and "the model did *this*, at this time, and I can see it".

## Where it stands

Still **experimental**, and tested against a non-production Splunk instance. Internally it has already made authoring SPL faster and given me a structured view of Splunk state during incidents — but it is not a deployment, and I would not point it at production without a deliberate review of the tool surface.

## What I'd repeat

- **Give the model the least privilege that still works.** Read-only, scoped, and audited are not paranoia; they are the product.
- **Make the audit log a first-class output.** If you cannot see what the agent did, you cannot debug it or trust it.
- **Start on a non-production instance.** Every instinct says to try it on the real thing first, because the real thing has the real data. It does not.
