---
paths:
  - 'src/**/*.tsx'
---

# SolidJS TSX

## Language and Reactivity

- Arrow functions only, never `function` declarations
- Never JS-destructure props
- Never React patterns (`useState`, `useEffect`, `className`)
- `splitProps` + `{...rest}` only for real HTML wrapper components with intentional passthrough
- Prefer `createMemo` over `createEffect` for derived state
- Keep multi-step logic out of JSX; define handlers and computed values above `return`

## Props and Exports

- `import type Props from "~/models/Props"` - never deep relative paths
- Inline `Props<T>` in the component signature
- Reuse shared contracts from `~/models/Props.ts` instead of redefining common `aria-*`, `label`, or native props
- Never expose full `JSX.*HTMLAttributes` on public component APIs; use narrow shared subsets plus explicit semantic props
- Keep `name` local to form-like controls only
- `export default` unless generic typing makes a named export clearly better

## Imports and Shared Utilities

- Always use `~/` path aliases for hooks, utils, and models
- Use `classNames()` for conditional classes
- Merge ARIA ids with `joinAriaIds()` and derive validation ARIA with `resolveAriaInvalid()` / `resolveAriaErrorMessage()` when applicable

## Primitive Hierarchy

- Use VelvetUi primitives instead of raw HTML equivalents wherever possible:
  - `Heading` for headings
  - `Text` for body copy
  - `Button` / `IconButton` / `ButtonBase` for actions and triggers
  - `Input` / `TextArea` / `InputBase` for text fields
- Label-driven APIs should prefer semantic props like `label`, `message`, `description`
- Prefer `label` over `title` for component-level labels; reserve `title` for real domain data
- Use `LabelText` for label/description rendering instead of duplicating inline text stacks

## Built-in Copy and i18n

- Generic reusable copy belongs in VelvetUi i18n
- Do not leave hardcoded user-facing fallback strings in component logic when the library should own that copy
- Resolution order for reusable text:
  - semantic prop override when justified
  - `messages` override
  - built-in `useI18n()` default
- When adding new built-in copy, add the key to `src/i18n/messages.ts`
- Only expose text props when customization is part of the real component contract, not as a reflex

## Style Prop and Dynamic Styling

- Always use object syntax: `style={{ key: value }}`
- Dynamic CSS values should go through CSS custom properties
- Static styles belong in `.module.css`
- Inline style is reserved for truly runtime-driven values

## Extraction Guidance

- When extracting app code into VelvetUi, generalize patterns before export
- Prefer reusable shells, cards, selectors, panels, and workflows over business-specific flows copied verbatim
