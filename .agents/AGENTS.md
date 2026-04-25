# VelvetUi

SolidJS UI component library: `@jankrajewskiit/ui`. TypeScript, CSS Modules, Vite.
Peers: `solid-js >=1.9`, `@solidjs/router >=0.15`.

## Commands

`npm run verify` (typecheck + lint + build + test), `npm run build`, `npm run lint:fix`, `npm run format`, `npm test`

## Git

Branch from `main`, conventional commits (`feat:`, `fix:`, `refactor:`, `docs:`). CI publishes on push to `main`.

## Structure

`src/components/{category}/` (9 categories, 58+ components), `src/hooks/`, `src/models/Props.ts`, `src/theme/`, `src/utils/`, `src/i18n/`, `src/index.ts`, `config/`, `demo/`

## Rules and Skills

Normative constraints live in `.claude/rules/` (loaded automatically by file path).
Operational playbooks live in `.claude/skills/` (invoke with `/solidjs-component`, `/design-tokens`, `/library-tooling`).
