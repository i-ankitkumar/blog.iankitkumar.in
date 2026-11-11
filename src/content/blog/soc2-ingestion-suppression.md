---
title: Suppressing sensitive fields at index time
description: SOC2 and financial reporting both needed the same Splunk data. The sensitive fields had to never land in the index — a dashboard filter is too late.
pubDate: 2023-10-12T09:00:00Z
author: Ankit Kumar
tags:
  - Splunk
  - SOC2
  - Security
  - Dashboards
draft: false
---

Two teams wanted the same thing from the same Splunk deployment: the **audit team** needed live SOC2 control visibility, and **finance** needed clean reporting signals. Neither had a source of truth they trusted, and every piece of evidence was pulled from logs after the fact.

The visible problem was dashboards. The real problem was that **sensitive fields had no ingestion controls** — they were in the index, and every dashboard, search, and saved view inherited them.

## Why a dashboard filter is not a control

It is tempting to solve this by hiding fields in the dashboard. But a field that lands in the index has already been written to disk, replicated to the cluster, and made available to anyone who can search it. A dashboard filter hides it from a view. It does not remove it from the estate.

So the suppression had to happen **at index time** — before the data is written, not after it is read.

## The shape of it

- **Splunk dashboards** fronting pre-built searches over the SOC2 control set — the audit team reads a control, not a query
- **Index-time ingestion suppression** for the sensitive fields, so they never enter the index in the first place
- **Azure Entra ID** wired into the data flow for SSO and access scoping
- **Alerting on control drift**, so a control that stops reporting is itself a signal rather than a gap someone notices in an audit
- **Runbooks for new-control onboarding**, because the first control is a project and the fortieth should be a page

The dashboard library was built iteratively **with** the SOC2 and finance teams rather than handed to them. Their questions are what shaped which controls got a view and which got a runbook.

## The result

Audit-ready visibility for SOC2, and cleaner financial-reporting signals for leadership. The same patterns — pre-built searches, index-time suppression, drift alerting — were extended to the control sets that came after.

## What I'd repeat

- **Suppress at the earliest point you control.** A field never written is a field never leaked, and it is also a field nobody has to remember to filter.
- **Alert on the absence of a control.** A dashboard that stops reporting is the failure nobody notices.
- **Build with the readers.** The audit team knew which controls they would be asked about; I did not.
