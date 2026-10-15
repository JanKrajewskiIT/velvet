import { mergeProps, splitProps } from 'solid-js';

import { cx } from '../../utils/cx';
import { type ElementTag, type HtmlProps, Polymorphic } from '../../utils/polymorphic';
import styles from './Grid.module.css';
import { lengthValue, spaceValue } from './space';

export interface GridProps extends HtmlProps<HTMLElement> {
  /** @default 'div' */
  as?: ElementTag;
  /** Fixed column count; collapses to one column under 640px. @default 3 */
  columns?: number;
  /** px or CSS length — switches to auto-fill columns of at least this width. */
  min?: number | string;
  /** Space-scale step or any CSS length. @default 4 */
  gap?: number | string;
}

/** CSS grid: fixed columns, or auto-fill cards of a minimum width. */
export const Grid = (props: GridProps) => {
  const merged = mergeProps({ as: 'div', columns: 3, gap: 4 } satisfies GridProps, props);
  const [local, rest] = splitProps(merged, ['as', 'columns', 'min', 'gap', 'class', 'style']);
  const template = () =>
    local.min
      ? `repeat(auto-fill, minmax(min(${lengthValue(local.min)}, 100%), 1fr))`
      : `repeat(${local.columns}, minmax(0, 1fr))`;
  return (
    <Polymorphic
      tag={local.as}
      {...rest}
      class={cx(styles.gridLayout, !local.min && styles.gridLayoutVariantFixed, local.class)}
      style={{ '--grid-columns-template': template(), gap: spaceValue(local.gap), ...local.style }}
    />
  );
};
