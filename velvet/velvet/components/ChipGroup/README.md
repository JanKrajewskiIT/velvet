Toggle chips for tagging and filtering. Multi-select by default (value: string[]); multiple=false gives a deselectable single choice (value: string \| null). Selected chips gain a check and brand tint. For a required single choice use OptionSwitcher.

ChipGroup is for filters: several chips can be on at once, or one with `multiple={false}`. Use `MenuChip` when there are many values and `OptionSwitcher` when a value is required.

```jsx
<ChipGroup label="Category" defaultValue={['design']}
           options={[{ value: 'design', label: 'Design', count: 24 }, { value: 'eng', label: 'Engineering', count: 41 }]} />

<ChipGroup size="sm" multiple={false} label="Status" options={['Open', 'In review', 'Closed']} defaultValue="Open" />
```

**Props.** The full contract is `ChipGroupProps` in `components/index.d.ts`.

**Built from:** Chip. **CSS:** `.vui-chips*`. **Preview:** `components/ChipGroup/preview.html` (group Selection).
