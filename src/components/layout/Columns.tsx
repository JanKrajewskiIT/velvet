import { type JSX, mergeProps, splitProps } from 'solid-js';

import { cx } from '../../utils/cx';
import { type ElementTag, type HtmlProps, Polymorphic } from '../../utils/polymorphic';
import styles from './Columns.module.css';
import { spaceValue } from './space';

const DEFAULT_GAP = 4;
const DEFAULT_ALIGN = 'flex-start';

export interface ColumnsProps extends HtmlProps<HTMLElement> {
  /** @default 'div' */
  as?: ElementTag;
  /** Space-scale step or any CSS length. @default 4 */
  gap?: number | string;
  /** @default 'flex-start' */
  align?: JSX.CSSProperties['align-items'];
}

/** Wrapping row of weighted Column children. */
export const Columns = (props: ColumnsProps) => {
  const merged = mergeProps({ as: 'div', gap: DEFAULT_GAP, align: DEFAULT_ALIGN } satisfies ColumnsProps, props);
  const [local, rest] = splitProps(merged, ['as', 'gap', 'align', 'class', 'style']);
  return (
    <Polymorphic
      {...rest}
      tag={local.as}
      class={cx(styles.columns, local.class)}
      style={{ gap: spaceValue(local.gap), 'align-items': local.align, ...local.style }}
    />
  );
};
