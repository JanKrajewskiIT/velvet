Type-to-filter single select (combobox). Local options or async loadOptions (debounced 250ms, skeleton + error/retry). Esc reverts the text, blur without a pick restores the selection unless allowCustom.

Autocomplete suggests while the person types. Pass `loadOptions` to search on a server and `allowCustom` to accept a value that is not in the list. To pick several values use `MultiSelect`.

```jsx
<Autocomplete label="Country" iconLeft="globe" defaultValue="pl"
              options={[{ value: 'pl', label: 'Poland' }, { value: 'de', label: 'Germany' }]} />

<Autocomplete label="Assignee" loadOptions={searchPeople} placeholder="Search people…"
              hint="Results load from the server." />

<Autocomplete label="Label" allowCustom options={['Bug', 'Feature', 'Chore']} />
```

**Props.** The full contract is `AutocompleteProps` in `components/index.d.ts`.

- …and 3 more in `components/index.d.ts`.

**Built from:** EmptyText, Control, Field, Skeleton, Spinner, Button, Glyph, CloseButton, Mark, `primitives/useDismiss.js`, Listbox. **CSS:** shared (deps). **Preview:** `components/Autocomplete/preview.html` (group Selection).
