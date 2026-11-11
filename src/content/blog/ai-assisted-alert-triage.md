---
title: An LLM that triages alerts but never acts on them
description: AI-assisted triage for Splunk security alerts — strict schema, no autonomous action, and every classification carrying the model version and prompt that produced it.
pubDate: 2026-09-03T15:30:00Z
author: Ankit Kumar
tags:
  - AI
  - Splunk
  - Security
  - Python
draft: false
---

Tier-1 SOC queues get buried. The interesting question is not whether an LLM can read an alert — it is whether it can produce a **defensible first-pass triage** that frees a human to spend time on the cases that actually matter.

That is a much narrower bar than it sounds, and it is where the design decisions went.

## The pipeline

```
Splunk → webhook → FastAPI service → LLM (structured JSON, schema-validated) → Splunk (enriched notable event)
```

The LLM **never executes anything**. It is a triage assistant, not an actor. It reads an alert and writes an enrichment; it does not close an alert, touch an endpoint, or trigger a response. That line is the whole design.

## What makes a classification defensible

Two things, and neither of them is the model:

**A strict response schema, validated with Pydantic.** The output is not free text that a human has to interpret. It is severity, MITRE ATT&CK technique, and a suggested next step — in a shape that either validates or fails loudly. An unvalidated response in a SOC pipeline is an incident generator.

**Every classification carries the LLM version hash and the prompt used.** When a human asks "why did it call this critical?", the answer is a lookup, not an archaeology project. The prompt is version-controlled alongside the service, so the thing that produced a judgement is as reviewable as the code that shipped it.

## Where it stands

**Internal alpha**, on a single Splunk security use case: authentication anomalies. Directional improvement in triage time on the cases we tested — and I want to be precise about that, because "directional improvement on tested cases" is not a claim about production.

**This is not a deployment.** It has not been pointed at a live SOC queue.

## What I'd repeat

- **No autonomous action, ever.** The first version that acts is the version that has an incident, and the incident will be the model's decision, not yours.
- **Validate the output against a schema.** Strictness is the feature; a parseable answer is worth more than a clever one.
- **Record the model and the prompt with every result.** Defensible triage is an audit trail, not a model choice.
- **Start with one use case.** Auth anomalies are narrow, noisy, and reviewable — which is exactly what you want while you are still learning what the model gets wrong.
