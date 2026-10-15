import { mergeProps, splitProps } from 'solid-js';

import { variantClass } from '../../utils/cssModule';
import { cx } from '../../utils/cx';
import { type ElementTag, type HtmlProps, Polymorphic } from '../../utils/polymorphic';
import type { Tone } from '../../utils/tone';
import styles from './Surface.module.css';

const SURFACE_CLASSES = {
  low: styles.surfaceVariantLow,
  overlay: styles.surfaceVariantOverlay,
  dialog: styles.surfaceVariantDialog,
  'pad-sm': styles.surfaceVariantPadSm,
  'pad-md': styles.surfaceVariantPadMd,
  'pad-lg': styles.surfaceVariantPadLg,
  flat: styles.surfaceVariantFlat,
  raised: styles.surfaceVariantRaised,
  subtle: styles.surfaceVariantSubtle,
  sunken: styles.surfaceVariantSunken,
  brand: styles.surfaceVariantBrand,
  'brand-solid': styles.surfaceVariantBrandSolid,
  inverse: styles.surfaceVariantInverse,
  glass: styles.surfaceVariantGlass,
  clip: styles.surfaceVariantClip,
  hoverable: styles.surfaceVariantHoverable,
  tonal: styles.surfaceVariantTonal,
  interactive: styles.surfaceVariantInteractive,
  accent: styles.surfaceVariantAccent,
  selected: styles.surfaceVariantSelected,
} as const;

const SURFACE_VARIANT_CLASSES = {
  sm: styles.surfaceVariantPadSm,
  md: styles.surfaceVariantPadMd,
  lg: styles.surfaceVariantPadLg,
} as const;

export type SurfaceVariant =
  | 'default'
  | 'low'
  | 'flat'
  | 'raised'
  | 'subtle'
  | 'sunken'
  | 'brand'
  | 'brand-solid'
  | 'inverse'
  | 'overlay'
  | 'dialog'
  | 'glass';

export type SurfacePadding = 'none' | 'sm' | 'md' | 'lg';

export interface SurfaceProps extends HtmlProps<HTMLElement> {
  /** @default 'div' */
  as?: ElementTag;
  /** Paint at rest. @default 'default' */
  variant?: SurfaceVariant;
  /** Inner padding from `--surface-pad-*`. @default 'none' */
  padding?: SurfacePadding;
  /** Sets `--tone` / `--tone-fg` / `--tone-bg` for the accent strip, tonal hover and tinted children. */
  tone?: Tone;
  /** 3px top strip in the tone colour. */
  accent?: boolean;
  /** Visual feedback only — neutral lift on hover. Does not make the box clickable. */
  hoverable?: boolean;
  /** The whole box is one action: pointer, focus ring. Implies hoverable. A `div` gets `tabIndex=0`. */
  interactive?: boolean;
  /** Tinted hover — lift, border and glow track `--tone`. Implies hoverable. */
  tonal?: boolean;
  /** Staggered entrance. `true` = no delay; a number = list index (50ms per step). */
  reveal?: boolean | number;
  /** Brand-tinted selected state. */
  selected?: boolean;
  /** `overflow: hidden` — for media that must follow the radius. */
  clip?: boolean;
}

/** The one primitive that paints a container: background, border, radius, elevation, padding, tone and behaviour. */
export const Surface = (props: SurfaceProps) => {
  const merged = mergeProps({ as: 'div', variant: 'default', padding: 'none' } satisfies SurfaceProps, props);
  const [local, rest] = splitProps(merged, [
    'as',
    'variant',
    'padding',
    'tone',
    'accent',
    'hoverable',
    'interactive',
    'tonal',
    'reveal',
    'selected',
    'clip',
    'style',
    'class',
  ]);
  const lifts = () => local.hoverable || local.interactive || local.tonal;
  const revealed = () => local.reveal != null && local.reveal !== false;
  return (
    <Polymorphic
      tag={local.as}
      class={cx(
        styles.surface,
        variantClass(SURFACE_CLASSES, local.variant, 'default'),
        local.padding !== 'none' && variantClass(SURFACE_VARIANT_CLASSES, local.padding),
        local.accent && styles.surfaceVariantAccent,
        lifts() && styles.surfaceVariantHoverable,
        local.interactive && styles.surfaceVariantInteractive,
        local.tonal && styles.surfaceVariantTonal,
        revealed() && styles.reveal,
        local.selected && styles.surfaceVariantSelected,
        local.clip && styles.surfaceVariantClip,
        local.class,
      )}
      data-vui-surface
      data-tone={local.tone}
      style={typeof local.reveal === 'number' ? { '--i': local.reveal, ...local.style } : local.style}
      tabIndex={local.interactive && local.as === 'div' ? 0 : undefined}
      {...rest}
    />
  );
};
