# Velvet UI docs

Everything an engineer or LLM needs to build Velvet UI in code. Start with `AGENTS.md`.

- `AGENTS.md`: how to port the DS to SolidJS (workflow, structure, verification, rules). Copy it to the root of the target repo.
- `components.md`: map of all components (deps, CSS, specimens, DS section).
- `foundations.md`: tokens, theming, hard rules, content voice.
- `composition.md`: which atom/component to use for what.
- `solid-porting.md`: React → Solid translation, helpers, tricky patterns, golden example.

Not here on purpose:
- `components/**/<Name>.prompt.md`: per-component usage notes. They stay next to the component code.
- `readme.md`, `SKILL.md`, `CLAUDE.md` (root): files the design tool reads. Not needed for the port.
