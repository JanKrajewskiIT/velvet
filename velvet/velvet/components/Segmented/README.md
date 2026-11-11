Sunken track holding raised, mutually-exclusive items. Build view switchers, compact filters, theme pickers from it; OptionSwitcher variant="track" renders it, Tabs variant="segmented" and ThemeToggle appearance="segmented" share its --segment-* tokens. Owns no state — set role (radiogroup / tablist) and selection yourself.

**Props.** The full contract is `SegmentedProps` in `components/index.d.ts`.

- Also accepts the native attributes of the root element (`<div>`).

**Built from:** Glyph. **Also exports:** SegmentedItem. **CSS:** `.vui-segmented*`. **Preview:** `components/Segmented/preview.html` (group Atoms).
