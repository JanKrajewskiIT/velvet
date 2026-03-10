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

`actions-and-forms/` (19), `data-display/` (9), `feedback-and-states/` (11), `layouts/` (3), `overlays/` (6), `workflows/` (10).

## Toast

`addToast({ message, type?, duration? })` / `removeToast(id)`. `ToastProvider` + `ToastViewport` in app shell.

## Hooks

`useClickOutside(ref, isActive, cb)`, `useEscapeKey(isActive, cb)`

## Utils

`getContrastTextColor(hex)`, `orEmpty()`, `numberToString()`, `emptyToNull()`, `parseFloatOrNull()`
