Data table: toolbar (title · count · actions), sort, row selection (Shift-click selects a range) with bulk-action bar, drag-to-resize columns, expandable detail rows, sticky header, keyboard (↑↓ move · Space select · →/← expand · ⌘A all · Esc clear), skeleton loading, empty state, optional add-row action. Framed on its own; borderless inside <Card padding="none">. `layout="fixed"` caps columns to the container (no horizontal scroll).

Table lists records in rows and columns; wrap it in `<Card padding="none">` and use Badge/Avatar in cells.

```jsx
<Card padding="none">
  <Table selectable selected={sel} onSelectedChange={setSel}
    columns={[{ key: 'name', label: 'Name' }, { key: 'status', label: 'Status', render: r => <Badge tone={r.tone} dot>{r.status}</Badge> }, { key: 'amount', label: 'Amount', align: 'right' }]}
    rows={rows} />
</Card>
```
