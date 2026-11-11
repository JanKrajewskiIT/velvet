One key for every chart — a colour swatch and a label per series, optionally a toggle that hides a series. Replaces the hand-written `vui-chart__legend` markup in BarChart, LineChart, RangeBandChart, RadarChart and DonutChart.

**Props.** The full contract is `ChartLegendProps` in `components/index.d.ts`.

- `layout`: `'inline' | 'list'`, default `'inline'`. `list` adds `valueLabel` / `shareLabel` columns (donut).
- `onToggle`: `(item) => void`. Makes each key an `aria-pressed` button; hidden keys go in `off`.
- `off`: `string[]`. Keys currently hidden.
- `onHover`: `(item | null) => void`. `list` layout only; fires on hover and focus of a visible key.

**Rules.** Series colours come in order from `--dv-1…8`; never colour alone — the label is always shown.

**Built from:** — **CSS:** `.vui-chart__legend`, `.vui-chart__lg*` (inline), `.vui-donut__*` (list). **Preview:** `components/ChartLegend/preview.html` (group Charts).
