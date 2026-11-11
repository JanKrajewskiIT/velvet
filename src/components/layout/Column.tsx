import { mergeProps, splitProps } from 'solid-js';

import { cx } from '../../utils/cx';
import { type ElementTag, type HtmlProps, Polymorphic } from '../../utils/polymorphic';
import styles from './Column.module.css';
import { lengthValue } from './space';

const DEFAULT_GROW = 1;
const DEFAULT_BASIS = 320;

export interface ColumnProps extends HtmlProps<HTMLElement> {
  /** @default 'div' */
  as?: ElementTag;
  /** Share of the free space. @default 1 */
  grow?: number;
  /** Width requested before wrapping: px or CSS length. @default 320 */
  basis?: number | string;
}

/** Weighted column that wraps when its basis no longer fits. */
export const Column = (props: ColumnProps) => {
  const merged = mergeProps({ as: 'div', grow: DEFAULT_GROW, basis: DEFAULT_BASIS } satisfies ColumnProps, props);
  const [local, rest] = splitProps(merged, ['as', 'grow', 'basis', 'class', 'style']);
  return (
    <Polymorphic
      {...rest}
      tag={local.as}
      class={cx(styles.column, local.class)}
      style={{ flex: `${local.grow} 1 ${lengthValue(local.basis)}`, ...local.style }}
    />
  );
};
