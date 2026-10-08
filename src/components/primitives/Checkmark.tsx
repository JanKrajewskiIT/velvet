import { mergeProps, splitProps } from 'solid-js';

import { cx, modifier } from '../../utils/cx';
import type { HtmlProps } from '../../utils/polymorphic';

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
        'vui-checkmark',
        modifier('vui-checkmark', local.size, 'md'),
        local.radio && 'vui-checkmark--radio',
        local.round && 'vui-checkmark--round',
        local.indeterminate ? 'vui-checkmark--mixed' : local.checked && 'vui-checkmark--on',
        local.class,
      )}
      aria-hidden={rest.role ? undefined : true}
      aria-disabled={local.disabled || undefined}
      {...rest}
    />
  );
};
