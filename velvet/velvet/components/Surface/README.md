The one primitive that paints a container — background, border, radius, elevation, padding, tone and behaviour. Hierarchy: Surface → Card (adds header/body/footer) → FeatureCard · FlipCard · Stat · ScoreCard · QuestionCard (add an interior). Floating panels (Popover, Menu, Dialog) sit on Surface directly. Retune via --surface-* tokens, never per instance.

Surface paints every container. `hoverable` lifts a box that is not clickable (its inner actions stay the action), `interactive` makes the whole box one action, and `tonal` with `tone` tints the lift and border.

```jsx
<Surface hoverable padding="md">Neutral lift. Not clickable.</Surface>

<Surface as="button" interactive padding="md" onClick={open}>The whole box is one action.</Surface>

<Surface hoverable tonal tone="violet" padding="md">Lift, border and glow track the tone hue.</Surface>
```

**Props.** The full contract is `SurfaceProps` in `components/index.d.ts`.

- Also accepts the native attributes of the root element.

**CSS:** `.vui-surface*`. **Preview:** `components/Surface/preview.html` (group Atoms).
