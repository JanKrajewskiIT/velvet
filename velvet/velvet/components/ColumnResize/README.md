The column-width handle for a header cell's right edge. Drag it, or focus it and press ← / → to move by `step` pixels; double-click calls `onReset`, usually to clear the custom width. `Table` and `DataGrid` use it; use it directly when you build your own header.

Place it inside a `position: relative` header cell and keep the width in your own state (`width` and `onResize`). `min` stops the column from collapsing, and `label` is the accessible name ("Resize Name"); the handle is exposed as a vertical separator with the current width.

**Props.** The full contract is `ColumnResizeProps` in `components/index.d.ts`.

- `label` (required): accessible name
- `width`: current width in px (falls back to the measured cell)
- `min` (default 64), `step` (default 16)
- `onResize`: `(width: number) => void`; `onReset`: `() => void`

**Built from: nothing else.** **CSS:** `.vui-col-resize*`. **Preview:** `components/ColumnResize/preview.html` (group Data).
