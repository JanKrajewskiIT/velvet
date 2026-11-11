Table column settings: visibility (switch), order (drag the grip, or focus it and press ↑/↓ — moves cross section boundaries), and freezing (pin button). The last visible column can't be switched off. Any number of columns can be pinned; sections are Pinned left · Columns · Pinned right (right appears with pinRight or when a column is already pinned right). Search appears past 8 columns. Usually inside a Popover opened from a "Columns" button in the Table toolbar. Feed Table with ApplyColumns(columns, state) — it orders left → middle → right and sets each column's pin so Table makes it sticky.

**Props.** The full contract is `ColumnManagerProps` in `components/index.d.ts`.

- `columns` (required): `ManagedColumn[]`. Source columns in their default order.

**Built from:** SearchInput, Count, Switch, Handle, Control, SectionLabel, Glyph, Button, IconButton. **Also exports:** ApplyColumns. **CSS:** `.vui-colman*`. **Preview:** `components/ColumnManager/preview.html` (group Data).
