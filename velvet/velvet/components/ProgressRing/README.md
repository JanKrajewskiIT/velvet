Circular progress with centred percentage.

Defined in the same module as `Progress`; see its README for the related components.

**Props.** The full contract is `ProgressRingProps` in `components/index.d.ts`.

- `value`: `number`
- `max`: `number`
- `size`: `number`, default `48`. px.
- `stroke`: `number`
- `tone`: `'brand' | 'success' | 'warning' | 'danger' | 'neutral'`
- `showValue`: `boolean`
- `label`: `string`
- `role`: `'progressbar' | 'meter' | 'img'`, default `'progressbar'`. progressbar (task) · meter (measured value) · img (score badge — label carries the value).
- `children`: `ReactNode`. Custom centre content — replaces the % value (e.g. "82/100").

**Preview:** `components/ProgressRing/preview.html` (group Progress).
