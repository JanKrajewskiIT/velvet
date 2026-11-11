Tiny inline trend for stat cards and table cells. Scrub with the mouse or focus + ←→; the readout floats top-right. Last point is marked.

**Props.** The full contract is `SparklineProps` in `components/index.d.ts`.

- `data` (required): `number[]`
- `height`: `number`, default `40`. px.
- `color`: `string`
- `area`: `boolean`
- `format`: `(v: number) => string`
- `labels`: `string[]`. Per-point labels for the readout (dates).
- `label`: `string`

**Built from:** `charts/useSize.js`. **CSS:** `.vui-spark*`. **Preview:** `components/Sparkline/preview.html` (group Charts).
