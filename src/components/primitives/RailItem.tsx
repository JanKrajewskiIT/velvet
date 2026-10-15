import { mergeProps, splitProps } from 'solid-js';

import { variantClass } from '../../utils/cssModule';
import { cx } from '../../utils/cx';
import { type ElementTag, type HtmlProps, Polymorphic } from '../../utils/polymorphic';
import styles from './RailItem.module.css';

const RAIL_PART_ITEM_CLASSES = {
  done: styles.railPartItemVariantDone,
  active: styles.railPartItemVariantActive,
  dashed: styles.railPartItemVariantDashed,
} as const;

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
      class={cx(styles.railPartItem, local.state && variantClass(RAIL_PART_ITEM_CLASSES, local.state), local.class)}
      {...rest}
    />
  );
};
