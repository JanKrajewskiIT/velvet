# Theme Token Catalog

Status: Source-backed from `src/theme/globals.css` at baseline 3.1.3. Tokens below are the consumer styling contract: preserve names and semantic roles; per `USER-DEC-008`, the primary brand palette is exact; other values, spacing, typography, and layout may improve. CSS-module selectors, `vuType*` utility classes and keyframe names are private implementation details.

## Root Tokens

### Exact Brand Palette

Per `USER-DEC-008`, these source color values and relationships must be preserved:

| Token | Light/default | Dark theme |
|---|---|---|
| `--brand` | `#8b0036` | `#8b0036` (not overridden) |
| `--brand-hover` | `#a30040` | `#a30040` (not overridden) |
| `--color-primary` | `var(--brand)` (`#8b0036`) | `#d4446e` |
| `--color-primary-hover` | `var(--brand-hover)` (`#a30040`) | `#e05a82` |
| `--color-primary-light` | `rgb(139 0 54 / 6%)` | `rgb(212 68 110 / 8%)` |
| `--color-focus-ring` | `rgb(139 0 54 / 40%)` | `rgb(212 68 110 / 40%)` |
| `--shadow-focus-primary` | `0 0 0 3px var(--color-focus-ring), 0 0 12px rgb(139 0 54 / 12%)` | `0 0 0 3px var(--color-focus-ring), 0 0 12px rgb(212 68 110 / 15%)` |

The brand gradient must retain primary as its first stop and the source's mixed pink endpoint: light mixes `var(--color-primary)` 80% with `#ff4081`; dark mixes it 80% with `#ff6b9d`. Preserve direction and stop positions. Other gradient tokens may be visually improved.

- Brand: `--brand`, `--brand-hover`
- Gray scale: `--color-gray-0`, `--color-gray-10`, `--color-gray-20`, `--color-gray-30`, `--color-gray-40`, `--color-gray-50`, `--color-gray-60`, `--color-gray-70`, `--color-gray-80`, `--color-gray-90`, `--color-gray-100`
- Semantic colors: `--color-bg`, `--color-bg-elevated`, `--color-bg-hover`, `--color-bg-inverse`, `--color-text`, `--color-text-muted`, `--color-text-secondary`, `--color-text-tertiary`, `--color-text-inverse`, `--color-primary`, `--color-primary-hover`, `--color-primary-light`, `--color-border`, `--color-border-strong`, `--color-border-hover`, `--color-surface`, `--color-surface-raised`, `--color-surface-alt`, `--color-skeleton`, `--color-focus-ring`, `--color-info`, `--color-info-light`, `--color-success`, `--color-success-light`, `--color-warning`, `--color-warning-light`, `--color-warning-bg`, `--color-error`, `--color-error-light`, `--color-error-hover`, `--color-error-accent`, `--color-danger`, `--color-on-accent`, `--color-overlay`
- Decorative/header colors: `--color-header-border`, `--color-highlight-subtle`, `--color-highlight-shimmer`, `--color-highlight-inset`, `--color-highlight-surface`, `--color-scrim-faint`, `--color-scrim-subtle`, `--color-scrim-light`, `--color-scrim-medium`, `--header-bg`, `--header-text`, `--header-shadow`, `--header-control-bg`, `--header-control-bg-hover`, `--header-control-bg-active`, `--header-control-border-hover`, `--header-control-focus-ring`
- Layout dimensions: `--header-height`, `--layout-sidebar-width`, `--spacer-size`, `--container-max-width`, `--container-padding`
- Spacing: `--spacing-2xs`, `--spacing-xs`, `--spacing-sm`, `--spacing-md`, `--spacing-lg`, `--spacing-xl`, `--spacing-2xl`, `--spacing-3xl`, `--spacing-4xl`
- Base typography: `--font-size-xs`, `--font-size-sm`, `--font-size-md`, `--font-size-base`, `--font-size-lg`, `--font-size-xl`, `--font-size-2xl`, `--font-size-3xl`, `--font-family-sans`, `--font-family-display`, `--font-family-mono`, `--font-weight-normal`, `--font-weight-medium`, `--font-weight-semibold`, `--font-weight-bold`
- Typography variants: for each of `display-lg`, `display-md`, `h1`, `h2`, `h3`, `title-lg`, `title-md`, `body-lg`, `body-md`, `body-sm`, `label-lg`, `label-md`, `caption`, `overline`, `button-sm`, `button-md`, `button-lg`, the tokens are `--typography-<variant>-font-size`, `--typography-<variant>-line-height`, `--typography-<variant>-font-weight`, and `--typography-<variant>-letter-spacing`.
- Typography scales: `--typography-scale-2xs`, `--typography-scale-xs`, `--typography-scale-sm`, `--typography-scale-md`, `--typography-scale-base`, `--typography-scale-lg`, `--typography-scale-xl`, `--typography-scale-2xl`, `--typography-scale-3xl`, `--typography-scale-5xl`, `--typography-size-icon-sm`, `--typography-size-icon-md`, `--typography-size-icon-lg`, `--typography-size-fluid-display`, `--typography-size-fluid-body`, `--typography-weight-regular`, `--typography-weight-medium`, `--typography-weight-semibold`, `--typography-weight-bold`, `--typography-line-height-zero`, `--typography-line-height-none`, `--typography-line-height-tight`, `--typography-line-height-snug`, `--typography-line-height-normal`, `--typography-line-height-body`, `--typography-line-height-relaxed`
- Radius: `--radius-sm`, `--radius-md`, `--radius-lg`, `--radius-full`, `--radius-pill`
- Shadows: `--shadow-sm`, `--shadow-card`, `--shadow-popover`, `--shadow-dialog`, `--shadow-drawer`, `--shadow-hover`, `--shadow-interactive`, `--shadow-focus`, `--shadow-focus-primary`, `--shadow-glow`, `--shadow-glow-sm`, `--shadow-glow-lg`
- Layering: `--z-header`, `--z-overlay`, `--z-modal`, `--z-dropdown`, `--z-floating`, `--z-tooltip`, `--z-toast`
- Motion: `--transition-fast`, `--transition-normal`, `--transition-slow`, `--duration-fast`, `--duration-normal`, `--duration-slow`, `--ease-out-expo`, `--ease-out-back`, `--ease-spring`, `--ease-in-out-smooth`, `--loader-duration-in`, `--loader-duration-out`
- Effects: `--opacity-disabled`, `--blur-overlay`, `--blur-glass`, `--color-glass`, `--color-glass-border`, `--color-tooltip`
- Theme-toggle and gradients: `--theme-toggle-light-border`, `--theme-toggle-light-selected-bg`, `--theme-toggle-light-selected-border`, `--theme-toggle-light-selected-fg`, `--gradient-surface`, `--gradient-brand`, `--gradient-brand-subtle`, `--gradient-card`, `--gradient-field`, `--gradient-shimmer`

## Dark Overrides

The `[data-theme='dark']` rule overrides exactly these source variables: `--color-bg`, `--color-bg-elevated`, `--color-text`, `--color-text-muted`, `--color-text-secondary`, `--color-text-tertiary`, `--color-text-inverse`, `--color-primary`, `--color-primary-hover`, `--color-primary-light`, `--color-border`, `--color-border-strong`, `--color-surface`, `--color-surface-raised`, `--color-bg-hover`, `--color-bg-inverse`, `--color-skeleton`, `--color-focus-ring`, `--color-info`, `--color-info-light`, `--color-success`, `--color-success-light`, `--color-warning`, `--color-warning-light`, `--color-error`, `--color-error-light`, `--color-error-hover`, `--color-on-accent`, `--color-overlay`, `--color-header-border`, `--color-warning-bg`, `--color-error-accent`, `--color-highlight-subtle`, `--color-highlight-shimmer`, `--color-highlight-inset`, `--color-highlight-surface`, `--color-scrim-faint`, `--color-scrim-subtle`, `--color-scrim-light`, `--color-scrim-medium`, `--header-bg`, `--header-text`, `--header-shadow`, `--header-control-bg`, `--header-control-bg-hover`, `--header-control-bg-active`, `--header-control-border-hover`, `--header-control-focus-ring`, `--shadow-sm`, `--shadow-card`, `--shadow-popover`, `--shadow-dialog`, `--shadow-drawer`, `--shadow-hover`, `--shadow-interactive`, `--shadow-focus`, `--shadow-focus-primary`, `--shadow-glow`, `--shadow-glow-sm`, `--shadow-glow-lg`, `--color-glass`, `--color-glass-border`, `--color-tooltip`, `--color-border-hover`, `--theme-toggle-light-border`, `--theme-toggle-light-selected-bg`, `--theme-toggle-light-selected-border`, `--theme-toggle-light-selected-fg`, `--gradient-brand`, `--gradient-brand-subtle`, `--gradient-card`, `--gradient-field`, and `--gradient-shimmer`. Unoverridden root values remain in effect. Preserve light/dark resolution as specified in [foundation.md](foundation.md).

## Global Rules

- `:root` establishes default tokens and document typography/color/background.
- `[data-theme='dark']` overrides semantic colors/effects; root element receives this attribute from `ThemeProvider`.
- Universal box sizing and margin/padding reset applies globally.
- `body` and `#root` are 100vh and overflow hidden; `#root` is a column flex container.
- `body.transitionsReady` transitions color/background using `--transition-fast`.
- Global `prefers-reduced-motion: reduce` scales all animation/transition durations to `0.01ms` and one iteration. Component-specific media rules may add behavior; preserve reduced-motion support.