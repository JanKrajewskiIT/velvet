---
name: solidjs-component
description: SolidJS component patterns for VelvetUi -- Props convention, component inventory, hooks, toast system, overlay pattern, shared utils. Use when creating or modifying components.
---

> Type: Skill (operational playbook)
> Source of truth: Rules define mandatory constraints; skills describe execution patterns.

Operational playbook for building components. Normative constraints live in rules (`project-core`, `solidjs-tsx`, `reactivity-performance`, `css-modules`, `demo-app`, `git-standards`).

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

## Handler Extraction Playbook

- Default: extract non-trivial inline JSX handlers to named handlers above `return`
- Keep trivial reactive pass-through wrappers inline when needed for Solid correctness:
  - `onClick={() => props.onClose()}`
  - `onSubmit={(event) => props.onSubmit(event)}`
- In `<For>` lists, extract to handler factories that capture plain `item`/`index()` values
- Do not build top-level handler factories that read reactive props/signals during render; this causes `solid/reactivity` warnings
- After handler extraction, run lint and revert over-extractions that regress reactivity safety

## Reactivity Performance Playbook

- Start with restrictive defaults:
  - derived values -> `createMemo`
  - synchronization effects -> `createEffect(on(..., { defer: true }))`
  - multi-signal transitions -> `batch(...)`
- For high-frequency flows:
  - `scroll`/`resize`/pointer move -> `requestAnimationFrame` throttle
  - search/preview typing -> `createDeferred` or debounced `setTimeout`
- Always pair timers/raf/listeners with `onCleanup`
- If bridging to imperative callbacks (e.g. chart libraries), keep localized imperative mirrors only for stale-closure prevention

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

## DOM Hygiene Playbook

Use this checklist whenever you add, audit, or review a component. Normative rules live in `dom-hygiene`.

### Audit checklist

For every wrapper element in the render tree, ask:

1. Does it carry real semantics (role, landmark, form grouping) that the child cannot carry?
2. Does it compose more than one child into a layout?
3. Does it own state, focus, or measurement logic?
4. Is it a recognized reusable primitive (`Card`, `Field`, `LabelText`, ...)?

If the answer to all four is no, the wrapper is redundant. Inline its class/style onto the child and delete the wrapper plus its unused CSS rule.

### Merge-wrapper-into-child recipes

- Single-child wrapper with a class -> move the class onto the child via `classNames(childExistingClass, wrapperClass)`
- Single-child wrapper with inline `style` -> forward style directly to the child or expose a CSS custom property on the child's default class
- Wrapper only there for `gap`/`display: flex` around a single child -> drop both the wrapper and its CSS class; if spacing is needed, put it on the parent layout or the child's own class
- Wrapper carrying a semantic tag (`article`, `section`, `nav`) -> pass `as="article"` (or equivalent) to the primitive and forward `draggable` / `role` / `aria-*` to it

### Exposing class extension props instead of wrapping

When a consumer needs to style an internal part of a primitive and currently wraps it to do so, add an opt-in class prop to the primitive rather than accepting the wrapper:

- `Button` -> `contentClass` for the inner content slot
- `FlipCard` -> `frontClass` / `backClass` for each face
- `Table` and similar composites -> `containerClass` for the outer scroll/overflow shell

Rules for new `*Class` props:

- Merge via `classNames(defaultClass, consumerClass)` -- never replace defaults
- Do not expand scope; each `*Class` prop addresses one named internal node
- Keep the default visual unchanged when the prop is not provided
- Document what the slot is for in the component's Props type so consumers do not misuse it

### Splitting structural vs presentational CSS

For primitives with positioning or animation (`FlipCard`, overlays, transform-based faces), split CSS into two layers:

```css
.flipCardFront {
  /* structural: position, transform, backface-visibility, stacking */
}

.defaultFace {
  /* presentational: background, border, radius, shadow, padding */
}
```

In TSX, apply `defaultFace` only when the consumer did not pass a matching `*Class`:

```tsx
<div class={classNames(styles.flipCardFront, local.frontClass ? local.frontClass : styles.defaultFace)} />
```

This lets consumers restyle faces without breaking the flip animation or positioning.

### Conditional rendering patterns

- `Dialog` components already manage `showModal()`/`close()` through their own `open` prop -- do not wrap them in `<Show when={open}>`
- To avoid wrapper `div`s when optional parts (label, description, icon) are absent, use `<Show fallback={<Child />}> <Wrapper>...<Child /></Wrapper> </Show>` and lift the child into a local variable
- When the same child is used inside two different wrappers, extract it once and switch wrappers via `<Show fallback={...}>` -- do not duplicate JSX across branches

### Action-slot wrappers: keep vs drop

Keep an action-slot wrapper only when it provides layout or flex constraints that the child cannot carry alone (e.g. `flex-shrink: 0`, media-query-driven stacking, multi-button row layout). Drop it when it only wraps a single primitive that already accepts the class.

### Before committing a DOM refactor

- Delete every `.module.css` rule that became orphaned
- Verify the final tree is still valid semantically (roles, labels, landmarks)
- Verify focus order and keyboard behavior did not regress
- Verify no silently lost layout styles (`display`, `gap`, `flex-direction`) when flattening wrappers
