Compact language toggle (PL / EN by default) with a sliding thumb; ←→ switch. Each option announces its native name. For 4+ languages use Select.

**Props.** The full contract is `LocaleSwitcherProps` in `components/index.d.ts`.

- `locales`: `Array<{ value: string; label: string; name: string }>`
- `value`: `string`
- `defaultValue`: `string`
- `onChange`: `(locale: string) => void`
- `size`: `'sm' | 'md'`

**Built from:** Glyph. **CSS:** `.vui-locale*`. **Preview:** `components/LocaleSwitcher/preview.html` (group Menus).
