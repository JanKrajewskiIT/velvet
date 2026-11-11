Account, environment or workspace switcher: a `NavbarChip` that opens a `Menu` of contexts. `confirmWhen(next, current)` returning true opens a `ConfirmDialog` before the switch, for contexts with real consequences such as a live trading account.

**Use it** in the `Navbar` actions where the current context must always be visible. The chip's text names the context; a context with `tone: 'danger'` gets a ring on the chip.

**Built from** `NavbarChip`, `Menu`, `ConfirmDialog`.

**Props.** The full contract is `ContextSwitcherProps` in `components/index.d.ts`.

- `items`: `{ id, label, description, icon, tone }`; `value` / `onValueChange(id, item)`.
- `confirmTitle`, `confirmDescription`, `confirmLabel`, `cancelLabel`: values or functions of `(next, current)`; the description should say what changes (where orders go, what closes).
- `extraItems`: more menu rows after a divider (privacy toggle, "Open account").
- `label`: the chip's accessible name; start it with the visible text.

**Preview:** `components/ContextSwitcher/preview.html`.
