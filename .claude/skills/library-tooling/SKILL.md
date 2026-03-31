---
name: library-tooling
description: Vite library build, TypeScript config, shared config presets, npm publishing, adding new components. Use when modifying build config or tooling.
---

> Type: Skill (operational playbook)
> Source of truth: Rules define mandatory constraints; skills describe execution patterns.

## Build

Vite + `vite-plugin-solid` + `vite-plugin-dts`. Entry `src/index.ts`, formats `es`+`umd`.
Output: `dist/velvet-ui.{js,umd.cjs,css}`. External: `solid-js/*`, `@solidjs/router`. `cssCodeSplit: false`.

## Package exports

`.` -> types + import + require. `./styles` -> CSS.

## Shared config sub-paths

`@jankrajewskiit/ui/{eslint,prettier,vite,lint-staged}-config`, `tsconfig`, `husky/pre-commit`. Sources in `config/`.

## TypeScript

ES2024, `verbatimModuleSyntax`, `noUncheckedIndexedAccess`, `erasableSyntaxOnly` (no `enum`). JSX `preserve`, `jsxImportSource: solid-js`. Paths: `~/* -> src/*`.

## ESLint (flat)

`@eslint/js` > `typescript-eslint` strictTypeChecked > `eslint-plugin-solid` > `prettier` > `jsx-a11y` > `simple-import-sort` > `unused-imports`.

## Publishing

GitHub Packages via Actions on push to `main`. Consumers need `read:packages` PAT as `GHCR_TOKEN`.

## Adding a component

1. Create `{category}/ComponentName/ComponentName.tsx` + `.module.css`
2. Export from `src/index.ts`
3. `npm run verify`
