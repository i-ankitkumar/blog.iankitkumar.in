---
title: 35% off the Azure bill, and then keeping it off
description: Cost work usually stops when the project ends. Driving cleanup from the same inventory that finds tech debt made the saving continuous instead of quarterly.
pubDate: 2025-11-20T10:30:00Z
author: Ankit Kumar
tags:
  - Azure
  - Cost
  - Automation
  - Reliability
draft: false
---

Cloud cost work has a shape. A team runs a cleanup project, finds a year of accumulated waste, deletes it, posts the number, and then the spend starts climbing again — because nothing changed about the estate. The saving was a one-off event, and the drift came straight back.

We got **35% Azure cost reduction** through right-sizing and cleanup automation. The interesting part is not the percentage. It is that the saving has stayed.

## Where the money actually was

Right-sizing and cleanup are two different jobs that get lumped together:

- **Right-sizing** is about resources that are running too large — an over-provisioned VM, a SKU sized for a spike that became a baseline. Nothing is broken; the estate is just paying for headroom it stopped using.
- **Cleanup** is about resources that serve no purpose at all — unattached disks, empty resource groups, forgotten dev resources, orphaned identities, idle capacity left behind by a project that ended.

The second category is easier to find and much less valuable per item. The first category is where most of the money is, and it is invisible without an inventory that knows what each resource is *doing*, not just that it exists.

## Making it continuous

The lever was not a better cleanup script. It was the inventory from the tech-debt scanner: a schema that says what every resource is, what it belongs to, and whether it has drifted from the baseline it was created against.

That inventory became the input for remediation pipelines that either act on a finding or raise a ticket against the owner. Cost findings stopped being a report and started being a work item in the same queue as everything else.

So the saving works like this:

1. The scanner finds over-provisioned or orphaned resources continuously.
2. The inventory records ownership, so a finding has somewhere to go.
3. The remediation pipeline fixes what is safe to fix, and escalates the rest.
4. Cost stops being a project because the estate never gets to accumulate the debt in the first place.

The automation also cut BAU operational workload by roughly **35%** — the same pipelines that clean up are the ones doing the routine work.

## The result

**35% Azure cost reduction** through right-sizing and cleanup automation, and ~35% less BAU workload overall. The second number is the one I would argue is harder and worth more.

## What I'd repeat

- **Fix the inflow.** A cleanup you run monthly is a subscription to doing it monthly.
- **Attach ownership to every finding.** A cost finding without an owner is a finding that goes to the bin.
- **Measure the same estate before and after.** Cost numbers that come from a different scope are a comparison, not a result.
