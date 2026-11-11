Advanced data grid. Spreadsheet core: single active cell, arrows / Home / End / PageUp/Down, Enter / F2 / typing edits, Enter commits ↓, Tab →, Esc cancels, ⌘C copies; sortable headers, resizable columns, sticky header. Optional layers, each one prop: toolbar search (searchable), Filters popover with a QueryBuilder (filterFields), Columns popover with ColumnManager — show/hide, reorder, freeze (columnManager), Export (onExport; null = CSV download), row checkboxes with select-all + bulk bar (selectable, bulkActions; Space toggles), expandable detail rows (renderDetail; Enter on a read-only cell toggles), frozen columns with a shadow on horizontal scroll, "Showing X of Y" footer. View state (search, filters, sort, column order/visibility/pins, widths) is one GridView object — uncontrolled (defaultView) or controlled (view + onViewChange); "Reset view" appears once it differs from the default. Saved views are reconciled to the current columns (unknown keys dropped, new columns appended, widths clamped, ≥1 column always visible). Persisting views is the app's job. Server data: manualFiltering / manualSorting keep the UI but skip local filtering/sorting — fetch, paginate and show loading yourself. Use Table for simple read-only lists.

Use Table for read-mostly data, DataGrid when cells are edited and VirtualTable for very long lists. Give every row a stable `id` (or set `rowKey`).

```jsx
<DataGrid height={360} rows={rows} onRowsChange={setRows} selectable searchable columnManager
  columns={[
    { key: 'name', label: 'Project', width: 190, editable: true },
    { key: 'status', label: 'Status', width: 140, editable: true, options: ['Active', 'Paused'] },
    { key: 'budget', label: 'Budget', type: 'number', width: 120,
      format: v => Number(v).toLocaleString('pl-PL') + ' zł' },
  ]} />
```

**Props.** The full contract is `DataGridProps` in `components/index.d.ts`.

- …and 11 more in `components/index.d.ts`.

**Built from:** SearchInput, Count, Checkbox, Control, Glyph, EmptyText, Popover, Button, ColumnManager, QueryBuilder, ColumnResize, `compareValues` (from `data/Table.jsx`). **Also exports:** defaultGridView, reconcileGridView. **CSS:** `.vui-grid*`. **Preview:** `components/DataGrid/preview.html` (group Data).
