Search field with clear button and optional suggestions dropdown (match highlighted). ↑↓ move · Enter picks (or submits the query) · Esc closes, then clears.

SearchInput is the one search field: `suggestions` takes plain strings or `{ value, label, description, icon }` objects and calls `onSelect` when one is chosen.

```jsx
<SearchInput label="Search workspace" suggestions={suggestions}
             value={q} onValueChange={setQ} onSelect={open} />

<SearchInput label="Plain" size="sm" defaultValue="invoice 2026" />
```

**Props.** The full contract is `SearchInputProps` in `components/index.d.ts`.

- Also accepts the native attributes of the root element (`<input>`).

**Built from:** EmptyText, Control, Field, Spinner, Glyph, CloseButton, Mark, `primitives/useDismiss.js`, Listbox. **CSS:** shared (deps). **Preview:** `components/SearchInput/preview.html` (group Inputs).
