---
title: Moving 200–300 subscriptions across 25 Azure tenants
description: Consolidating scattered Azure subscriptions into one governed tenant structure without orphaning a single one — and keeping ServiceNow CAM honest throughout.
pubDate: 2025-04-17T11:00:00Z
author: Ankit Kumar
tags:
  - Azure
  - Governance
  - Terraform
  - ServiceNow
draft: false
---

Hundreds of Azure subscriptions lived across **25 non-primary tenants**, each with its own governance. Different policies, uneven visibility, and no shared source of truth between production, non-production, and development.

Two teams were stuck by this. Security had no clean way to enforce a baseline, because the baseline was per-tenant and the tenants disagreed. Finance had no clean view of who owned what.

The move was to consolidate those tenants into the **WK CTC (Security) Team** tenant structure, with governance policies applied at the **management-group level** so they inherit into every subscription underneath.

## Why management groups and not per-subscription policies

Applying policies subscription by subscription is how you end up with 300 subscriptions and 300 policy assignments to reconcile before every audit. Management groups make the policy a property of the *structure* — a subscription inherits by existing in the right place, and moving a subscription moves its policy with it.

Terraform applied those baselines at the management-group level, which meant the desired state was in version control and the diff was reviewable.

## The part that took the most care: not orphaning anything

A migration like this fails quietly. Subscriptions get transferred, ownership records get forgotten, and six months later nobody knows what a subscription is for or who pays for it.

So **ServiceNow Cloud Account Management was the system of record throughout**, not just at the end:

- The subscription set was scoped with Security and Cloud Ops before any transfer
- Per-subscription transfers were automated through Azure DevOps Pipelines
- CAM records were kept in sync **throughout** — no drift, no backfill at the end
- Cutover windows were coordinated with the tenant owners

The pipeline did the transfer; the record followed it. Nothing depended on a human remembering to update two systems.

## The result

The full migration completed in **2.5–3 months** with consistent policy enforcement and improved visibility across all environments. ServiceNow CAM was the single source of truth throughout, and there were **no orphaned subscriptions**.

## What I'd repeat

- **Move the record with the resource.** Any system of record that is updated after the fact is a backfill waiting to become a problem.
- **Version the governance.** Policy as code in the management group is reviewable; policy in a portal is not.
- **Scope the set with the people who will live with it.** Security and Cloud Ops had to agree on the boundary before any automation ran.
