The bare menu panel, without a trigger or positioning, for the cases where you place it yourself. `Menu` and `ContextMenu` are built on it; use those unless you need custom placement.

Items are the same as for `Menu`: a `label` with an optional `icon`, `description` and `shortcut` hint, `danger` for destructive actions, `disabled`, `checked` (a menuitemcheckbox with a check column) with `keepOpen` for checkbox lists, `divider` for a separator line and `section` for a small group heading. ↑ ↓ Home End move, typing jumps, Enter selects, Esc closes. `onClose(refocus)` tells you whether focus should return to the trigger.

**Props.** The full contract is `MenuPanelProps` and `MenuItem` in `components/index.d.ts`.

- `items` (required): `MenuItem[]`
- `onClose`: `(refocus: boolean) => void`
- `autoFocus`: `boolean`; `iconPosition`: `'start' | 'end'`
- `style`, `className`: for your own positioning

**Built from: Button, Glyph, Kbd, SectionLabel.** **CSS:** `.vui-menu*`. **Preview:** `components/MenuPanel/preview.html` (group Menus). Defined in the same module as `Menu`.
