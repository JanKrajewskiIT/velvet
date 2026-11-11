Copies text to the clipboard; icon morphs copy → check for 1.6s and the result is announced.

**Props.** The full contract is `CopyButtonProps` in `components/index.d.ts`.

- `value` (required): `string | (() => string)`
- `label`: `string`
- `copiedLabel`: `string`
- `iconOnly`: `boolean`
- `variant`: `'primary' | 'secondary' | 'soft' | 'ghost'`
- `size`: `'sm' | 'md' | 'lg'`
- `onCopy`: `(value: string) => void`

**Built from:** Field, Control, Glyph. **Also exports:** CopyField. **CSS:** `.vui-copy*`. **Preview:** `components/CopyButton/preview.html` (group Actions).
