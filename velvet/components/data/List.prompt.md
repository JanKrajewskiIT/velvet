List = simple rows (avatar · title/subtitle · trailing badge). Table = many comparable columns, sorting, selection. Put a List inside a Card with padding="none"... or "sm".

```jsx
<List value={id} onValueChange={setId} items={[{ id: 1, leading: <Avatar name="Anna Kowalska" />, title: 'Anna Kowalska', description: 'Senior Frontend Engineer', trailing: <Badge tone="success">Interview</Badge> }]} />
```
