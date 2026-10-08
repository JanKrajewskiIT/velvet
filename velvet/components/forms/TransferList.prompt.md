Use for choosing many items from a long pool. Titles should name both sides ("Available skills" / "Required skills").

```jsx
<TransferList items={skills.map((s) => ({ value: s, label: s }))} value={required} onValueChange={setRequired} titles={['Available skills', 'Required skills']} />
```
