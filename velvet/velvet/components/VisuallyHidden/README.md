Accessibility utility. Content for screen readers only (.vui-sr-only) — extra context for icon buttons, table captions, form group names. focusable = becomes visible when it (or a child) receives focus.

**Props.** The full contract is `VisuallyHiddenProps` in `components/index.d.ts`.

- `as`: `keyof JSX.IntrinsicElements`, default `'span'`
- `focusable`: `boolean`
- `children`: `ReactNode`
- Also accepts the native attributes of the root element.

**Also exports:** SkipLink, LiveRegion. **CSS:** `.vui-sr-only*`. **Preview:** `components/VisuallyHidden/preview.html` (group Atoms).
