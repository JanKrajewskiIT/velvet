# Foundations

Velvet UI is **CSS-first**: all styling is plain CSS (tokens as custom properties, components as `vui-*` BEM classes). Framework code only applies classes and behaviour. In Solid, import `styles.css` once and **reuse it unchanged**. Rebuild only the components.

## Entry & theming
- Import `styles.css` once (imports only). Theme: `data-theme="light|dark"` on `<html>` or any subtree; default from `prefers-color-scheme`; persisted in `localStorage['vui-theme']` (`'light' | 'dark' | 'system'`). `ThemeToggle` writes it. `assets/theme-toggle.js` only applies it to the specimen cards.
- Density: `data-density="compact"` on any subtree. Coarse pointers auto-grow controls.

## Token layers (each reads only the layer below)
1. **ref-*** raw scales — never read by component CSS.
2. **sys-*** intent tokens: `--bg-*`, `--fg-*`, `--border-*`, `--action-*`, `--on-color-*`, `--status-<s>-fg/bg/border/solid`, `--scrim-*`, `--elevation-*`, `--type-<role>*`, `--motion-*`, `--focus-*`.
3. **comp** (`tokens/comp.css`): per-family knobs (`--button-*`, `--field-*`, `--card-*`…).
4. **mode-density**.

Example chain: `--velvet-700 → --action-primary → --button-primary-bg → .vui-btn--primary`.

## Hard rules
- Component CSS reads **comp first, sys second, ref never** (no `--velvet-*`, `--neutral-*`, `--dur-*`, `--ease-*`, `--shadow-*`, `--font-size-*`, `--font-weight-*`).
- No hex / rgb / raw ms. No raw px for radius/gap/padding — use `--space-*`, `--radius-*` (4px grid only; no 3/5/7/9/11/18/22px).
- Type: `--type-<role>-size/-weight/-leading/-tracking/-family`. Micro: `--type-micro`.
- Motion: `--motion-*` intents. Shared keyframes (`vui-fade-in`, `vui-rise-in`, `vui-sheet-in`, `vui-spin`, `vui-pulse`, `vui-pop-in`) live in `tokens/base.css` — never redeclare.
- Depth: `--elevation-*`. Icon sizes: `--size-icon-*` (12/14/16/18/20/24).
- Box sizes: control → `--control-height-*`; row → `--row-height-*`; touch → `--hit-target-min`.
- Overlays: `--overlay-offset`, `--overlay-min-w/-w-sm/-w/-w-md/-w-lg`, `--overlay-max-h-*`, `--viewport-margin`.
- Every BEM block has its own CSS file next to its component.
- Icons only through `Glyph` / `renderIcon()`; Velvet Icons via `tokens/icons.css` (CSS mask) — `<i class="vui-icon icon-NAME">`; raw SVGs in `assets/icons/`.
- Filled icon twins = selected state only.

## Colour
One hero colour velvet `#8b0036` (≤10% of a screen); warm rose-tinted neutrals; status colours distinct from brand (danger is orange-red). Text only in `--fg-primary/secondary` (AA); `--fg-tertiary` for meta/18px+. Status never by colour alone (icon/label). Data-viz: `--dv-1…8` in order, `--dv-seq-1…5`; never for status. Labels: `data-tone="violet"` → `--tone/--tone-bg/--tone-fg`.

## Shape, elevation, motion, state
- Radii: 6 small controls · 8 inputs/buttons · 12 cards · 16 dialogs · full badges/switches. No pill buttons.
- Cards: raised surface, 1px `--border-subtle`, `--elevation-card`. No coloured left-border accents, no decorative gradients.
- Motion quick: 140ms hover, 200ms state, 320ms overlay enter; collapses under `prefers-reduced-motion`.
- Focus: always visible (`--focus-ring`, 3px). Press: 1px down + darker. Hover: one step darker / `--bg-hover`.
- **State contract** every interactive component: default · hover · focus-visible · active · selected/checked · disabled · loading (async) · invalid (inputs).

## Layout
4px grid; cards pad 20px, dialogs 24px, gutter `clamp(16px,4vw,32px)`. Sidebar 248px + 60px topbar; off-canvas below 768px. Breakpoints 640/768/1024/1280/1536, mobile-first. Content max ~1200px.

## Content voice
"You"; sentence case; buttons verb + object ("Save changes"); errors say what happened and how to fix; destructive copy names the thing; no emoji; real typography (… ’ “ ” − × ⌘); tabular figures for numbers.

## Fonts
Space Grotesk (display/headings, 600), Hanken Grotesk (UI/body), JetBrains Mono (code). Self-hosted in `fonts/` (latin + latin-ext → Polish OK), declared in `tokens/fonts.css`.
