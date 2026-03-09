---
name: design-tokens
description: Full CSS custom properties reference from globals.css -- colors, spacing, typography, shadows, z-index, animations. Use when styling components or choosing design token values.
---

All tokens defined in `src/theme/globals.css`. Never hardcode colors, spacing, or shadows -- always use tokens.

## Brand

`var(--brand)` #8b0036 | `var(--brand-hover)` #a30040

## Backgrounds

`--color-bg` page | `--color-bg-elevated` cards/panels | `--color-bg-hover` hover | `--color-bg-inverse` inverted | `--color-surface` inputs/chips | `--color-overlay` backdrop

## Text

`--color-text` primary | `--color-text-muted` secondary | `--color-text-secondary` | `--color-text-tertiary` | `--color-text-inverse` on dark bg

## Primary & Border

`--color-primary` | `--color-primary-hover` | `--color-primary-light` tinted bg | `--color-border` | `--color-focus-ring` | `--color-skeleton`

## Status

`--color-info` #0288d1 | `--color-success` #2e7d32 | `--color-warning` #ed6c02 | `--color-error` #d32f2f
Each has `-light` variant. `--color-error-hover`, `--color-warning-bg`, `--color-on-accent`.

## Header

`--header-bg` | `--header-text` | `--header-shadow` | `--color-header-border`

## Gray Scale

`--color-gray-0` #fff through `--color-gray-100` #2d3138 (11 steps: 0,10,20,30,40,50,60,70,80,90,100)

## Spacing

| Token           | Value          |
| --------------- | -------------- |
| `--spacing-2xs` | 0.125rem (2px) |
| `--spacing-xs`  | 0.25rem (4px)  |
| `--spacing-sm`  | 0.5rem (8px)   |
| `--spacing-md`  | 1rem (16px)    |
| `--spacing-lg`  | 1.5rem (24px)  |
| `--spacing-xl`  | 2rem (32px)    |
| `--spacing-2xl` | 3rem (48px)    |
| `--spacing-3xl` | 4rem (64px)    |
| `--spacing-4xl` | 6rem (96px)    |

## Layout

`--header-height` 60px | `--spacer-size` 20px | `--container-max-width` 1200px | `--container-padding` 1rem

## Typography

Sizes: `--font-size-xs` 12px, `-sm` 13px, `-md` 14px, `-base` 16px, `-lg` 18px, `-xl` 20px, `-2xl` 24px, `-3xl` 32px
Weights: `--font-weight-normal` 400, `-medium` 500, `-semibold` 600, `-bold` 700

## Border Radius

`--radius-sm` 6px | `--radius-md` 8px | `--radius-lg` 12px | `--radius-full` 50% | `--radius-pill` 999px

## Shadows

`--shadow-sm` subtle | `--shadow-card` panel | `--shadow-popover` dropdown | `--shadow-dialog` modal | `--shadow-drawer` side | `--shadow-hover` elevation

## Z-Index

`--z-header` 100 | `--z-dropdown` 200 | `--z-overlay` 999 | `--z-modal` 1000 | `--z-toast` 9999

## Transitions

Shorthand: `--transition-fast` 0.2s ease | `--transition-normal` 0.5s ease | `--transition-slow` 1s ease
Duration: `--duration-fast` 150ms | `--duration-normal` 250ms | `--duration-slow` 400ms
Easing: `--ease-out-expo` | `--ease-out-back` (overshoot) | `--ease-spring` (bouncy)

## Animations (keyframes in globals.css)

`fadeIn` 0.2s | `fadeInUp` 0.3s | `fadeInDown` 0.3s | `slideInRight` 0.3s | `scaleIn` 0.2s | `expandDown` 0.2s | `shimmer` 1.5s infinite

## Dark Theme

All `--color-*` tokens auto-switch via `[data-theme='dark']`. Never target dark mode manually -- use semantic tokens.

## Rules

- Always use tokens -- never hardcode `#hex`, `px` spacing, `rgba()` shadows
- Prefer semantic tokens (`--color-text`) over gray scale (`--color-gray-50`)
- Use `--color-primary` for interactions, `--color-error` for destructive states
- Use layer tokens for z-index -- never arbitrary numbers
