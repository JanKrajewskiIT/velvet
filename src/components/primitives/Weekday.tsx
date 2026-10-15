import { mergeProps, splitProps } from 'solid-js';

import { cx } from '../../utils/cx';
import { type ElementTag, type HtmlProps, Polymorphic } from '../../utils/polymorphic';
import { typographyClass } from './typography';
import styles from './Weekday.module.css';

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
    <Polymorphic
      {...rest}
      tag={local.as}
      class={cx(typographyClass('overline'), styles.weekday, local.today && styles.weekdayVariantToday, local.class)}
    />
  );
};
