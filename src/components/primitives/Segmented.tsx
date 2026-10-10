import { mergeProps, splitProps } from 'solid-js';

import { cx } from '../../utils/cx';
import type { HtmlProps } from '../../utils/polymorphic';

export interface SegmentedProps extends HtmlProps<HTMLDivElement> {
  /** md = 30px items (36px track) · sm = 26px items. @default 'md' */
  size?: 'sm' | 'md';
  /** Stretch to container width; items share it equally. */
  block?: boolean;
  /** Pill track + pill items. */
  round?: boolean;
  /** Square icon-only items. */
  iconOnly?: boolean;
}

/** Sunken track holding raised, mutually-exclusive items. Owns no state — set `role` and selection yourself. */
export const Segmented = (props: SegmentedProps) => {
  const merged = mergeProps({ size: 'md' } satisfies SegmentedProps, props);
  const [local, rest] = splitProps(merged, ['size', 'block', 'round', 'iconOnly', 'class']);
  return (
    <div
      class={cx(
        'vui-segmented',
        local.size === 'sm' && 'vui-segmented--sm',
        local.block && 'vui-segmented--block',
        local.round && 'vui-segmented--round',
        local.iconOnly && 'vui-segmented--icon',
        local.class,
      )}
      {...rest}
    />
  );
};
