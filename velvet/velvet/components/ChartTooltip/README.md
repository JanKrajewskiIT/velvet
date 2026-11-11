Floating read-out inside a chart plot — a title and one row per series (swatch, label, value). Replaces the hand-written `vui-chart__tip` markup in BarChart, LineChart, RangeBandChart, Heatmap and RadarChart.

**Props.** The full contract is `ChartTooltipProps` in `components/index.d.ts`.

- `x`, `y`: plot coordinates (numbers) or `'%'` strings.
- `width`, `edge`: with a numeric `x`, keeps the tooltip at least `edge` px (default 70) from both sides of a plot `width` wide.
- `title`: `ReactNode`. Category / date.
- `live`: `boolean`, default `true` (`role="status"`, polite). `false` hides it from assistive tech — use when the chart exposes its values another way (Heatmap).
- Also accepts `className` (RadarChart adds `vui-radar__tip`) and `style`.

**Built from:** — **CSS:** `.vui-chart__tip*`. **Preview:** `components/ChartTooltip/preview.html` (group Charts).
