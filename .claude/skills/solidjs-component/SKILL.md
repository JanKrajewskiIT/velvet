---
name: solidjs-component
description: SolidJS component patterns for VelvetUi -- Props convention, component inventory, hooks, toast system, overlay pattern, shared utils. Use when creating or modifying components.
---

> Type: Skill (operational playbook)
> Source of truth: Rules define mandatory constraints; skills describe execution patterns.

Operational playbook for building components. Normative constraints live in rules (`project-core`, `solidjs-tsx`, `css-modules`, `demo-app`, `git-standards`).

## Standard Component Shape

`import type Props from "~/models/Props"` -> semantic interface -> `(props: Props<X>) =>` -> `export default`

Use shared core native subsets from `~/models/Props.ts` instead of exposing full `JSX.*HTMLAttributes`.
`Props<T>` already covers `class`, `id`, `aria-*`, and `data-*`.

## File Structure

`ComponentName/ComponentName.tsx` + `ComponentName.module.css`

Export from `src/index.ts` as `{ default as X }`.
`ThemeProvider` and `ToastProvider` use `ParentProps` because they do not expose DOM-like public contracts.

## Primitive-first Design

- Prefer extending existing VelvetUi primitives over wrapper-only components
- Keep one primitive per role in a family
- Label-driven APIs should use explicit semantic props like `label`, `message`, `description`
- Prefer `label` over `title` for component-level labels
- Reuse shared label contracts from `~/models/Props.ts`
- Render labels and descriptions through VelvetUi typography primitives, preferably `LabelText`
- Wrapper components are valid only when they add real semantics, defaults, or state

## Built-in Copy Philosophy

- VelvetUi owns generic reusable copy
- Do not push all text to props by default
- Preferred resolution order:
  - semantic prop override when truly justified
  - `messages` override
  - built-in `useI18n()` default
- If a component needs a new built-in label, add it to `src/i18n/messages.ts`
- Do not leave user-facing fallback strings in component logic when the library should own them

## Code / JSX Separation

- Define handlers and computed values above `return`
- Prefer `createMemo` for derived state
- Reserve `createEffect` for real side effects
- Keep JSX focused on rendering, not business logic

## Styling Ownership

- Keep shared primitive visuals inside the primitive module; host components should position, not reskin
- For neutral/default visual constraints and allowed emphasis variants, follow `project-core` and `css-modules` rules

## Hooks

Use shared hooks from `~/hooks/` when applicable:

- `useClickOutside`
- `useEscapeKey`
- `useFocusTrap`
- `useOverlayAnimation`

## Overlay Pattern

Overlays follow a shared pattern:

- `useEscapeKey` + `useFocusTrap` for keyboard/focus handling
- `useOverlayAnimation` for enter/exit transitions
- `classNames()` for conditional class composition
- `Heading` for titles
- `IconButton` for close actions

## Utilities

Use shared utilities from `~/utils/`:

- `classNames(...)`
- `joinAriaIds(...)`
- `resolveAriaInvalid(...)`
- `resolveAriaErrorMessage(...)`
- Form and color helpers already present in the repo

## Extraction Guidance

- When bringing app code into VelvetUi, extract reusable patterns, not product-specific workflows 1:1
- Rename contracts to neutral generic names where possible
- If a component is still strongly domain-shaped, either generalize it before export or treat it as a template/business-layer piece
