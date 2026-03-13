---
name: design-tokens
description: CSS custom properties reference from globals.css -- colors, spacing, typography, shadows, z-index, animations. Use when styling components.
---

All tokens in `src/theme/globals.css`. Never hardcode -- always use tokens.

## Colors

**Brand**: `--brand` #8b0036, `--brand-hover` #a30040
**Backgrounds**: `--color-bg`, `--color-bg-elevated`, `--color-bg-hover`, `--color-bg-inverse`, `--color-surface`, `--color-overlay`
**Text**: `--color-text`, `--color-text-muted`, `--color-text-secondary`, `--color-text-tertiary`, `--color-text-inverse`
**Primary**: `--color-primary`, `--color-primary-hover`, `--color-primary-light`, `--color-border`, `--color-focus-ring`
**Status**: `--color-{info,success,warning,error}` (each has `-light`)
**Header**: `--header-bg`, `--header-text`, `--header-shadow`, `--color-header-border`, `--header-control-bg`, `--header-control-bg-hover`, `--header-control-bg-active`, `--header-control-border-hover`, `--header-control-focus-ring`
**Gray**: `--color-gray-{0,10,20,...,100}`

## Spacing

`--spacing-{2xs,xs,sm,md,lg,xl,2xl,3xl,4xl}` = 2,4,8,16,24,32,48,64,96 px

## Layout

`--header-height` 60px, `--layout-sidebar-width` 240px (Sidebar + SidebarNav), `--container-max-width` 1200px, `--container-padding` 1rem

## Typography

Sizes: `--font-size-{xs,sm,md,base,lg,xl,2xl,3xl}` = 12,13,14,16,18,20,24,32 px
Weights: `--font-weight-{normal,medium,semibold,bold}` = 400,500,600,700

## Border / Shadow / Z-Index

Radius: `--radius-{sm,md,lg,full,pill}` = 6,8,12,50%,999px
Shadows: `--shadow-{sm,card,popover,dialog,drawer,hover}`
Z-Index: `--z-{header,dropdown,overlay,modal,toast}` = 100,200,999,1000,9999

## Transitions / Animations

`--transition-{fast,normal,slow}`, `--duration-{fast,normal,slow}`, `--ease-{out-expo,out-back,spring}`
Keyframes: `fadeIn`, `fadeInUp`, `fadeInDown`, `slideInRight`, `scaleIn`, `expandDown`, `shimmer`

## Rules

- Always tokens -- never hardcode values
- Prefer semantic (`--color-text`) over gray scale
- Dark theme auto-switches -- never target `[data-theme='dark']` manually
