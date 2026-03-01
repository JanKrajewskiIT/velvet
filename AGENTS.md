# AGENTS.md — VelvetUi

Shared SolidJS UI component library published as `@jankrajewskiit/ui` to GitHub Packages. TypeScript, CSS Modules, Vite library build. Peer dependencies: `solid-js >=1.9`, `@solidjs/router >=0.15`.

## Skills Reference

Detailed conventions are available as on-demand skills. Load them when working on a specific area:

| Skill | When to load |
|---|---|
| `solidjs-component` | Creating/modifying SolidJS components (Props, CSS Modules, theming, component inventory) |
| `library-tooling` | Vite library build, TypeScript config, ESLint, Prettier, Husky, npm publishing |

## Build & Publish Commands

```bash
npm install                    # install dependencies
npm run build                  # tsc -b && vite build (outputs dist/)
npm run typecheck              # tsc -b (typecheck only)
npm run lint                   # eslint .
npm run lint:fix               # eslint . --fix
npm run format                 # prettier --write .
npm run format:check           # prettier --check .
```

### Pre-commit Checklist

Always run before committing: `npm run typecheck && npm run lint && npm run build`

### Publishing

The package is published to GitHub Packages via GitHub Actions on push to `main`. Version is set in `package.json`. Consumers authenticate with a `NODE_AUTH_TOKEN` that has `read:packages` scope.

### Git Conventions

- Branch from `main`, use conventional commits: `feat:`, `fix:`, `refactor:`, `docs:`

## Project Structure

```
src/
├── components/
│   ├── common/              # Reusable UI primitives (29 components)
│   │   ├── AccessDenied/
│   │   ├── ActionRow/
│   │   ├── AiResultPanel/
│   │   ├── Button/
│   │   ├── Chip/
│   │   ├── ConfirmDialog/
│   │   ├── Dialog/
│   │   ├── DropdownButton/
│   │   ├── DropdownMenu/
│   │   ├── EmptyState/
│   │   ├── ErrorMessage/
│   │   ├── FormField/
│   │   ├── FormGrid/
│   │   ├── FormLayout/
│   │   ├── IconButton/
│   │   ├── Input/           # Input, Select, TextArea
│   │   ├── JsonDisplay/
│   │   ├── LoadingContainer/
│   │   ├── LocaleSwitcher/
│   │   ├── MarkdownEditDialog/
│   │   ├── MarkdownRenderer/
│   │   ├── RequireAuth/
│   │   ├── ScoreRing/
│   │   ├── SectionCard/
│   │   ├── Spinner/
│   │   ├── StatCard/
│   │   ├── Tabs/
│   │   ├── TagChip/
│   │   └── ThemeToggle/
│   └── layout/              # Layout components
│       ├── Footer/
│       ├── MainLayout/
│       └── Navbar/          # Navbar, MenuBar, MenuItem, MenuIndicator, NavItem type
├── hooks/
│   ├── useClickOutside.ts
│   └── useEscapeKey.ts
├── models/
│   └── Props.ts             # Props<T> utility type
├── theme/
│   ├── globals.css          # CSS custom properties (design tokens)
│   └── ThemeProvider.tsx     # Light/dark/system theme context
├── utils/
│   ├── color.ts             # getContrastTextColor
│   └── form.ts              # orEmpty, numberToString, emptyToNull, parseFloatOrNull
└── index.ts                 # Public API barrel export
```

## Public API

Everything exported from `src/index.ts`:

- **29 common components**: AccessDenied, ActionRow, AiResultPanel, Button, Chip, ConfirmDialog, Dialog, DialogActions, DialogBody, DialogTitle, DropdownButton, DropdownItem, DropdownMenu, EmptyState, ErrorMessage, FormField, FormGrid, FormLayout, IconButton, Input, Select, TextArea, JsonDisplay, LoadingContainer, LocaleSwitcher, MarkdownEditDialog, MarkdownRenderer, ScoreRing, SectionCard, Spinner, StatCard, Tabs, TagChip, ThemeToggle
- **3 layout components**: Footer, MainLayout, Navbar + NavItem type
- **Theme**: ThemeProvider, useTheme, ThemeChoice type
- **Hooks**: useClickOutside, useEscapeKey
- **Utils**: getContrastTextColor, orEmpty, numberToString, emptyToNull, parseFloatOrNull
- **Types**: Props<T>
- **Styles**: `@jankrajewskiit/ui/styles` exports the bundled CSS (globals + all component styles)

## Design Principles

- Components are **generic and app-agnostic** — no i18n calls, no auth calls, no app-specific logic
- All user-facing text is passed via **props** — consumers resolve translations at the call site
- Layout components use **JSX slots** (`navbar?`, `footer?`, `actions?`, `logo?`) for composition
- Every component accepts `class?: string` via the `Props<T>` utility type

## Security & Comments

- Code should be self-documenting — no comments in frontend code
- No commented-out code
