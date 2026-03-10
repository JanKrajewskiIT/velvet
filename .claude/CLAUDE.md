# VelvetUi

SolidJS UI component library: `@jankrajewskiit/ui`. TypeScript, CSS Modules, Vite.
Peers: `solid-js >=1.9`, `@solidjs/router >=0.15`.

## Commands

`npm run verify` (typecheck + lint + build + test), `npm run build`, `npm run lint:fix`, `npm run format`, `npm test`

## Git

Branch from `main`, conventional commits (`feat:`, `fix:`, `refactor:`, `docs:`). CI publishes on push to `main`.

## Structure

`src/components/{category}/` (6 categories, 58+ components), `src/hooks/`, `src/models/Props.ts`, `src/theme/`, `src/utils/`, `src/index.ts`, `config/`, `demo/`

## Principles

- Generic, app-agnostic -- no i18n/auth/app logic, all text via props
- Self-documenting -- no comments, no commented-out code, no `eslint-disable`
