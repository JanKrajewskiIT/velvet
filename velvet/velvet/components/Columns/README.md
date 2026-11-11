Wrapping row of weighted columns — a main column with an aside that stack when there is no room. Columns sets the row (gap, alignment); each Column sets its weight and the width it asks for before wrapping.

Defined in the same module as `Stack` and `Grid`. Use `Grid` for equal cells, `SplitPane` when the person resizes the split, `Columns` when the layout is "wide main + narrower side" and must reflow on its own.

```jsx
<Columns gap={4}>
  <Column grow={2} basis={560}>…main…</Column>
  <Column grow={1} basis={320}>…aside…</Column>
</Columns>
```

Each Column grows by `grow` and wants `basis` px. When the row cannot hold every basis, the last column wraps below instead of squeezing, and every column keeps `min-width: 0` so wide content (tables, charts) scrolls inside its own box.

**Props.** The full contract is `ColumnsProps` and `ColumnProps` in `components/index.d.ts`.

- `Columns` — `gap`: space-scale step or CSS length, default `4`. `align`: cross-axis alignment, default `flex-start`. `as`: element override.
- `Column` — `grow`: share of the free space, default `1`. `basis`: px number or CSS length, default `320`. `as`: element override.
- Both also accept the native attributes of the root element.

**CSS:** `.vui-columns`, `.vui-column`. **Preview:** `components/Columns/preview.html` (group Layout).
