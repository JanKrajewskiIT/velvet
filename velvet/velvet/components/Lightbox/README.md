Full-screen image viewer: ←→ / Esc, click to zoom, thumbnail strip, focus trapped and restored, page scroll locked while open. Controlled by index (−1 / null = closed).

**Props.** The full contract is `LightboxProps` in `components/index.d.ts`.

- `images` (required): `LightboxImage[]`
- `index` (required): `number | null`
- `onIndexChange`: `(i: number) => void`
- `onClose`: `() => void`

**Built from:** Glyph, IconButton, `primitives/useDismiss.js`. **Also exports:** ImageGrid. **CSS:** `.vui-imggrid*` `.vui-lightbox*`. **Preview:** `components/Lightbox/preview.html` (group Media).
