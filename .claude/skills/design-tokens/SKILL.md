# Design Tokens — VelvetUi

Full reference for CSS custom properties defined in `src/theme/globals.css`. These are the only values to use in component styles — never hardcode colors, spacing, or shadows.

## Brand

```css
var(--brand)              /* #8b0036 — primary brand color */
var(--brand-hover)        /* #a30040 */
```

## Semantic Colors

```css
/* Backgrounds */
var(--color-bg)           /* page background */
var(--color-bg-elevated)  /* cards, panels above bg */
var(--color-bg-hover)     /* hover state background */
var(--color-bg-inverse)   /* inverted background */
var(--color-surface)      /* subtle surface (inputs, chips) */
var(--color-overlay)      /* modal/drawer backdrop */

/* Text */
var(--color-text)         /* primary text */
var(--color-text-muted)   /* secondary/supporting text */
var(--color-text-secondary)
var(--color-text-tertiary)
var(--color-text-inverse) /* text on dark/inverted bg */

/* Primary (brand) */
var(--color-primary)
var(--color-primary-hover)
var(--color-primary-light) /* tinted background for primary accents */

/* Border & Focus */
var(--color-border)
var(--color-focus-ring)

/* Skeleton */
var(--color-skeleton)

/* Status */
var(--color-info)          /* #0288d1 */
var(--color-info-light)
var(--color-success)       /* #2e7d32 */
var(--color-success-light)
var(--color-warning)       /* #ed6c02 */
var(--color-warning-light)
var(--color-warning-bg)
var(--color-error)         /* #d32f2f */
var(--color-error-light)
var(--color-error-hover)
var(--color-on-accent)     /* text on colored backgrounds */

/* Header */
var(--header-bg)
var(--header-text)
var(--header-shadow)
var(--color-header-border)
```

## Gray Scale

```css
var(--color-gray-0)    /* #ffffff */
var(--color-gray-10)   /* #eeeff1 */
var(--color-gray-20)   /* #d4d7dc */
var(--color-gray-30)   /* #b8bcc5 */
var(--color-gray-40)   /* #9ba2af */
var(--color-gray-50)   /* #858d9d */
var(--color-gray-60)   /* #707a8c */
var(--color-gray-70)   /* #626b7b */
var(--color-gray-80)   /* #515865 */
var(--color-gray-90)   /* #404550 */
var(--color-gray-100)  /* #2d3138 */
```

## Spacing

```css
var(--spacing-2xs)  /* 0.125rem —  2px */
var(--spacing-xs)   /* 0.25rem  —  4px */
var(--spacing-sm)   /* 0.5rem   —  8px */
var(--spacing-md)   /* 1rem     — 16px */
var(--spacing-lg)   /* 1.5rem   — 24px */
var(--spacing-xl)   /* 2rem     — 32px */
var(--spacing-2xl)  /* 3rem     — 48px */
var(--spacing-3xl)  /* 4rem     — 64px */
var(--spacing-4xl)  /* 6rem     — 96px */
```

## Layout Constants

```css
var(--header-height)        /* 60px */
var(--spacer-size)          /* 20px */
var(--container-max-width)  /* 1200px */
var(--container-padding)    /* 1rem */
```

## Typography

```css
/* Font sizes */
var(--font-size-xs)    /* 0.75rem   — 12px */
var(--font-size-sm)    /* 0.8125rem — 13px */
var(--font-size-md)    /* 0.875rem  — 14px */
var(--font-size-base)  /* 1rem      — 16px */
var(--font-size-lg)    /* 1.125rem  — 18px */
var(--font-size-xl)    /* 1.25rem   — 20px */
var(--font-size-2xl)   /* 1.5rem    — 24px */
var(--font-size-3xl)   /* 2rem      — 32px */

/* Font weights */
var(--font-weight-normal)    /* 400 */
var(--font-weight-medium)    /* 500 */
var(--font-weight-semibold)  /* 600 */
var(--font-weight-bold)      /* 700 */
```

## Border Radius

```css
var(--radius-sm)    /* 6px */
var(--radius-md)    /* 8px */
var(--radius-lg)    /* 12px */
var(--radius-full)  /* 50% — circle */
var(--radius-pill)  /* 999px — pill shape */
```

## Shadows

```css
var(--shadow-sm)       /* subtle element shadow */
var(--shadow-card)     /* card/panel shadow */
var(--shadow-popover)  /* dropdown/popover shadow */
var(--shadow-dialog)   /* modal dialog shadow */
var(--shadow-drawer)   /* side drawer shadow */
var(--shadow-hover)    /* hover elevation shadow */
```

## Z-Index Layers

```css
var(--z-header)    /* 100  — sticky header */
var(--z-dropdown)  /* 200  — dropdowns, popovers */
var(--z-overlay)   /* 999  — modal backdrop */
var(--z-modal)     /* 1000 — modal dialogs, drawers */
var(--z-toast)     /* 9999 — toast notifications */
```

## Transitions & Durations

```css
/* Shorthand (property + easing combined) */
var(--transition-fast)    /* 0.2s ease */
var(--transition-normal)  /* 0.5s ease */
var(--transition-slow)    /* 1s ease */

/* Duration only (use with custom easing) */
var(--duration-fast)    /* 150ms */
var(--duration-normal)  /* 250ms */
var(--duration-slow)    /* 400ms */

/* Loader-specific */
var(--loader-duration-in)   /* 0.2s */
var(--loader-duration-out)  /* 0.6s */
```

## Easing Functions

```css
var(--ease-out-expo)   /* cubic-bezier(0.16, 1, 0.3, 1) — fast deceleration */
var(--ease-out-back)   /* cubic-bezier(0.34, 1.56, 0.64, 1) — slight overshoot */
var(--ease-spring)     /* cubic-bezier(0.175, 0.885, 0.32, 1.275) — bouncy */
```

## Animations (Global Keyframes)

Available `@keyframes` defined in `globals.css` — reference by name in component CSS:

```css
animation: fadeIn 0.2s var(--ease-out-expo);
animation: fadeInUp 0.3s var(--ease-out-expo);
animation: fadeInDown 0.3s var(--ease-out-expo);
animation: slideInRight 0.3s var(--ease-out-expo);
animation: scaleIn 0.2s var(--ease-out-back);
animation: expandDown 0.2s var(--ease-out-expo); /* for dropdowns */
animation: shimmer 1.5s infinite linear; /* for Skeleton */
```

## Dark Theme

All semantic `--color-*` tokens automatically switch values when `[data-theme='dark']` is set on `<html>` or any ancestor. Never target dark mode manually in component CSS — use semantic tokens and the theme handles the rest.

## Usage Rules

- ALWAYS use tokens from this list — never hardcode `#hex`, `px` values for spacing, or `rgba()` for shadows
- Prefer semantic tokens (`--color-text`, `--color-bg`) over gray scale (`--color-gray-50`) in components
- Use `--color-primary` for brand interactions, `--color-error` for destructive states
- Stack z-index values using the layer tokens — never use arbitrary numbers
