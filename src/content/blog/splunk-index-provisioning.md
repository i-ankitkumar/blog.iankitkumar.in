---
title: 3–5 days to 10–15 minutes
description: Splunk index provisioning took days because a ticket became a queue. Automating it from ServiceNow through Azure DevOps Pipelines cut the turnaround to minutes.
pubDate: 2025-07-09T09:00:00Z
author: Ankit Kumar
tags:
  - Splunk
  - Automation
  - ServiceNow
  - Azure
draft: false
---

Someone needed a new Splunk index. They raised a ticket. The ticket sat in a queue, someone picked it up, someone else approved it, someone provisioned it, and the requester was told when it was ready.

The whole thing took **3–5 days**.

Nothing about that was technically hard. An index is a small object with a known shape. The time was entirely in the queue: handoffs, waiting, and the fact that every step depended on a person being awake and free.

## What I changed

I automated the path end to end, using the systems that already held the truth:

```
ServiceNow request → Azure DevOps Pipeline → index provisioned → ticket updated
```

The request form in **ServiceNow** was already collecting what was needed — so the pipeline consumed the request as it was raised, rather than asking anyone to re-type the same facts into a different tool. **Azure DevOps Pipelines** did the provisioning, and the ticket was updated when it finished.

The interesting design decision was what happened on failure. A failed pipeline does not just stop; it updates the same ticket with what failed and what to do about it. The requester is never left looking at a stale open ticket, which was the thing that made people stop trusting the old process.

## The result

Turnaround went from **3–5 days to 10–15 minutes**. The number that matters is not the minutes — it is that the request no longer queues behind anyone's calendar.

## What I'd repeat

- **Automate the whole path, not the last step.** Provisioning the index in 30 seconds and leaving the ticket in a queue for three days is the same slow process with a faster middle.
- **Let the requester's own form be the input.** Every re-typed field is a field that can be wrong, and a field that can be wrong will be.
- **Report failures back to the requester.** A pipeline that fails silently is worse than the queue it replaced, because now nobody is watching it at all.
