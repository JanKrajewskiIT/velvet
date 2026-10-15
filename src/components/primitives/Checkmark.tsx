import { mergeProps, splitProps } from 'solid-js';

import { variantClass } from '../../utils/cssModule';
import { cx } from '../../utils/cx';
import type { HtmlProps } from '../../utils/polymorphic';
import styles from './Checkmark.module.css';

const CHECKMARK_CLASSES = {
  sm: styles.checkmarkVariantSm,
  radio: styles.checkmarkVariantRadio,
  round: styles.checkmarkVariantRound,
  on: styles.checkmarkVariantOn,
  mixed: styles.checkmarkVariantMixed,
  disabled: styles.checkmarkVariantDisabled,
} as const;

export interface CheckmarkProps extends HtmlProps<HTMLSpanElement> {
  checked?: boolean;
  /** Wins over `checked`. */
  indeterminate?: boolean;
  /** Round box with a dot glyph. */
  radio?: boolean;
  /** Circular box with a tick — selectable cards and source rows (still multi-select). */
  round?: boolean;
  /** sm 16px · md 18px. @default 'md' */
  size?: 'sm' | 'md';
  disabled?: boolean;
}

/** The check / indeterminate / radio glyph box for rows that are not native inputs. Native inputs use Checkbox / Radio. */
export const Checkmark = (props: CheckmarkProps) => {
  const merged = mergeProps({ size: 'md' } satisfies CheckmarkProps, props);
  const [local, rest] = splitProps(merged, ['checked', 'indeterminate', 'radio', 'round', 'size', 'disabled', 'class']);
  return (
    <span
      class={cx(
        styles.checkmark,
        variantClass(CHECKMARK_CLASSES, local.size, 'md'),
        local.radio && styles.checkmarkVariantRadio,
        local.round && styles.checkmarkVariantRound,
        local.indeterminate ? styles.checkmarkVariantMixed : local.checked && styles.checkmarkVariantOn,
        local.class,
      )}
      aria-hidden={rest.role ? undefined : true}
      aria-disabled={local.disabled || undefined}
      {...rest}
    />
  );
};
