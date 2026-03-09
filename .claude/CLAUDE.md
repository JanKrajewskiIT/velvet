# CLAUDE.md — VelvetUi

Shared SolidJS UI component library published as `@jankrajewskiit/ui` to GitHub Packages. TypeScript, CSS Modules, Vite library build. Peer dependencies: `solid-js >=1.9`, `@solidjs/router >=0.15`.

## Skills Reference

Load on-demand skills when working on a specific area:

| Command              | When to use                                                                                   |
| -------------------- | --------------------------------------------------------------------------------------------- |
| `/solidjs-component` | Creating/modifying SolidJS components (Props, CSS Modules, component inventory, Toast, hooks) |
| `/library-tooling`   | Vite library build, TypeScript config, ESLint, Prettier, Husky, config presets, publishing    |
| `/design-tokens`     | CSS custom properties reference — colors, spacing, typography, shadows, z-index, animations   |

## Build & Publish Commands

```bash
npm install                    # install dependencies
npm run build                  # tsc -b && vite build (outputs dist/)
npm run typecheck              # tsc -b (typecheck only)
npm run lint                   # eslint .
npm run lint:fix               # eslint . --fix
npm run format                 # prettier --write .
npm run format:check           # prettier --check .
npm test                       # Node.js test runner
npm run verify                 # full pipeline: typecheck + lint + build + test
```

### Pre-commit Checklist

Always run before committing: `npm run verify`

### Publishing

Published to GitHub Packages via GitHub Actions on push to `main`. Version set in `package.json`. Consumers authenticate with `NODE_AUTH_TOKEN` (`read:packages` scope).

## Git Conventions

Branch from `main`, use conventional commits: `feat:`, `fix:`, `refactor:`, `docs:`

## Project Structure

```
src/
├── components/
│   ├── actions-and-forms/   # ActionRow, Button, Checkbox, Input, Select, etc. (19)
│   ├── data-display/        # Accordion, Table, ScoreRing, RadarChart, etc. (9)
│   ├── feedback-and-states/ # Chip, Spinner, Toast, Skeleton, StatCard, etc. (11)
│   ├── layouts/             # Footer, MainLayout, Navbar
│   ├── overlays/            # Dialog, Drawer, Tooltip, ConfirmDialog, ConfirmAction (6)
│   └── workflows/           # AiResultPanel, Wizard, Tabs, FileDropZone, etc. (10)
├── hooks/
│   ├── useClickOutside.ts
│   └── useEscapeKey.ts
├── models/
│   └── Props.ts             # Props<T> utility type
├── theme/
│   ├── globals.css          # CSS custom properties (design tokens)
│   └── ThemeProvider.tsx
├── utils/
│   ├── color.ts             # getContrastTextColor
│   └── form.ts              # orEmpty, numberToString, emptyToNull, parseFloatOrNull
└── index.ts                 # Public API barrel export
```

## Design Principles

- Components are **generic and app-agnostic** — no i18n calls, no auth calls, no app-specific logic
- All user-facing text is passed via **props** — consumers resolve translations at the call site
- Layout components use **JSX slots** (`navbar?`, `footer?`, `actions?`, `logo?`) for composition
- Every component accepts `class?: string` via the `Props<T>` utility type

## Code Style

- Code is self-documenting — no comments in frontend code
- No commented-out code
- No `eslint-disable` directives
