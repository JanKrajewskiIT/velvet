import { mergeProps, splitProps } from 'solid-js';

import { cx, modifier } from '../../utils/cx';
import type { HtmlProps } from '../../utils/polymorphic';
import type { Tone } from '../../utils/tone';

export interface DotProps extends HtmlProps<HTMLSpanElement> {
  /** @default 'neutral' */
  tone?: Tone;
  /** sm 5px · md 6px · lg 8px. @default 'md' */
  size?: 'sm' | 'md' | 'lg';
  /** Soft ping for live states. */
  pulse?: boolean;
  /** 2px surface-coloured ring — for dots overlapping avatars. */
  ring?: boolean;
  /** Accessible name when the dot stands alone; otherwise hidden from assistive technology. */
  label?: string;
}

/** Small round status / presence / category marker. Pair status colour with a label. */
export const Dot = (props: DotProps) => {
  const merged = mergeProps({ tone: 'neutral', size: 'md' } satisfies DotProps, props);
  const [local, rest] = splitProps(merged, ['tone', 'size', 'pulse', 'ring', 'label', 'class']);
  return (
    <span
      class={cx(
        'vui-dot',
        modifier('vui-dot', local.size, 'md'),
        local.pulse && 'vui-dot--pulse',
        local.ring && 'vui-dot--ring',
        local.class,
      )}
      data-tone={local.tone}
      role={local.label ? 'img' : undefined}
      aria-label={local.label}
      aria-hidden={local.label ? undefined : true}
      {...rest}
    />
  );
};
