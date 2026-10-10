import { mergeProps, splitProps } from 'solid-js';

import { cx } from '../../utils/cx';
import { type ElementTag, type HtmlProps, Polymorphic } from '../../utils/polymorphic';

export interface VisuallyHiddenProps extends HtmlProps<HTMLElement> {
  /** @default 'span' */
  as?: ElementTag;
  /** Becomes visible when it (or a child) receives focus. */
  focusable?: boolean;
}

/** Content for screen readers only — extra context for icon buttons, table captions and form group names. */
export const VisuallyHidden = (props: VisuallyHiddenProps) => {
  const merged = mergeProps({ as: 'span' } satisfies VisuallyHiddenProps, props);
  const [local, rest] = splitProps(merged, ['as', 'focusable', 'class']);
  return (
    <Polymorphic
      tag={local.as}
      class={cx('vui-sr-only', local.focusable && 'vui-sr-only--focusable', local.class)}
      {...rest}
    />
  );
};
