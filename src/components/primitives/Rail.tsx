import { mergeProps, splitProps } from 'solid-js';

import { cx } from '../../utils/cx';
import { type ElementTag, type HtmlProps, Polymorphic } from '../../utils/polymorphic';

export interface RailProps extends HtmlProps<HTMLElement> {
  /** @default 'ol' */
  as?: ElementTag;
  /** Diameter of the leading markers — the line starts below them. sm 24 · md 28 · lg 32. @default 'md' */
  size?: 'sm' | 'md' | 'lg';
  /** Draw the connector. @default true */
  line?: boolean;
}

/** Vertical list whose items are joined by a connector line under their leading Marker. */
export const Rail = (props: RailProps) => {
  const merged = mergeProps({ as: 'ol', size: 'md', line: true } satisfies RailProps, props);
  const [local, rest] = splitProps(merged, ['as', 'size', 'line', 'class']);
  return (
    <Polymorphic
      tag={local.as}
      data-rail={local.size}
      class={cx('vui-rail', !local.line && 'vui-rail--none', local.class)}
      {...rest}
    />
  );
};
