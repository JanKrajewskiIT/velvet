import { mergeProps, Show, splitProps } from 'solid-js';

import { cx, modifier } from '../../utils/cx';
import type { HtmlProps } from '../../utils/polymorphic';

export type CountTone = 'brand' | 'danger' | 'success' | 'inverse' | 'neutral' | 'soft';

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
      <span
        class={cx(
          'vui-count',
          modifier('vui-count', local.size, 'md'),
          modifier('vui-count', local.tone, 'brand'),
          local.pop && 'vui-count--pop',
          local.class,
        )}
        aria-label={local.label}
        {...rest}
      >
        {formatCount(local.value, local.max)}
      </span>
    </Show>
  );
};
