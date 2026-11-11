Floating list under a field — the one panel, option row, empty and loading state that Select, Autocomplete, MultiSelect, PhoneInput, SearchInput, TimePicker, Cascader and TreeSelect share. Never hand-build `ul.vui-select__menu` or `li.vui-select__option` (both classes stay only as CSS aliases).

**Exports.**
- `Listbox` — `<ul role="listbox">`. `floating` (default `true`) = a `ListboxPanel`; `floating={false}` = bare list inside a panel you own (MultiSelect). `multiselectable`, `up`, `flip`, plus native `<ul>` attributes; forwards `ref`.
- `ListboxPanel` — the positioned surface (`as`, default `div`; paint from `--panel-*`). Flips above the field by itself when there is less than 260px below and more room above; pass `up` to decide yourself, `flip={false}` to opt out. Cascader and TreeSelect use it for their dialog / tree panels.
- `ListboxOption` — `Option` as `<li role="option">`: selected check at the end (`checkEnd`, default `true`; set `false` when a leading Checkmark shows the state), `mousedown` keeps focus in the field. Takes every `Option` prop (`icon`, `label`, `description`, `leading`, `trailing`, `selected`, `active`, `disabled`).
- `ListboxEmpty` — `EmptyText` as a list row; `error` styles it as a failure (put a link Button inside for Retry).
- `ListboxSkeleton` — `rows` (default 3) skeleton rows while options load.

**Rules.** The row is `Option` — selected = brand text, active = `--option-bg-active`, disabled = dimmed. Keyboard handling (↑ ↓ Home End Enter, `aria-activedescendant`) stays in the owning field; the atom only paints and positions.

**Built from:** Option, EmptyText, Skeleton, Glyph, `primitives/helpers.js` (`shouldFlipUp`). **CSS:** `.vui-listbox*` (+ `.vui-option*`). **Preview:** `components/Listbox/preview.html` (group Atoms).
