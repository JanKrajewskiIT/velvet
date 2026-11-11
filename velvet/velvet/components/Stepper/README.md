Progress through ordered steps: done (✓) · current · upcoming · error. Animated: connector fills left→right (top→bottom when vertical), a node pops + draws its check when it completes, the current node scales up. With onStepClick steps become buttons (←→ / ↑↓ move focus). Vertical under 640px for horizontal steppers with 4+ steps.

Stepper shows progress through a known sequence. With `linear` (the default) only completed steps are clickable. For a stepper that also holds the step content and validation use `Wizard`.

```jsx
<Stepper current={1} onStepClick={setStep}
         steps={[{ label: 'Account', description: 'Workspace name' }, { label: 'Profile' }, { label: 'Invite team' }]} />

<Stepper orientation="vertical" current={2} errorAt={2} steps={steps} />
```

**Props.** The full contract is `StepperProps` in `components/index.d.ts`.

**Built from:** Glyph, Marker. **CSS:** `.vui-stepper*`. **Preview:** `components/Stepper/preview.html` (group Wayfinding).
