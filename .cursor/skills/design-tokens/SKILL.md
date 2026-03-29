---
name: design-tokens
description: CSS custom properties reference from globals.css -- colors, spacing, typography, shadows, z-index, animations. Use when styling components.
---

All tokens live in `src/theme/globals.css`. Always use tokens instead of hardcoded values.

## Colors

- Brand: `--brand`, `--brand-hover`
- Backgrounds: `--color-bg`, `--color-bg-elevated`, `--color-bg-hover`, `--color-bg-inverse`, `--color-surface`, `--color-overlay`
- Text: `--color-text`, `--color-text-muted`, `--color-text-secondary`, `--color-text-tertiary`, `--color-text-inverse`
- Primary and borders: `--color-primary`, `--color-primary-hover`, `--color-primary-light`, `--color-border`, `--color-focus-ring`
- Status: `--color-info`, `--color-success`, `--color-warning`, `--color-error` and light variants

## Spacing

`--spacing-{2xs,xs,sm,md,lg,xl,2xl,3xl,4xl}`

## Typography

- Sizes: `--font-size-{xs,sm,md,base,lg,xl,2xl,3xl}`
- Weights: `--font-weight-{normal,medium,semibold,bold}`

## Radius / Shadow / Layering

- Radius: `--radius-{sm,md,lg,full,pill}`
- Shadows: `--shadow-{sm,card,popover,dialog,drawer,hover}`
- Z-index: `--z-{header,dropdown,overlay,modal,toast}`

## Motion

- Transitions: `--transition-{fast,normal,slow}`
- Durations: `--duration-{fast,normal,slow}`
- Easings: `--ease-{out-expo,out-back,spring}`
- Keyframes available in `globals.css`

## Styling Rules

- Prefer semantic tokens over raw grayscale tokens
- Dark theme should flow through semantic tokens automatically
- Base primitives and shared surfaces should remain visually neutral by default
- Do not add gradients, glow, or hover-lift styling to primitive defaults unless the component is explicitly a high-emphasis variant
- `Card` should read as a baseline surface first; spotlighted surfaces should be explicit opt-in components or variants
