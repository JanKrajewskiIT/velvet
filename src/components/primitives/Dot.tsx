import { mergeProps, splitProps } from 'solid-js';

import { variantClass } from '../../utils/cssModule';
import { cx } from '../../utils/cx';
import type { HtmlProps } from '../../utils/polymorphic';
import type { Tone } from '../../utils/tone';
import styles from './Dot.module.css';

const DOT_CLASSES = {
  sm: styles.dotVariantSm,
  lg: styles.dotVariantLg,
  ring: styles.dotVariantRing,
  pulse: styles.dotVariantPulse,
} as const;

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
        styles.dot,
        variantClass(DOT_CLASSES, local.size, 'md'),
        local.pulse && styles.dotVariantPulse,
        local.ring && styles.dotVariantRing,
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
