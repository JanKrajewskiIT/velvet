Stepper number field: − / + buttons, clamped min/max, ↑↓ step (Shift ×10), Home/End jump to bounds, typed value committed on blur/Enter.

NumberInput clamps to `min` / `max`, steps with the arrow keys and takes a `prefix` or `suffix` for the unit.

```jsx
<NumberInput label="Seats" defaultValue={5} min={1} max={50} suffix="seats" hint="1–50 on the Team plan" />

<NumberInput label="Weight" defaultValue={2.5} step={0.5} min={0} suffix="kg" size="sm" />
```

**Props.** The full contract is `NumberInputProps` in `components/index.d.ts`.

- Also accepts the native attributes of the root element (`<input>`).

**Built from:** Control, Field, Glyph. **CSS:** `.vui-number*`. **Preview:** `components/NumberInput/preview.html` (group Inputs).
