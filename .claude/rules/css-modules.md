---
paths:
  - 'src/**/*.module.css'
---

# CSS Modules

- camelCase classes (`.menuItem`) -- never kebab/PascalCase
- Design tokens from `globals.css`: `var(--color-*)`, `var(--spacing-*)`, `var(--font-size-*)`, `var(--radius-*)`, `var(--shadow-*)`
- Never hardcode colors/spacing/shadows
- Never import CSS from another component
- Dark theme via semantic tokens -- never target `[data-theme='dark']`
