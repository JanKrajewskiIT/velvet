Guided walkthrough: dims the page, spotlights one element, floats a step card beside it. ← → navigate, Esc skips. Keep it to 3–5 steps; the page behind is inert while open. Focus stays inside the step card (Tab wraps) and returns to the trigger on close. The page behind keeps scrolling so the card can follow its target.

**Props.** The full contract is `TourProps` in `components/index.d.ts`.

- `steps` (required): `TourStep[]`
- `open` (required): `boolean`
- `onClose`: `() => void`
- `onFinish`: `() => void`. Last step "Done" — defaults to onClose.
- `defaultStep`: `number`
- `padding`: `number`, default `6`. Spotlight padding px.

**Built from:** Button, Glyph, `primitives/useDismiss.js`. **CSS:** `.vui-tour*`. **Preview:** `components/Tour/preview.html` (group Overlays).
