import { mergeProps, splitProps } from 'solid-js';

import { cx } from '../../utils/cx';
import { type ElementTag, type HtmlProps, Polymorphic } from '../../utils/polymorphic';

export interface RailItemProps extends HtmlProps<HTMLElement> {
  /** @default 'li' */
  as?: ElementTag;
  /** Connector below this item: done = success solid · active = brand · dashed = upcoming. */
  state?: 'done' | 'active' | 'dashed';
}

export const RailItem = (props: RailItemProps) => {
  const merged = mergeProps({ as: 'li' } satisfies RailItemProps, props);
  const [local, rest] = splitProps(merged, ['as', 'state', 'class']);
  return (
    <Polymorphic
      tag={local.as}
      class={cx('vui-rail__item', local.state && `vui-rail__item--${local.state}`, local.class)}
      {...rest}
    />
  );
};
