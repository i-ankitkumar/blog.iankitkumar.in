---
title: Scanning 2,500 subscriptions for tech debt
description: Tech debt across cloud, OS, and database layers was invisible at estate scale. A three-layer scanner plus remediation pipelines turned it into a backlog you can work through.
pubDate: 2025-02-06T10:00:00Z
author: Ankit Kumar
tags:
  - Reliability
  - Automation
  - Azure
  - AWS
draft: false
---

At **2,500+ Azure and AWS subscriptions**, tech debt is not a problem you solve by auditing. Manual audits could not keep up with the estate, remediation was ticket-driven and inconsistent, and P1/P2 incidents kept recycling the same root causes.

The tell was that the incidents looked familiar. We fixed the same class of drift, in the same handful of layers, over and over — because nothing was telling us it was there before it broke.

## Three layers, not one

The scanner was deliberately split by layer, because each layer fails differently and each has a different tool that already knows how to look:

| Layer | Signal | Source |
|---|---|---|
| Cloud | Policy compliance, misconfiguration | Azure Policy, AWS Config, custom checks |
| OS | Patch state, configuration drift | Fleet inventory |
| Database | Schema drift, deprecated features | Database inventory |

One scanner trying to know everything is a scanner that knows nothing. Splitting by layer let each layer keep its own source of truth and report into one place.

## Findings that something can act on

The output was not a report. It was an **inventory with a schema**, and two things consumed it:

1. **Azure DevOps remediation pipelines** that either auto-remediated a finding or opened a tracked ticket against the owner. Auto-fix where the fix was safe and unambiguous; a ticket everywhere else.
2. **Owner-level dashboards**, so the backlog was visible to the person who could clear it rather than to a team that could only see the total.

The piece that changed incident volume most was linking remediation into the **on-call RCA workflow**. A recurring root cause got a path back to source, so the same drift stopped arriving as a fresh incident every few weeks.

## The result

- 2,500+ subscriptions scanned continuously across all three layers
- 2,000+ flagged resources resolved through the remediation pipeline
- 400+ P1/P2 incidents resolved with proper RCA and SLA adherence
- The scanner became the early-warning system for the issues that used to become incidents

## What I'd repeat

- **A finding nobody can act on is a spreadsheet.** The schema and the remediation path matter more than the detection logic.
- **Auto-remediate only what is unambiguous.** Everything else should be a ticket, not a guess.
- **Connect findings to the on-call loop.** Detection without a route back to source is just a better dashboard.
