import { mergeProps, Show, splitProps } from 'solid-js';

import { variantClass } from '../../utils/cssModule';
import { cx } from '../../utils/cx';
import { type HtmlProps, Polymorphic } from '../../utils/polymorphic';
import type { Tone } from '../../utils/tone';
import { Glyph } from './Glyph';
import styles from './Swatch.module.css';

const SWATCH_CLASSES = {
  sm: styles.swatchVariantSm,
  lg: styles.swatchVariantLg,
  fill: styles.swatchVariantFill,
  round: styles.swatchVariantRound,
  selected: styles.swatchVariantSelected,
} as const;

export interface SwatchProps extends HtmlProps<HTMLElement, 'onClick'> {
  /** Any CSS colour; wins over `tone`. */
  color?: string;
  tone?: Tone;
  /** sm 20 · md 28 · lg 40 · fill (grid cell). @default 'md' */
  size?: 'sm' | 'md' | 'lg' | 'fill';
  round?: boolean;
  selected?: boolean;
  label?: string;
  /** Makes the swatch a button with a selected ring + check. */
  onClick?: (e: MouseEvent) => void;
}

/** A colour chip — presets, label colours, picker trigger. */
export const Swatch = (props: SwatchProps) => {
  const merged = mergeProps({ size: 'md' } satisfies SwatchProps, props);
  const [local, rest] = splitProps(merged, [
    'color',
    'tone',
    'size',
    'round',
    'selected',
    'label',
    'onClick',
    'class',
    'style',
    'children',
  ]);
  const clickable = () => !!local.onClick;
  return (
    <Polymorphic
      tag={clickable() ? 'button' : 'span'}
      type={clickable() ? 'button' : undefined}
      class={cx(
        styles.swatch,
        variantClass(SWATCH_CLASSES, local.size, 'md'),
        local.round && styles.swatchVariantRound,
        local.class,
      )}
      data-tone={local.tone}
      style={local.color ? { '--swatch': local.color, ...local.style } : local.style}
      aria-pressed={clickable() && local.selected != null ? local.selected : undefined}
      aria-label={local.label}
      role={!clickable() && local.label ? 'img' : undefined}
      onClick={local.onClick}
      {...rest}
    >
      <Show when={local.selected && clickable()} fallback={local.children}>
        <Glyph name="check" />
      </Show>
    </Polymorphic>
  );
};
