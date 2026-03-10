---
name: design-tokens
description: CSS custom properties reference from globals.css -- colors, spacing, typography, shadows, z-index, animations. Use when styling components.
---

All tokens in `src/theme/globals.css`. Never hardcode -- always use tokens.

## Colors

- **Brand**: `--brand` #8b0036, `--brand-hover` #a30040
- **Backgrounds**: `--color-bg` page, `--color-bg-elevated` cards, `--color-bg-hover`, `--color-bg-inverse`, `--color-surface` inputs, `--color-overlay` backdrop
- **Text**: `--color-text`, `--color-text-muted`, `--color-text-secondary`, `--color-text-tertiary`, `--color-text-inverse`
- **Primary**: `--color-primary`, `--color-primary-hover`, `--color-primary-light`, `--color-border`, `--color-focus-ring`
- **Status**: `--color-info` #0288d1, `--color-success` #2e7d32, `--color-warning` #ed6c02, `--color-error` #d32f2f (each has `-light`)
- **Header**: `--header-bg`, `--header-text`, `--header-shadow`, `--color-header-border`
- **Gray**: `--color-gray-{0..100}` (11 steps: 0,10,20,...,100)

## Spacing

`--spacing-2xs` 2px, `-xs` 4px, `-sm` 8px, `-md` 16px, `-lg` 24px, `-xl` 32px, `-2xl` 48px, `-3xl` 64px, `-4xl` 96px

## Layout

`--header-height` 60px, `--container-max-width` 1200px, `--container-padding` 1rem

## Typography

Sizes: `--font-size-xs` 12px, `-sm` 13px, `-md` 14px, `-base` 16px, `-lg` 18px, `-xl` 20px, `-2xl` 24px, `-3xl` 32px
Weights: `--font-weight-normal` 400, `-medium` 500, `-semibold` 600, `-bold` 700

## Border Radius

`--radius-sm` 6px, `-md` 8px, `-lg` 12px, `-full` 50%, `-pill` 999px

## Shadows

`--shadow-sm` subtle, `-card` panel, `-popover` dropdown, `-dialog` modal, `-drawer` side, `-hover` elevation

## Z-Index

`--z-header` 100, `-dropdown` 200, `-overlay` 999, `-modal` 1000, `-toast` 9999

## Transitions

Shorthand: `--transition-fast` 0.2s, `-normal` 0.5s, `-slow` 1s
Duration: `--duration-fast` 150ms, `-normal` 250ms, `-slow` 400ms
Easing: `--ease-out-expo`, `--ease-out-back`, `--ease-spring`

## Animations

`fadeIn` 0.2s, `fadeInUp` 0.3s, `fadeInDown` 0.3s, `slideInRight` 0.3s, `scaleIn` 0.2s, `expandDown` 0.2s, `shimmer` 1.5s infinite

## Rules

- Always tokens -- never hardcode `#hex`, `px` spacing, `rgba()` shadows
- Prefer semantic (`--color-text`) over gray scale (`--color-gray-50`)
- Dark theme auto-switches via `[data-theme='dark']` -- never target manually
