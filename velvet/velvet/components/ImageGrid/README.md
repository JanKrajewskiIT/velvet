Image grid that opens the Lightbox. uniform = equal tiles (+ optional span), feature = 1 hero + 2 thumbs, masonry = columns of natural heights. max collapses the overflow into a "+N" tile.

Defined in the same module as `Lightbox`; see its README for the related components.

**Props.** The full contract is `ImageGridProps` in `components/index.d.ts`.

- `images` (required): `LightboxImage[]`
- `layout`: `'uniform' | 'feature' | 'masonry'`, default `'uniform'`
- `columns`: `number`, default `3`. uniform / masonry column count.
- `gap`: `number`, default `8`. px.
- `ratio`: `string`, default `'4 / 3'`. uniform tile ratio.
- `featureRatio`: `string`, default `'16 / 9'`. feature container ratio.
- `max`: `number`. Show at most N tiles; the last becomes "+rest". feature always shows 3.
- `lightbox`: `boolean`, default `true`

**Preview:** `components/ImageGrid/preview.html` (group Media).
