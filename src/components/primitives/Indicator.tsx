import { mergeProps, Show, splitProps } from 'solid-js';

import { cx } from '../../utils/cx';
import type { HtmlProps } from '../../utils/polymorphic';
import { Count, COUNT_TONES } from './Count';
import { Dot } from './Dot';
import styles from './Indicator.module.css';

export type IndicatorPlacement = 'top-end' | 'top-start' | 'bottom-end' | 'bottom-start';

export interface IndicatorProps extends HtmlProps<HTMLSpanElement> {
  /** Number or short text. 0 / null hides it. */
  count?: number | string | null;
  /** Show a dot instead of a number (unread, presence). */
  dot?: boolean;
  /** @default 99 */
  max?: number;
  /** Count tones (brand, danger, success, inverse, neutral, soft) or Dot tones (success, warning…). @default 'brand' */
  tone?: string;
  /** Count size. @default 'sm' */
  size?: 'sm' | 'md';
  /** @default 'top-end' */
  placement?: IndicatorPlacement;
  /** rect = corner of the box · circle = on the curve of a round host. @default 'rect' */
  overlap?: 'rect' | 'circle';
  /** Pull inside the host's bounds (for hosts with `overflow: hidden`). */
  inset?: boolean;
  /** Announces the indicator, e.g. "3 unread". */
  label?: string;
}

/** Anchors a Count or Dot to the corner of any element — icon, IconButton, Avatar, tab. */
export const Indicator = (props: IndicatorProps) => {
  const merged = mergeProps(
    { max: 99, size: 'sm', placement: 'top-end', overlap: 'rect' } satisfies IndicatorProps,
    props,
  );
  const [local, rest] = splitProps(merged, [
    'count',
    'dot',
    'max',
    'tone',
    'size',
    'placement',
    'overlap',
    'inset',
    'label',
    'class',
    'children',
  ]);
  const hasCount = () => local.count != null && local.count !== 0 && local.count !== '';
  const announce = () => ({
    'aria-hidden': local.label ? undefined : (true as const),
    'aria-label': local.label,
    role: local.label ? ('status' as const) : undefined,
  });
  return (
    <span
      class={cx(
        styles.indicator,
        local.overlap === 'circle' && styles.indicatorVariantCircle,
        local.placement.startsWith('bottom') && styles.indicatorVariantBottom,
        local.placement.endsWith('start') && styles.indicatorVariantStart,
        local.inset && styles.indicatorVariantInset,
        local.class,
      )}
      {...rest}
    >
      {local.children}
      <Show
        when={hasCount()}
        fallback={
          <Show when={local.dot}>
            <Dot class={styles.indicatorPartItem} data-tone={local.tone ?? 'brand'} {...announce()} />
          </Show>
        }
      >
        <Count
          value={local.count ?? undefined}
          max={local.max}
          size={local.size}
          tone={COUNT_TONES.find((tone) => tone === local.tone)}
          class={styles.indicatorPartItem}
          {...announce()}
        />
      </Show>
    </span>
  );
};
