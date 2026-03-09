# VelvetUi

Shared SolidJS UI component library published as `@jankrajewskiit/ui` to GitHub Packages.
TypeScript, CSS Modules, Vite library build. Peers: `solid-js >=1.9`, `@solidjs/router >=0.15`.

## Commands

```bash
npm run verify    # full pipeline: typecheck + lint + build + test
npm run build     # tsc -b && vite build (dist/)
npm run typecheck # tsc -b
npm run lint:fix  # eslint . --fix
npm run format    # prettier --write .
npm test          # Node.js test runner
```

Pre-commit: `npm run verify`

## Git

Branch from `main`, conventional commits: `feat:`, `fix:`, `refactor:`, `docs:`
Published to GitHub Packages via GitHub Actions on push to `main`.

## Structure

```
src/
  components/
    actions-and-forms/   # ActionRow, Button, Checkbox, Input, Select... (19)
    data-display/        # Accordion, Table, ScoreRing, RadarChart... (9)
    feedback-and-states/ # Chip, Spinner, Toast, Skeleton, StatCard... (11)
    layouts/             # Footer, MainLayout, Navbar (3)
    overlays/            # Dialog, Drawer, Tooltip, ConfirmDialog... (6)
    workflows/           # AiResultPanel, Wizard, Tabs, FileDropZone... (10)
  hooks/                 # useClickOutside, useEscapeKey
  models/Props.ts        # Props<T> = T & { class?: string }
  theme/globals.css      # CSS custom properties (design tokens)
  theme/ThemeProvider.tsx # light/dark/system theme context
  utils/                 # color.ts, form.ts
  index.ts               # barrel export (public API)
config/                  # shared tooling presets exported as sub-paths
demo/                    # local dev app (file:.. link)
```

## Design Principles

- Components are generic and app-agnostic -- no i18n, auth, or app-specific logic
- All user-facing text via props -- consumers resolve translations
- Layout components use JSX slots for composition
- Every component accepts `class?: string` via `Props<T>`

## Code Style

- Self-documenting code -- no comments, no commented-out code, no `eslint-disable`
