Infinite horizontal scroller (logo walls, testimonials). Content is duplicated once; the copy is aria-hidden. Pauses on hover; static under reduced motion.

**Props.** The full contract is `MarqueeProps` in `components/index.d.ts`.

- `children` (required): `ReactNode`
- `speed`: `number`, default `40`. px per second.
- `direction`: `'left' | 'right'`
- `gap`: `number`, default `48`
- `pauseOnHover`: `boolean`
- `fade`: `boolean`, default `true`. Edge fade mask.
- `label`: `string`

**CSS:** `.vui-marquee*`. **Preview:** `components/Marquee/preview.html` (group Media).
