---
title: Migrating Splunk from single-site to multi-site
description: One data centre was the blast radius. Moving to a multi-site clustered topology with per-tier RPO/RTO, rehearsed cutovers, and ARC certification.
pubDate: 2024-11-20T08:00:00Z
author: Ankit Kumar
tags:
  - Splunk
  - HA
  - DR
  - Azure
draft: false
---

Our Splunk deployment ran as a single-site indexer cluster. That was fine until it wasn't: search performance was at the limit of what the topology could carry, and a site-level incident put both recovery point and recovery time at the mercy of one building.

The internal Architecture Review Committee made the decision for us, in the way architecture committees do — HA and DR had to be demonstrable before any further scale was approved.

## The shape of it

The target was a **multi-site indexer cluster** with site affinity, a separated search-head tier, and tiered storage:

| Tier | Change | Where it lives |
|---|---|---|
| Ingest | Universal forwarders + HWF reroute | Both sites |
| Search | Search-head tier separation | Dedicated, independent of indexer site |
| Storage | Warm / cold buckets | Replicated across data centres |
| Recovery | RPO and RTO defined per tier | Rehearsed, not asserted |

Defining RPO/RTO **per tier** rather than for the platform as a whole was the part that made the numbers real. A cold bucket and a live index do not have the same recovery profile, and a single platform-level target hides that until the day it matters.

## What I did differently than I would have planned

**We rehearsed the cutover in non-production first.** Not a dry run of the plan — the actual migration, against a realistic copy of the estate, with the same health gates. The rehearsal surfaced two sequencing problems that would have been discovered in production, at the worst possible hour.

**We migrated in waves with health gates between them.** A wave was allowed to proceed only when the previous wave's search latency, indexing backlog, and replication lag were back inside their thresholds. No health gate, no next wave.

**The ARC pack was the deliverable, not the side effect.** Topology diagrams, failure-mode analysis, RPO/RTO statements, and the rollback plan. Writing the rollback plan while the topology was still changeable was cheaper than writing it afterwards.

## The result

- ARC certification approved
- Search latency improved at peak, not just at baseline
- DR posture went from single-site to multi-site with a documented, rehearsed RPO/RTO
- The topology became the reference for downstream Splunk initiatives — which is the part that actually saved time

## What I'd repeat

Rehearse the cutover, not the plan. A plan rehearsal confirms you read the document; a cutover rehearsal confirms the document was true.
