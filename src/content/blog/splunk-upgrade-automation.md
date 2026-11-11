---
title: When the upgrade is the outage
description: Splunk Enterprise upgrades across AWS and Azure ran as manual events, so they got deferred. Making them a button press with automatic rollback.
pubDate: 2024-09-12T09:30:00Z
author: Ankit Kumar
tags:
  - Splunk
  - Automation
  - Multi-cloud
  - Python
draft: false
---

Splunk Enterprise upgrades across our production estate ran as manual, attended events. Each one was a scheduled slot, a runbook, and a person watching. That is a perfectly reasonable way to do a quarterly upgrade when you have four nodes. It stops being reasonable when a failed upgrade takes observability offline for the teams depending on it.

We did not have four nodes. We had **20,000+ endpoints** across AWS and Azure, and the upgrade had become the thing everyone deferred — which pushed security and reliability debt forward every quarter.

## What broke

Not a bug. A queue. Upgrades were deferred because the risk of a failed one outweighed the cost of being a version behind, and nobody could articulate the risk in a way that made the deferral look like a decision.

## What I changed

I built an orchestrator in Python that runs the same four steps on every node, on both clouds, with nobody watching:

1. **Pre-check** — query the existing Splunk monitoring for the node's health before touching it.
2. **Apply** — run the upgrade through AWS SSM for EC2 nodes, Azure Run Command for Azure nodes.
3. **Validate** — re-check the same post-conditions against the monitoring.
4. **Roll back** — on any failure signal, revert automatically. No human in the loop.

The key move was reusing the monitoring we already had for the pre- and post-conditions. The upgrade orchestrator did not need to know what "healthy" meant for Splunk; it asked the same monitoring that the on-call engineer already trusted. That kept the definition of success in one place.

The last part was process, not code: wiring the orchestrator into the existing change-control process so a release became a standard change instead of an event.

## The result

**20,000+ endpoints upgraded at a 99.9% success rate.** Failed deployments self-reverted instead of becoming incidents. Upgrade cadence stopped being a scheduling negotiation.

## What I'd repeat

- **Rollback must be automatic and boring.** The first version of any automation like this is a happy path with a panic button. The panic button is where the incidents live.
- **Reuse the existing definition of health.** It is usually already written, tested, and trusted. Re-implementing it in the orchestrator creates a second truth that disagrees with the first one.
- **Automate the change window, not just the steps.** If the upgrade still needs a meeting, the risk has not moved — it has just been spread thinner.
