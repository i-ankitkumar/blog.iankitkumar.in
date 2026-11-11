---
title: 20,000 endpoints, 79 factories, 70 countries
description: Global Windows patch operations at Colgate GBS, layered tooling that each did one job, and the zero-day response that could not wait for a maintenance window.
pubDate: 2022-03-10T07:30:00Z
author: Ankit Kumar
tags:
  - Patch ops
  - Endpoints
  - Security
  - PowerShell
draft: false
---

Global Windows endpoint operations for Colgate GBS meant **20,000+ endpoints across 79 factories in 70 countries**. Patch cycles, software distribution, inventory, and the kind of zero-day call that does not respect a maintenance window.

Three tools, each doing one job. None of them was the "right" tool for everything, and pretending otherwise was the mistake.

| Tool | What it owned |
|---|---|
| SCCM / MECM | Primary software distribution, OS deployment, inventory |
| Workspace One | Mobile and modern management |
| Tanium | Real-time visibility and patch telemetry |

Tanium in particular earned its place: patch telemetry in near real time, across a fleet where the sites had genuinely different network realities. Patch compliance on a box in a factory in one country and a laptop on a VPN in another are not the same problem, and seeing the difference in minutes is what made the rest possible.

## Automation as the actual work

The patch cycle was the responsibility, but the leverage came from PowerShell. Three automations carried most of the repetitive weight:

- **Silent application deployment** — no user interaction, no hand-holding across a time zone.
- **Software decommissioning** — removing what was no longer licensed or needed.
- **License reconciliation** — comparing what was deployed against what was paid for.

Licence reconciliation was the one people did not expect to be automatable. It is a comparison of two systems that disagree for ordinary reasons, and doing it by hand meant doing it badly.

## Zero-day response

I ran an on-call rotation alongside the Security team for emergency patches. The shape that made it work was unglamorous: the patch could be pushed without waiting for a full fleet sync, and the telemetry to confirm it landed came from the same place the normal cycle used. No separate emergency path, no separate visibility.

The outcome was a consistent global compliance posture, and zero-day patches landing fast across all geographies.

## What I'd repeat

- **Layer tools by function and accept the seams.** Three tools that each do one thing well beat one tool that does everything adequately, even if the handoffs are ugly.
- **Automate the reconciliation, not just the action.** The manual part of any comparison is where the mistakes live.
- **Build one path for emergencies.** A separate fast path is a second thing to keep correct at 3 a.m.
