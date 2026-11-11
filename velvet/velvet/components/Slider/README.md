Range control with filled track. Pass a number for one thumb or [lo, hi] for two — thumbs can never cross. Drag, click the track, or ←→ / PageUp/Down / Home/End. Optional marks (thresholds) with labels; snapToMarks restricts values to them.

Pass a number for one handle or `[low, high]` for a range. `format` controls the value text, `marks` shows the steps.

```jsx
<Slider label="Brightness" defaultValue={64} format={v => v + '%'} />

<Slider label="Monthly budget" defaultValue={[20, 70]} step={5} showBounds format={v => '$' + v + 'k'} />

<Slider label="Priority" min={1} max={5} defaultValue={3} marks />
```

**Props.** The full contract is `SliderProps` in `components/index.d.ts`.

**Built from:** Field. **CSS:** `.vui-slider*`. **Preview:** `components/Slider/preview.html` (group Selection).
