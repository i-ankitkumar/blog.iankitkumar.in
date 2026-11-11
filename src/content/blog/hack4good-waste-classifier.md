---
title: The hackathon classifier that rated a neighbourhood's waste
description: April 2020, three people, one weekend — a TensorFlow object detection model behind a Flask app that scored a community on how well it sorted its garbage.
pubDate: 2020-04-25T12:00:00Z
author: Ankit Kumar
tags:
  - Hackathon
  - Computer Vision
  - TensorFlow
  - Team Lead
draft: false
---

This is where it started.

At the Hack4Good hackathon at KC College of Engineering, the brief was the **Garbage Profiling Problem**: capture images at local garbage collection points, analyse them, and rate a community on how well it separates its waste — so civic bodies could see exactly where enforcement was needed.

We were three people. I led the team. We had one weekend.

## The shape of it

The TensorFlow Object Detection API (1.15) did the classification, and a Flask app served it:

- **The model** — TensorFlow Object Detection API, set up and its dependencies resolved during the event
- **The service** — Flask, with the model wired in behind a simple interface
- **The inference path** — `live_inference.py` taking a **video stream** rather than single image uploads

The video stream was the right call and I would make it again. A collection point is not a photograph you take — it is a place you point a camera at and watch. Judging a stream and judging a snapshot are different problems, and the stream is the one the brief actually described.

## What a weekend actually produces

Everything you would hope, and one thing you would not:

- A working prototype **delivered on the day**, with a recorded demo video and a public repository
- The setup work done from scratch — the Object Detection API and its dependency tree are not a small thing to assemble under a deadline
- The login left open, because it was a hackathon build and any id and password would work

That last one is on the record and it is still true in the repository. It was a deliberate choice for a weekend prototype that was never going to hold real data, and it is also exactly the kind of thing that should not survive contact with production.

## Why it is still here

Everything I do now — the Splunk clusters, the automation, the MCP servers — comes from the same habit this project needed: get a model running, wrap it in something someone can actually call, and put it in front of a real person on the same day.

The stack has changed completely. The deadline discipline has not.

## What I'd repeat

- **Ship on the day.** A prototype that works on Sunday and a slide that works on Monday are not the same thing.
- **Pick the input format the brief implies.** Video, not screenshots.
- **Leave the security holes in the hackathon build, on purpose.** But write down that you did, so nobody inherits them later.
