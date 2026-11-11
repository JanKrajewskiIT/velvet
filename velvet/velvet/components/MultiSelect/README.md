Pick many from a searchable list. Selected values show as removable tags in the field; checkbox rows in the menu; footer shows count + Clear. Async via loadOptions (debounced, skeleton, error/retry) — labels of picked items are cached across searches. `creatable` adds an “Add …” row for free entries.

MultiSelect picks several values from a list. `max` caps the selection and `loadOptions` loads the list from a server.

```jsx
<MultiSelect label="Skills" defaultValue={['figma', 'proto']}
             options={[{ value: 'figma', label: 'Figma' }, { value: 'proto', label: 'Prototyping' },
                       { value: 'a11y', label: 'Accessibility' }]} />

<MultiSelect label="Reviewers" loadOptions={searchPeople} max={3} defaultValue={[]} />
```

**Props.** The full contract is `MultiSelectProps` in `components/index.d.ts`.

- …and 4 more in `components/index.d.ts`.

**Built from:** Tag, Chevron, EmptyText, Control, Field, Checkmark, Skeleton, Spinner, Button, Glyph, Autocomplete, `primitives/useDismiss.js`, Listbox. **CSS:** `.vui-multi*`. **Preview:** `components/MultiSelect/preview.html` (group Selection).
