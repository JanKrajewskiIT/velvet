Pick an ordered subset from a long pool (required skills, team members, permissions, columns). The value is the ordered array of values in the right list. Per-panel search with match highlight · grouped source list · click / Shift-click range / ⌘A select · double-click or Enter moves · drag items between panels (drags every checked item) · orderable: drag within the right list or ⌥↑ / ⌥↓ · optional max with meter. Duplicate values are reported and block transfer. Stacks vertically under 640px.

Use for choosing many items from a long pool. Titles should name both sides ("Available skills" / "Required skills").

```jsx
<TransferList items={skills.map((s) => ({ value: s, label: s }))} value={required} onValueChange={setRequired} titles={['Available skills', 'Required skills']} />
```
