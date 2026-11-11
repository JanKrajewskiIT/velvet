Floating action button — the single most important creation action on mobile screens. extended adds the label. With actions it becomes a speed dial (icon rotates to ×, labelled mini-buttons stagger in; Esc closes).

**Props.** The full contract is `FabProps` in `components/index.d.ts`.

- `icon`: `string`
- `label` (required): `string`. Required — aria-label or visible text.
- `extended`: `boolean`
- `onClick`: `() => void`
- `actions`: `Array<{ label: string; icon: string; onClick?: () => void }>`
- `position`: `'fixed' | 'static'`, default `'fixed'`. fixed = bottom-right of viewport · static.

**Built from:** Glyph, `primitives/useDismiss.js`. **CSS:** `.vui-fab-wrap*`. **Preview:** `components/Fab/preview.html` (group Actions).
