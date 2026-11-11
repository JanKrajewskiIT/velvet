# Velvet UI docs

Everything an engineer or LLM needs to build Velvet UI in code. Start with `AGENTS.md`.

- `AGENTS.md`: stack-neutral guide: ground rules, what to use, targets, conventions, order of work, verification, syncing.
- `AGENTS-solid.md`: addendum for porting to SolidJS (workflow, structure, harness, rules). Copy it next to `AGENTS.md`.
- `rules.md`: token layers, CSS rules, composition rules and implementation rules, with the quick-reference tables. Canonical: there are no separate specimen cards for them.
- `components.md`: generated map of all components: one table per source folder with group, module, dependency level, deps, CSS classes, sibling exports and a one-line description, plus the helpers and the sections. Do not edit by hand; `sync-sections.mjs` writes it from `bundle.js`, the component READMEs and `sections.json`.
- `solid-porting.md`: React → Solid translation, helpers, tricky patterns, golden example.
- `lint-tokens.mjs`: token lint of `components/bundle.css` (ref-token reads, colour literals, spacing off the scale, px literals tracked) and of the specimens (ref-token reads). `node docs/lint-tokens.mjs` exits with code 1 on a violation.
- `sync-sections.mjs`: propagates `showcase/sections.json` (single source of section titles, descriptions and order) into the bundle header, the `group=` markers, `showcase/cards.json` and `components.md`. Run `node docs/sync-sections.mjs` from the project root; `--check` only reports.

Design decisions (voice, colour, type, motion, iconography) live in the project `README.md`, the brand book.

Where the code is: `components/bundle.js` (React reference, one module per source file), `components/index.d.ts` (props), `components/bundle.css` + `tokens.json` (styles), `components/<n>/preview.html` (specimens) and `components/<n>/README.md` (usage notes).

Not here on purpose: `SKILL.md`, `design-system.json`, `artifact-type/` (files the design tool reads; not needed for a port).
