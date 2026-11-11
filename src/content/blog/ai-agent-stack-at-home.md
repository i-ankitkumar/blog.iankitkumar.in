---
title: Building the production pattern at home first
description: A self-hosted multi-agent stack — orchestration, shared memory, codebase graphs, and an MCP-aware runtime — running the same architecture I put into production at work.
pubDate: 2026-07-16T13:00:00Z
author: Ankit Kumar
tags:
  - AI
  - MCP
  - Self-hosted
  - Python
draft: false
---

Single-agent CLIs lose state between sessions and share no context between roles. Real engineering work — code, infrastructure, design, ops — needs persistent memory, an understanding of the codebase, and orchestration that knows which agent should do what.

I built that at home before I could point it at anything that mattered.

The stack is self-hosted and has four layers:

| Layer | What it does |
|---|---|
| **Paperclip** | Orchestration — agents as employees, with budgets, governance, and workspace isolation per role |
| **Honcho** | Persistent cross-session memory — per-agent sessions plus shared cross-agent context, including reasoning across agents and the human |
| **GitNexus** | Codebase knowledge graphs, indexed per repo — symbol-level queries, call chains, execution flows |
| **Hermes** | The agent runtime — desktop CLI, MCP-aware, multi-profile for switching between personal and project contexts |

Specialised agents cover dev, qa, infra, marketing, and design, each in its own workspace. Custom MCP servers wire external systems in — the same pattern as the Splunk MCP server, but aimed at whatever the agents need to reach.

## Why build this at home first

The honest reason is that a home stack has no stakeholders. There is no change advisory board, no security review, no on-call rota, and no second team whose work depends on yours. That makes it a cheap place to find out whether the architecture is right.

It is also why the production version at work is the more interesting one. At home I can restructure the whole stack when the design is wrong. At work, the pattern has to survive an ARC review, a change window, and the fact that observability cannot go down for a week.

So the two are deliberately the same shape. The home version is the rehearsal — and the rehearsal is what let me bring a pattern to work that people could believe in, because I had already run it.

## What it is good for

It is a daily driver for software engineering, infrastructure review, QA, marketing content, and design. The MCP servers are the seam that matters: whatever an agent needs to reach, it reaches through a tool with a schema, not through a shell prompt.

## What I'd repeat

- **Isolation is the feature.** Separate workspaces per agent role is what stops one agent's context from becoming another's problem.
- **Memory is the hard part, not the model.** The difference between an assistant that forgets and one that does not is entirely the memory layer.
- **Build the rehearsal where it is cheap.** If the architecture is wrong, you want to find that out at home.

## Where it stands

This is a personal, self-hosted stack — not a production system, and not a product. It is the home version of a pattern I am putting into production at work, and it is where the ideas get tested before they go near anything anyone else depends on.
