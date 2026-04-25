---
name: frontend-tooling
description: Vite, TypeScript, ESLint config for the VelvetUi demo app. Use when modifying demo app build config or tooling.
---

> Type: Skill (operational playbook)
> Source of truth: Rules define mandatory constraints; skills describe execution patterns.

## Vite (Demo App)

Uses shared Vite app config from `@jankrajewskiit/ui/vite-config` (`createSolidAppViteConfig`).
Alias `~ -> src/`.

## TypeScript (Demo App)

Extends `@jankrajewskiit/ui/tsconfig/app-vite`. Key: `verbatimModuleSyntax`, `noUncheckedIndexedAccess`, `erasableSyntaxOnly`, `jsx: preserve`, `jsxImportSource: solid-js`.

## ESLint (Demo App)

Uses shared ESLint config from `@jankrajewskiit/ui/eslint-config` (`createEslintConfig`).

## Husky + lint-staged

Pre-commit: `*.{ts,tsx}` -> eslint --fix + prettier; `*.{css,json,md}` -> prettier.

## Commands

```bash
npm run dev     # demo app dev server
npm run build   # build library + demo
npm run verify  # tsc --noEmit + lint + build
```
