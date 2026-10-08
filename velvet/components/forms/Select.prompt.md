Select picks one value from a list via a styled dropdown menu — use for 4+ options; for 2–3 prefer Radio or segmented Tabs.

```jsx
<Select label="Role" defaultValue="editor" onValueChange={setRole}
  options={[{ value: 'admin', label: 'Admin', icon: 'shield', description: 'Full access' }, { value: 'editor', label: 'Editor', icon: 'pencil' }, 'Viewer']} />
```

- Sizes sm / md / lg; `error`, `hint`, `disabled`, `iconLeft`.
- Options accept `icon`, `description`, `disabled`.
- Keyboard: ↑ ↓ to move, Enter/Space to pick, Esc to close. Menu flips upward near the viewport bottom.
- Pass `name` to submit with a form (hidden input).
