CSS grid. Fixed columns (collapse to 1 under 640px), or min = auto-fill cards of at least that width; fit collapses empty tracks so the cards stretch.

Defined in the same module as `Stack`; see its README for the related components.

Grid has fixed `columns` that collapse to one column under 640px, or `min` for auto-fill cells of at least that width.

```jsx
<Grid min={140} gap={3}>
  {items.map(i => <Card key={i.id}>{i.name}</Card>)}
</Grid>

<Grid columns={3}>…</Grid>
```

**Props.** The full contract is `GridProps` in `components/index.d.ts`.

- `as`: `any`
- `columns`: `number`, default `3`
- `min`: `number | string`. px or CSS length — switches to auto-fill.
- `fit`: `boolean`, default `false`. With `min`: auto-fit instead of auto-fill, so a short last row stretches to the full width (KPI rows, tile rows). Use `Columns` for a main column with an aside.
- `gap`: `number | string`, default `4`
- Also accepts the native attributes of the root element.

**Preview:** `components/Grid/preview.html` (group Layout).
