---
name: library-tooling
description: Vite library build, TypeScript config, shared config presets, npm publishing, adding new components. Use when modifying build config or tooling.
---

## Vite (`vite.config.ts`)

- Plugins: `vite-plugin-solid` + `vite-plugin-dts`
- Library build: entry `src/index.ts`, formats `es` + `umd`
- Output: `dist/velvet-ui.js`, `dist/velvet-ui.umd.cjs`, `dist/velvet-ui.css`
- External: `solid-js`, `solid-js/web`, `solid-js/store`, `@solidjs/router`
- `cssCodeSplit: false` -- all CSS in one file

## Package Exports

```json
{
  ".": {
    "types": "./dist/index.d.ts",
    "import": "./dist/velvet-ui.js",
    "require": "./dist/velvet-ui.umd.cjs"
  },
  "./styles": "./dist/velvet-ui.css"
}
```

## Shared Config Sub-paths

| Sub-path                                | Usage                                     |
| --------------------------------------- | ----------------------------------------- |
| `@jankrajewskiit/ui/eslint-config`      | `createEslintConfig()`                    |
| `@jankrajewskiit/ui/prettier-config`    | extends in package.json                   |
| `@jankrajewskiit/ui/vite-config`        | Vite helper + `solidMarkdownOptimizeDeps` |
| `@jankrajewskiit/ui/tsconfig`           | app/node/app-vite/node-vite variants      |
| `@jankrajewskiit/ui/lint-staged-config` | shared lint-staged rules                  |
| `@jankrajewskiit/ui/husky/pre-commit`   | shared pre-commit hook                    |

Config sources in `config/` directory.

## TypeScript

Target ES2024, `verbatimModuleSyntax`, `noUncheckedIndexedAccess`, `erasableSyntaxOnly` (no `enum`). JSX: `preserve` + `jsxImportSource: solid-js`. Paths: `~/* -> src/*`.

## ESLint (flat)

`@eslint/js` -> `typescript-eslint` strictTypeChecked -> `eslint-plugin-solid` -> `prettier` -> `jsx-a11y` -> `simple-import-sort` -> `unused-imports`.

## Publishing

GitHub Packages via Actions on push to `main`. Consumers need `read:packages` PAT as `GHCR_TOKEN`.

## Adding a Component

1. Pick category, create `MyComponent/MyComponent.tsx` + `.module.css`
2. Export from `src/index.ts`
3. `npm run verify`
4. Bump version, push
