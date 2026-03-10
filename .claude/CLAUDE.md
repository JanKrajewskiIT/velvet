# VelvetUi

Shared SolidJS UI component library: `@jankrajewskiit/ui` (GitHub Packages).
TypeScript, CSS Modules, Vite library build. Peers: `solid-js >=1.9`, `@solidjs/router >=0.15`.

## Commands

```bash
npm run verify    # typecheck + lint + build + test (pre-commit)
npm run build     # tsc -b && vite build
npm run lint:fix  # eslint --fix
npm run format    # prettier --write
npm test          # Node.js test runner
```

## Git

Branch from `main`, conventional commits (`feat:`, `fix:`, `refactor:`, `docs:`).
Published via GitHub Actions on push to `main`.

## Structure

```
src/components/{category}/    # 6 categories, 58+ components
src/hooks/                    # useClickOutside, useEscapeKey
src/models/Props.ts           # Props<T> = T & { class?: string }
src/theme/globals.css          # design tokens (CSS custom properties)
src/theme/ThemeProvider.tsx    # light/dark/system
src/utils/                    # color.ts, form.ts
src/index.ts                  # barrel export
config/                       # shared tooling presets (eslint, prettier, tsconfig, vite, husky)
demo/                         # local dev app
```

Categories: `actions-and-forms/` (19), `data-display/` (9), `feedback-and-states/` (11), `layouts/` (3), `overlays/` (6), `workflows/` (10).

## Principles

- Generic, app-agnostic -- no i18n/auth/app logic. All text via props.
- Self-documenting -- no comments, no commented-out code, no `eslint-disable`
