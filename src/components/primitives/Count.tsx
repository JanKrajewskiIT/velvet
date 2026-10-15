import { mergeProps, Show, splitProps } from 'solid-js';

import { variantClass } from '../../utils/cssModule';
import { cx } from '../../utils/cx';
import type { HtmlProps } from '../../utils/polymorphic';
import styles from './Count.module.css';
import { Text } from './Text';
import type { TextVariant } from './typography';

const COUNT_CLASSES = {
  sm: styles.countVariantSm,
  lg: styles.countVariantLg,
  danger: styles.countVariantDanger,
  success: styles.countVariantSuccess,
  inverse: styles.countVariantInverse,
  neutral: styles.countVariantNeutral,
  soft: styles.countVariantSoft,
  pop: styles.countVariantPop,
} as const;

export const COUNT_TYPOGRAPHY = {
  sm: 'micro',
  md: 'kbd',
  lg: 'label-sm',
} as const satisfies Record<NonNullable<CountProps['size']>, TextVariant>;

export const COUNT_TONES = Object.freeze(['brand', 'danger', 'success', 'inverse', 'neutral', 'soft'] as const);

export type CountTone = (typeof COUNT_TONES)[number];

export interface CountProps extends HtmlProps<HTMLSpanElement, 'children'> {
  value?: number | string;
  /** Above this, shows "max+". @default 99 */
  max?: number;
  /** @default 'brand' */
  tone?: CountTone;
  /** sm 16 · md 20 · lg 24. @default 'md' */
  size?: 'sm' | 'md' | 'lg';
  /** Render when the value is 0. @default false */
  showZero?: boolean;
  /** Spring in on mount — key it by value to pop on change. */
  pop?: boolean;
  /** Accessible text, e.g. "3 unread". */
  label?: string;
}

export const formatCount = (value: number | string | undefined, max: number): number | string | undefined =>
  typeof value === 'number' && value > max ? `${max}+` : value;

/** Numeric pill for unread counts, tab/chip totals and cart items. */
export const Count = (props: CountProps) => {
  const merged = mergeProps({ max: 99, tone: 'brand', size: 'md', showZero: false } satisfies CountProps, props);
  const [local, rest] = splitProps(merged, ['value', 'max', 'tone', 'size', 'showZero', 'pop', 'label', 'class']);
  const visible = () => local.showZero || (local.value !== 0 && local.value != null);
  return (
    <Show when={visible()}>
      <Text
        as="span"
        variant={COUNT_TYPOGRAPHY[local.size]}
        tone="inherit"
        class={cx(
          styles.count,
          variantClass(COUNT_CLASSES, local.size, 'md'),
          variantClass(COUNT_CLASSES, local.tone, 'brand'),
          local.pop && styles.countVariantPop,
          local.class,
        )}
        aria-label={local.label}
        {...rest}
      >
        {formatCount(local.value, local.max)}
      </Text>
    </Show>
  );
};
