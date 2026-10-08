Table lists records in rows and columns; wrap it in `<Card padding="none">` and use Badge/Avatar in cells.

```jsx
<Card padding="none">
  <Table selectable selected={sel} onSelectedChange={setSel}
    columns={[{ key: 'name', label: 'Name' }, { key: 'status', label: 'Status', render: r => <Badge tone={r.tone} dot>{r.status}</Badge> }, { key: 'amount', label: 'Amount', align: 'right' }]}
    rows={rows} />
</Card>
```
