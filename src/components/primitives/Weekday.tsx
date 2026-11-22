import { cx } from '../../utils/cx';
import { type ElementTag, type HtmlProps, Polymorphic } from '../../utils/polymorphic';
import { partitionProps, withDefaults } from '../../utils/props';
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
  const merged = withDefaults({ as: 'span' } satisfies WeekdayProps, props);
  const [local, rest] = partitionProps(merged, ['as', 'today', 'class']);
  return (
    <Polymorphic
      {...rest}
      tag={local.as}
      class={cx(typographyClass('overline'), styles.weekday, local.today && styles.weekdayVariantToday, local.class)}
    />
  );
};
