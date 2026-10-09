import { createMemo, For, mergeProps, Show, splitProps } from 'solid-js';

import { cx, modifier } from '../../utils/cx';
import { percentOf } from '../../utils/math';
import type { HtmlProps } from '../../utils/polymorphic';
import type { Tone } from '../../utils/tone';

export interface MeterProps extends HtmlProps<HTMLSpanElement> {
  value?: number;
  /** @default 100 */
  max?: number;
  /** Fill colour. @default brand */
  tone?: Tone;
  /** sm 4px · md 6px · lg 8px. @default 'md' */
  size?: 'sm' | 'md' | 'lg';
  /** Split into N segments (password strength). */
  steps?: number;
  /** Sweep highlight while loading. */
  shimmer?: boolean;
  /** Rating fill colour. */
  rating?: boolean;
  /** Unknown amount — a 40% fill sweeps the track. */
  indeterminate?: boolean;
  /** Accessible name — omit when a sibling already states the value. */
  label?: string;
}

/** Track + fill for a known quantity (skill level, rating share, quota). Progress is the task-progress component. */
export const Meter = (props: MeterProps) => {
  const merged = mergeProps({ value: 0, max: 100, size: 'md' } satisfies MeterProps, props);
  const [local, rest] = splitProps(merged, [
    'value',
    'max',
    'tone',
    'size',
    'steps',
    'shimmer',
    'rating',
    'indeterminate',
    'label',
    'class',
  ]);
  const percent = createMemo(() => percentOf(local.value, local.max));
  const litSegments = () => Math.round((percent() / 100) * (local.steps ?? 0));
  const segments = () => Array.from({ length: local.steps ?? 0 }, (_, i) => i);
  const a11y = () =>
    local.label
      ? {
          role: 'meter' as const,
          'aria-label': local.label,
          'aria-valuemin': 0,
          'aria-valuemax': local.max,
          'aria-valuenow': local.value,
        }
      : { 'aria-hidden': true as const };

  return (
    <span
      class={cx(
        'vui-meter',
        modifier('vui-meter', local.size, 'md'),
        !!local.steps && 'vui-meter--segmented',
        local.shimmer && 'vui-meter--shimmer',
        local.rating && 'vui-meter--rating',
        local.indeterminate && 'vui-meter--indeterminate',
        local.class,
      )}
      data-tone={local.tone}
      {...a11y()}
      {...rest}
    >
      <Show
        when={local.steps}
        fallback={<span class="vui-meter__fill" style={local.indeterminate ? undefined : { width: `${percent()}%` }} />}
      >
        <For each={segments()}>
          {(i) => <span class={cx('vui-meter__seg', i < litSegments() && 'vui-meter__seg--on')} />}
        </For>
      </Show>
    </span>
  );
};
