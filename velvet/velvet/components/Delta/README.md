Signed change with direction colour (trend tokens, not status tokens), arrow and tabular figures. null renders an em dash — never 0. The colour convention switches with `data-trend-colors` on `<html>` or any subtree: `standard` (green up), `inverted` (red up) or `cvd` (blue up, orange down). For a before → after pair use `ValueShift`.

**Props.** The full contract is `DeltaProps` in `components/index.d.ts`.

- `format`: `'percent' | 'number' | 'pp'`. For any other unit pass `unit`, e.g. `unit=" bp"`.
- Also accepts the native attributes of the root element (`<span>`).

**Built from:** the shared number formatter `fmtNum`. **CSS:** `.vui-delta*`. **Preview:** `components/Delta/preview.html` (group Metrics).
