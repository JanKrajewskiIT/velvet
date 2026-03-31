---
paths:
  - '**/*'
---

> Type: Rule (normative constraints)
> Source of truth: Rules define mandatory constraints; skills define operational playbooks.

# Git and Workflow Standards

## Branching and Flow

- Base branch: `main`
- Create feature branches from `main`
- Keep branches focused on a clear, single responsibility when possible

## Commit Messages

- Conventional commit prefixes:
  - `feat:` – new feature
  - `fix:` – bug fix
  - `refactor:` – internal refactor without behavior change
  - `docs:` – documentation-only changes
- Commit messages should:
  - Describe the _intent_ of the change, not just file names
  - Be written in the imperative mood (e.g. "add button variant")

## Versioning and Public API Changes

- Treat public exports from `src/index.ts` and public props as semver-governed API
- Typical release intent mapping:
  - `fix:` -> patch
  - `feat:` -> minor (unless explicitly breaking)
  - breaking API changes -> major
- For public API changes, include a short migration note in the PR/changes description
- Prefer additive evolution first; only remove or rename public API with explicit migration guidance

## Deprecation Policy

- Before removing a public prop or export, mark it as deprecated for at least one minor cycle
- Keep deprecated APIs functional while providing the replacement path
- Demo usage should migrate to the replacement API as soon as deprecation is introduced

## Commands and Quality Gates

- Prefer these npm scripts when working on the library:
  - `npm run verify` – typecheck + lint + build + test
  - `npm run build` – build library
  - `npm run lint:fix` – fix lint issues when possible
  - `npm run format` – apply formatting
  - `npm test` – run tests
- Before merging significant changes, aim to run at least:
  - `npm run verify`

## CI and Publishing

- CI publishes on push to `main`
- Keep `main` green and releasable; avoid pushing broken builds
