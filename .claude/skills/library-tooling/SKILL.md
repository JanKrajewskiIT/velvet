---
name: library-tooling
description: Vite library build, TypeScript config, ESLint, Prettier, Husky, config presets, npm publishing, and how to add new components. Use when modifying build config or tooling.
---

## Vite Config (`vite.config.ts`)

- Plugins: `vite-plugin-solid` + `vite-plugin-dts` (from `tsconfig.app.json`)
- Alias: `~ -> src/`
- Library build: entry `src/index.ts`, name `VelvetUi`, formats `es` + `umd`
- Output: `dist/velvet-ui.js` (ESM), `dist/velvet-ui.umd.cjs` (UMD), `dist/velvet-ui.css`
- External: `solid-js`, `solid-js/web`, `solid-js/store`, `@solidjs/router`
- `cssCodeSplit: false` -- all CSS bundled into one file
- `optimizeDeps`: `solid-markdown` excluded; transitive deps explicitly included

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

Config sources in `config/` directory (not `src/`).

## TypeScript

- Target: ES2024, `verbatimModuleSyntax`, `noUncheckedIndexedAccess`, `erasableSyntaxOnly` (no `enum`)
- JSX: `preserve` + `jsxImportSource: solid-js`
- Paths: `~/* -> src/*`

## ESLint (flat config)

`@eslint/js` -> `typescript-eslint` strictTypeChecked -> `eslint-plugin-solid` -> `eslint-config-prettier` -> `jsx-a11y` -> `simple-import-sort` -> `unused-imports`.
Rules: `require-unicode-regexp`, `solid/reactivity: warn`. Ignores: `dist`, `*.d.ts`, `vite.config.*`, `*.mjs`.

## Prettier

`endOfLine: lf`, `singleQuote: true`, `trailingComma: es5`

## Husky + lint-staged

Pre-commit: `*.{ts,tsx}` -> eslint --fix + prettier --write; `*.{css,json,md}` -> prettier --write.

## Publishing

`.npmrc` configures `@jankrajewskiit` scope to `npm.pkg.github.com`. GitHub Actions publishes on push to `main`. Consumers need `read:packages` PAT as `NODE_AUTH_TOKEN`.

## Adding a New Component

1. Pick category: `actions-and-forms/`, `data-display/`, `feedback-and-states/`, `layouts/`, `overlays/`, `workflows/`
2. Create `MyComponent/MyComponent.tsx` + `MyComponent.module.css`
3. Export from `src/index.ts`
4. Run `npm run verify`
5. Bump version in `package.json`, push to publish
