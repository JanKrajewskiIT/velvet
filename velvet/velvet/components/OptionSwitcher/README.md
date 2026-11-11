Required single choice among 2–5 options (radiogroup; ←→ move + select). track = segmented tool track (view modes, alignment, icon tools) · chips = separate pills (plan, period, size) · tiles = icon-first square tiles, icon above label (work mode, layout, device — the IconOptionSwitcher pattern) · list = vertical choices with a description, and a reason when an option is locked. Use Tabs when the choice swaps page panels; ChipGroup for multi-select filters.

OptionSwitcher is a required value: exactly one option is always selected. Use `Tabs` to swap panels and `ChipGroup` for filters.

```jsx
<OptionSwitcher label="Range" options={['Day', 'Week', 'Month', 'Year']} defaultValue="Week" />

<OptionSwitcher label="View" iconOnly defaultValue="grid"
                options={[{ value: 'list', label: 'List', icon: 'list' },
                          { value: 'grid', label: 'Grid', icon: 'layout-grid' }]} />

<OptionSwitcher variant="chips" label="Billing" options={['Monthly', 'Yearly']} defaultValue="Yearly" />

<OptionSwitcher variant="list" label="Access" value={access} onValueChange={setAccess}
                options={[{ value: 'read', label: 'Read only', description: 'Can view, cannot change.' },
                          { value: 'edit', label: 'Can edit', description: 'Can change content.' },
                          { value: 'admin', label: 'Admin', disabled: true, disabledReason: 'Needs an owner to approve.' }]} />
```

`variant="list"` renders `Option` rows as a radiogroup (real `role="radio"` with `aria-checked`, ←→↑↓ move and select, locked rows are skipped). Each option takes an optional `description`; a `disabled` option shows `disabledReason` in its place and gets a lock icon when it has none. Use it instead of hand-building a radio list from `Option` with a menu role.

**Props.** The full contract is `OptionSwitcherProps` in `components/index.d.ts`.

**Built from:** Glyph, Option, Segmented. **CSS:** `.vui-switcher*`. **Preview:** `components/OptionSwitcher/preview.html` (group Selection).
