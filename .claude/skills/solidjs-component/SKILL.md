---
name: solidjs-component
description: SolidJS component patterns for VelvetUi -- Props convention, component inventory, hooks, toast system. Use when creating or modifying components.
---

## Standard component

`import type Props from '~/models/Props'` > interface > `(props: Props<X>) =>` > `export default`

With HTML attribute spreading: `interface XOwnProps extends JSX.*HTMLAttributes` + `splitProps` + `{...rest}`.

## File structure

`ComponentName/ComponentName.tsx` + `.module.css`. Export from `src/index.ts` as `{ default as X }`.
`ThemeProvider`/`ToastProvider` use `ParentProps` (no own DOM, no `Props<T>`).

## Inventory

`inputs/` (11), `forms/` (4), `data-display/` (7), `navigation/` (4), `feedback/` (10), `overlays/` (6), `layout/` (4), `composites/` (5), `app/` (3).

## Code / JSX separation

- Define all handlers and computed values above `return` -- never inline multi-statement functions in JSX
- Simple one-liner delegations in JSX are OK (e.g. `onClick={() => props.onClose()}`)
- Prefer `createMemo` for derived state; reserve `createEffect` for true side effects (DOM manipulation, timers, event listeners)

## Toast

`addToast({ message, type?, duration? })` / `removeToast(id)`. `ToastProvider` + `ToastViewport` in app shell.

## Hooks

`useClickOutside(ref, isActive, cb)`, `useEscapeKey(isActive, cb)`

## Utils

`getContrastTextColor(hex)`, `orEmpty()`, `numberToString()`, `emptyToNull()`, `parseFloatOrNull()`
