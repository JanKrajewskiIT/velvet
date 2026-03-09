# Library Tooling — VelvetUi

Build and tooling configuration for VelvetUi (`@jankrajewskiit/ui`). Covers Vite library build (ES + UMD, CSS bundling, external peer deps), TypeScript strict settings (ES2024, erasableSyntaxOnly, verbatimModuleSyntax), vite-plugin-dts for .d.ts generation, ESLint flat config, Prettier, Husky pre-commit with lint-staged, npm publishing to GitHub Packages, and package.json exports configuration.

## Vite Configuration

**File:** `vite.config.ts`

- Plugin: `vite-plugin-solid` (SolidJS JSX transform)
- Plugin: `vite-plugin-dts` (generates `.d.ts` type declarations from `tsconfig.app.json`)
- Path alias: `~ → src/`
- `optimizeDeps`: `solid-markdown` excluded; transitive deps explicitly included
- Library build:
  - Entry: `src/index.ts`
  - Name: `VelvetUi`
  - Formats: `es` + `umd`
  - Output: `dist/velvet-ui.js` (ESM), `dist/velvet-ui.umd.cjs` (UMD), `dist/velvet-ui.css` (all CSS bundled)
- External peer deps: `solid-js`, `solid-js/web`, `solid-js/store`, `@solidjs/router`
- `cssCodeSplit: false` — all CSS bundled into one file

## Package Exports

**File:** `package.json`

```json
{
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/velvet-ui.js",
      "require": "./dist/velvet-ui.umd.cjs"
    },
    "./styles": "./dist/velvet-ui.css"
  }
}
```

Consumers import components from `@jankrajewskiit/ui` and CSS via `@jankrajewskiit/ui/styles`.

## Shared Config Presets

VelvetUi also exports its own tooling configs as sub-paths so consumers can share the exact same setup:

| Sub-path                                | Consumer usage                                                          |
| --------------------------------------- | ----------------------------------------------------------------------- |
| `@jankrajewskiit/ui/eslint-config`      | `import { createEslintConfig } from '@jankrajewskiit/ui/eslint-config'` |
| `@jankrajewskiit/ui/prettier-config`    | `"prettier": "@jankrajewskiit/ui/prettier-config"` in package.json      |
| `@jankrajewskiit/ui/vite-config`        | Vite config helper + `solidMarkdownOptimizeDeps`                        |
| `@jankrajewskiit/ui/tsconfig`           | Extends base tsconfig (app/node/app-vite/node-vite variants)            |
| `@jankrajewskiit/ui/lint-staged-config` | Shared lint-staged rules                                                |
| `@jankrajewskiit/ui/husky/pre-commit`   | Shared Husky pre-commit hook                                            |

Config source files live in `config/` directory (not `src/`), compiled separately.

## TypeScript Configuration

**Files:** `tsconfig.json` (project refs) → `tsconfig.app.json` (library source) + `tsconfig.node.json` (Vite config)

Key settings:

- `target: ES2024`
- `verbatimModuleSyntax: true` — forces `import type` for type-only imports
- `noUncheckedIndexedAccess: true` — array/object index returns `T | undefined`
- `erasableSyntaxOnly: true` — **no `enum` keyword** (use const objects)
- `jsx: preserve` + `jsxImportSource: solid-js`
- `paths: ~/* → src/*` (must match Vite alias)

## ESLint

**File:** `eslint.config.mjs` (flat config)

Plugin stack: `@eslint/js` recommended → `typescript-eslint` strictTypeChecked → `eslint-plugin-solid` typescript → `eslint-config-prettier` → `jsx-a11y` recommended → `simple-import-sort` → `unused-imports`.

Notable rules:

- `require-unicode-regexp` — all regexes need `/u` flag
- `solid/reactivity: warn`
- Several strict TS rules relaxed for SolidJS compatibility

Global ignores: `dist`, `*.d.ts`, `vite.config.*`, `*.mjs`

## Prettier

**File:** `.prettierrc` — `endOfLine: lf`, `singleQuote: true`, `trailingComma: es5`

## Husky + lint-staged

**Pre-commit hook** (`.husky/pre-commit`):

- `lint-staged`: `*.{ts,tsx}` → eslint --fix + prettier --write; `*.{css,json,md}` → prettier --write

## Publishing to GitHub Packages

**File:** `.npmrc` — configures `@jankrajewskiit` scope to use `npm.pkg.github.com` registry. Authentication via `NODE_AUTH_TOKEN` environment variable.

**Workflow:** GitHub Actions publishes on push to `main`. Consumers need a GitHub PAT with `read:packages` scope set as `NODE_AUTH_TOKEN`.

## Scripts

```bash
npm run build          # tsc -b && vite build (outputs dist/)
npm run typecheck      # tsc -b (typecheck only)
npm run lint           # eslint .
npm run lint:fix       # eslint . --fix
npm run format         # prettier --write .
npm run format:check   # prettier --check .
npm test               # Node.js test runner
npm run verify         # full pipeline: typecheck + lint + build + test
```

## Adding a New Component

1. Pick the right category directory:
   - `src/components/actions-and-forms/` — inputs, buttons, forms
   - `src/components/data-display/` — tables, charts, content renderers
   - `src/components/feedback-and-states/` — status, loading, toasts
   - `src/components/layouts/` — page layout shells
   - `src/components/overlays/` — dialogs, drawers, tooltips
   - `src/components/workflows/` — complex multi-step patterns
2. Create `MyComponent/MyComponent.tsx` + `MyComponent/MyComponent.module.css`
3. Export from `src/index.ts`: `export { default as MyComponent } from './components/<category>/MyComponent/MyComponent'`
4. Run `npm run verify` to confirm it compiles, lints, and passes tests
5. Bump version in `package.json` and push to publish

## Key Files

- `src/index.ts` — barrel export (public API surface)
- `src/theme/globals.css` — CSS design tokens (imported by index.ts, bundled into output CSS)
- `src/theme/ThemeProvider.tsx` — light/dark/system theme context
- `src/models/Props.ts` — `Props<T>` utility type
- `vite.config.ts` — Vite library build configuration
- `package.json` — package metadata, exports, peer deps
- `.npmrc` — GitHub Packages registry configuration
