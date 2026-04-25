---
paths:
  - 'src/**/*.tsx'
  - 'src/**/*.ts'
---

> Type: Rule (normative constraints)
> Source of truth: Rules define mandatory constraints; skills define operational playbooks.

# Reactivity and Performance

## Effects vs Memos

- Use `createMemo` for pure derived values; do not use `createEffect` to mirror one signal into another
- Use `createEffect` only for real side effects (DOM APIs, subscriptions, timers, network boundaries, imperative library bridges)
- When an effect depends on specific sources, prefer `on(source, ...)` with explicit dependencies
- Use `{ defer: true }` for synchronization effects that should skip mount-time eager writes
- Effects that mirror `props` or signals into internal signals MUST use `createEffect(on(source, fn, ...))` with an explicit source; never rely on implicit tracking for sync-mirror flows
- When multiple internal signals must stay in sync with the same external source, consolidate them into one `on(source, ...)` effect with a single `batch(...)`; do not split into parallel effects that re-trigger the same upstream dependency

## Multi-signal Updates

- Wrap logically single transitions that touch multiple signals in `batch(...)`
- Batch state + callback notifications when they represent one user action
- Do not leave intermediate invalid states observable between sequential setters
- Inside a signal updater `setX(prev => ...)`, never call other setters or invoke imperative side effects that depend on the new value; compute the next value and any branching flags first, then `batch(...)` the setters together

## High-frequency Events

- Listeners bound to `scroll`, `resize`, `wheel`, `mousemove`, `pointermove`, `touchmove`, and drag-resize loops MUST be routed through `requestAnimationFrame` with explicit cancellation in `onCleanup`
- Store the latest event payload in a local variable (`pendingX`, `pendingClientX`, ...) and commit it inside the rAF callback; never call `set*` synchronously from the raw event
- On drag/resize end, flush any in-flight rAF with the last pending value before clearing the scheduler
- Pass `{ passive: true }` to scroll/wheel/touch listeners whose callbacks never call `preventDefault`
- For text-query and preview-like workloads, use `createDeferred` or debounced `setTimeout` as appropriate
- Keep event handlers small; defer expensive computations outside the hot path

## JSX Handler Extraction and Reactivity

- Extract inline JSX handlers into named handlers/factories only when captured values are stable for the handler lifetime
- When a handler needs reactive reads from `props`/signals, prefer keeping it inline in JSX so it executes in event scope
- Trivial reactive pass-through wrappers are allowed and preferred when needed for correctness:
  - `onClick={() => props.onClose()}`
  - `onSubmit={(event) => props.onSubmit(event)}`
- Do not move reactive prop reads into top-level handler factories evaluated during render; this triggers `solid/reactivity` warnings and can freeze stale values
- In `<For>` loops, factory handlers should capture plain item/index values, not deferred reads from reactive owners

## Timers, RAF, and Cleanup

- Every `setTimeout`, `setInterval`, `requestAnimationFrame`, and observer/listener must have deterministic cleanup via `onCleanup`
- Cancel pending raf/timers before scheduling replacements when only the latest run should win
- Never leave subscriptions active across component unmount

## Imperative Bridges

- If integrating imperative libraries (charts/editors), keep imperative mirrors (`let latestX`) only when used by non-reactive callbacks
- Do not mirror reactive values imperatively unless this avoids stale closures in third-party callbacks
- Keep bridge code localized and cleaned up in one effect lifecycle
