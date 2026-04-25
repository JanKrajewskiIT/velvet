---
paths:
  - 'src/**/*.test.tsx'
  - 'src/**/*.test.ts'
  - 'src/**/*.spec.tsx'
  - 'src/**/*.spec.ts'
---

> Type: Rule (normative constraints)
> Source of truth: Rules define mandatory constraints; skills define operational playbooks.

# Testing

## Baseline Coverage

- New reusable components must include tests for render and core interaction behavior
- Cover at least the key states that change behavior: disabled, loading, error, selected, expanded, or equivalent
- Validate keyboard interactions for actionable controls
- Add an accessibility smoke assertion for semantic rendering where practical

## What to Test

- Default render: component mounts without errors and exposes the correct role/accessible name
- State variants: each prop that changes rendered output or behavior (disabled, invalid, loading, open, ...)
- Keyboard: Tab focus, Enter/Space activation, Escape dismissal, arrow navigation where applicable
- ARIA wiring: `aria-invalid`, `aria-errormessage`, `aria-describedby` on field-like components
- Callbacks: verify `onChange`, `onClose`, `onSubmit` fire with correct arguments

## What Not to Test

- Internal implementation details (signal values, CSS class names)
- Visual appearance or exact pixel layout
- Third-party primitive internals already covered by the library

## Style

- One `describe` block per component; nested `describe` for distinct state groups
- Test descriptions read as plain English sentences: "renders disabled state", "calls onChange on input"
- Prefer user-event interactions over firing raw DOM events
- Keep each test focused on a single behavior; avoid multi-assertion integration tests unless the flow is genuinely atomic
