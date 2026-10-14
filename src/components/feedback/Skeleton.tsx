import { mergeProps, splitProps } from 'solid-js';

import { cssLength } from '../../utils/cssLength';
import { cx } from '../../utils/cx';
import type { HtmlProps } from '../../utils/polymorphic';

export interface SkeletonProps extends HtmlProps<HTMLSpanElement> {
  width?: number | string;
  /** @default 12 */
  height?: number | string;
  /** Round placeholder whose diameter is `height`. */
  circle?: boolean;
  radius?: number | string;
}

/** Shimmering placeholder in the shape of content that is loading. Wrap the loading region in `aria-busy="true"`. */
export const Skeleton = (props: SkeletonProps) => {
  const merged = mergeProps({ height: 12 } satisfies SkeletonProps, props);
  const [local, rest] = splitProps(merged, ['width', 'height', 'circle', 'radius', 'class', 'style']);
  return (
    <span
      {...rest}
      class={cx('vui-skeleton', local.class)}
      style={{
        width: cssLength(local.circle ? local.height : local.width),
        height: cssLength(local.height),
        'border-radius': local.circle ? '50%' : cssLength(local.radius),
        ...local.style,
      }}
      aria-hidden="true"
    />
  );
};
