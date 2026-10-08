import { mergeProps, Show, splitProps } from 'solid-js';

import { cx, modifier } from '../../utils/cx';
import type { HtmlProps } from '../../utils/polymorphic';
import { formatCount } from './Count';

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
        'vui-indicator',
        local.overlap === 'circle' && 'vui-indicator--circle',
        local.placement.startsWith('bottom') && 'vui-indicator--bottom',
        local.placement.endsWith('start') && 'vui-indicator--start',
        local.inset && 'vui-indicator--inset',
        local.class,
      )}
      {...rest}
    >
      {local.children}
      <Show
        when={hasCount()}
        fallback={
          <Show when={local.dot}>
            <span class="vui-dot vui-indicator__item" data-tone={local.tone ?? 'brand'} {...announce()} />
          </Show>
        }
      >
        <span
          class={cx(
            'vui-count',
            'vui-indicator__item',
            modifier('vui-count', local.size, 'md'),
            local.tone !== 'brand' && modifier('vui-count', local.tone),
          )}
          {...announce()}
        >
          {formatCount(local.count ?? undefined, local.max)}
        </span>
      </Show>
    </span>
  );
};
