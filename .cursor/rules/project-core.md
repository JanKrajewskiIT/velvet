---
paths:
  - '**/*'
---

> Type: Rule (normative constraints)
> Source of truth: Rules define mandatory constraints; skills define operational playbooks.

# VelvetUi - Core Principles

## Scope and Responsibilities

- Generic, app-agnostic core components: no auth, data-fetching, or business workflow logic in primitives
- When extracting code from an app into VelvetUi, prefer reusable patterns and renamed generic contracts over copying business flows 1:1
- If an extracted component still reads as domain-specific, generalize it before export or treat it as a template/business-layer component

## Code Style and Cleanliness

- Self-documenting code: no comments explaining obvious behavior, no commented-out code, no `eslint-disable`
