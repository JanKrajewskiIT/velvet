# VelvetUi

SolidJS UI component library: `@jankrajewskiit/ui`. TypeScript, CSS Modules, Vite.
Peers: `solid-js >=1.9`, `@solidjs/router >=0.15`.

## Commands

`npm run verify` (typecheck + lint + build + test), `npm run build`, `npm run lint:fix`, `npm run format`, `npm test`

## Git

Branch from `main`, conventional commits (`feat:`, `fix:`, `refactor:`, `docs:`). CI publishes on push to `main`.

## Structure

`src/components/{category}/` (9 categories, 58+ components), `src/hooks/`, `src/models/Props.ts`, `src/theme/`, `src/utils/`, `src/index.ts`, `config/`, `demo/`

## Principles

- Generic, app-agnostic -- no i18n/auth/app logic, all text via props
- Self-documenting -- no comments, no commented-out code, no `eslint-disable`
- Always use `~/` path alias for hooks, utils, models -- never deep relative paths
- Use `classNames()` utility for conditional class composition -- never template literal concatenation for multi-condition classes
- Use VelvetUi primitives (Heading, Text, Button, IconButton, ButtonBase, Input, TextArea) -- never raw HTML equivalents
- Style prop must use object syntax `style={{ key: value }}` -- never string syntax (enforced by `solid/style-prop` lint rule)
- Dynamic values go through CSS custom properties (`style={{ '--my-var': value }}` + `var(--my-var)` in `.module.css`) -- never direct inline CSS for what CSS can handle
- Static styles belong in `.module.css` -- inline style only for truly dynamic runtime values (virtualization, user dimensions, DOM measurements)
- Demo app uses only library components and design tokens -- no inline styles, all layout via `demo.css` utility classes
