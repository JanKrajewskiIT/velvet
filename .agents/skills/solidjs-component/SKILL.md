---
name: solidjs-component
description: SolidJS component patterns for VelvetUi -- Props convention, component inventory, hooks, toast system, overlay pattern, shared utils. Use when creating or modifying components.
---

## Standard component

`import type Props from '~/models/Props'` > interface > `(props: Props<X>) =>` > `export default`

With HTML attribute spreading: `interface XOwnProps extends JSX.*HTMLAttributes` + `splitProps` + `{...rest}`.

## File structure

`ComponentName/ComponentName.tsx` + `.module.css`. Export from `src/index.ts` as `{ default as X }`.
`ThemeProvider`/`ToastProvider` use `ParentProps` (no own DOM, no `Props<T>`).

## Inventory

`typography/` (Heading, Text, CodeText), `inputs/`, `forms/`, `data-display/`, `navigation/`, `feedback/`, `overlays/`, `layout/`, `composites/`, `app/`.

## Primitive-first design

- Prefer existing VelvetUi primitives over introducing wrapper-only components
- One primitive per role in a family (e.g. dropdown option, dropdown surface) -- avoid parallel item variants
- Label-driven APIs should use explicit props like `label` instead of free-form `children`
- Keep primitive styles in that primitive's own module file/directory (avoid catch-all base CSS)
- Prefer `ComponentName.tsx` + `ComponentName.module.css` pairs; avoid standalone `*.module.css` without a corresponding component
- Exception: shared primitive style modules can stay standalone when reused across different element types (e.g. button/select/input/div)
- Never use `composes` in `*.module.css`; for shared styles import the source module in TSX and merge classes with `classNames()`
- `class`/`classList` on primitives is allowed only for layout/composition (positioning, sizing, spacing, flex/grid, alignment, overflow)
- Do not skin primitives from host component classes (no typography/color/background/border/shadow/radius overrides on Text/Heading/CodeText/Button/IconButton/Input/TextArea)
- Visual semantics of primitives must come from primitive API (`variant`/`tone`/`size`/state props). Extend primitive API if needed instead of local visual overrides
- Wrapper components are valid only when they add real semantics/default behavior/state (not style-only pass-through)
- For shared controls reused across components (e.g. media navigation), keep visual styling in the shared primitive module; host components should only position/place them

## Code / JSX separation

- Define all handlers and computed values above `return` -- never inline multi-statement functions in JSX
- Simple one-liner delegations in JSX are OK (e.g. `onClick={() => props.onClose()}`)
- Prefer `createMemo` for derived state; reserve `createEffect` for true side effects (DOM manipulation, timers, event listeners)

## Toast

`addToast({ message, type?, duration? })` / `removeToast(id)`. `ToastProvider` + `ToastViewport` in app shell.

## Hooks (all from `~/hooks/`)

- `useClickOutside(ref, isActive, cb)` -- close on outside click
- `useEscapeKey(isActive, cb)` -- close on Escape
- `useFocusTrap(ref, isActive)` -- trap focus inside overlays
- `useOverlayAnimation(isOpen)` -- enter/exit CSS transitions for overlays

## Overlay pattern

Overlays (Dialog, Sheet, Drawer, Popover, ContextMenu) follow a shared pattern:

- `useEscapeKey` + `useFocusTrap` for keyboard/focus management
- `useOverlayAnimation` for enter/exit transitions
- `classNames()` for conditional class composition (open/closed states)
- `Heading` for overlay titles -- never raw `<h1>`–`<h6>`
- `IconButton` for close buttons -- never raw `<button>` with icon

## Utils (all from `~/utils/`)

- `classNames(...args)` -- conditional class string builder, preferred over template literals
- `getContrastTextColor(hex)` -- accessible text color for a given background
- `orEmpty()`, `numberToString()`, `emptyToNull()`, `parseFloatOrNull()` -- form value helpers

## Shared modules

- `~/components/inputs/shared/calendar` -- `DAY_LABELS`, `DayCell`, `pad`, `toIso`, `buildDaysGrid`, `parseDate` (used by DatePicker, DateRangePicker)
