import { mergeProps, splitProps } from 'solid-js';

import { cx } from '../../utils/cx';
import { type ElementTag, type HtmlProps, Polymorphic } from '../../utils/polymorphic';

export interface WeekdayProps extends HtmlProps<HTMLElement> {
  /** @default 'span' */
  as?: ElementTag;
  /** Brand colour for the current day. */
  today?: boolean;
}

/** Short weekday label for date grids. Pair with `weekdayNames()` from the date helpers. */
export const Weekday = (props: WeekdayProps) => {
  const merged = mergeProps({ as: 'span' } satisfies WeekdayProps, props);
  const [local, rest] = splitProps(merged, ['as', 'today', 'class']);
  return (
    <Polymorphic tag={local.as} class={cx('vui-weekday', local.today && 'vui-weekday--today', local.class)} {...rest} />
  );
};
