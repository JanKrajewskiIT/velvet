Inline AI status: a softly blinking robot icon with a visible label, announced as `role="status"`.

Use it next to a heading or inside a panel while an AI task runs and there is a sentence to show ("Analysing the résumé…"). Use `Spinner` or `Loader` when there is no label, `Skeleton` when the shape of the result is known, `Progress` when the percentage is known. The blink stops under `prefers-reduced-motion`.

```jsx
<RobotProcessingIndicator label="Analysing the résumé…" />
```

**Props.** The full contract is `RobotProcessingIndicatorProps` in `components/index.d.ts`.

- `label`: `string`, default `'Processing'`. Visible and announced status text.
- `className`, `style`: pass-through.

**Also uses:** `Icon` (`robot` glyph, Objects category). **CSS:** `.vui-robot*`. **Preview:** `components/RobotProcessingIndicator/preview.html` (group Progress).
