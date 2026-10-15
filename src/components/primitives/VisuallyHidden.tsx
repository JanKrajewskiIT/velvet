import { mergeProps, splitProps } from 'solid-js';

import { cx } from '../../utils/cx';
import { type ElementTag, type HtmlProps, Polymorphic } from '../../utils/polymorphic';
import styles from './VisuallyHidden.module.css';

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
      class={cx(styles.srOnly, local.focusable && styles.srOnlyVariantFocusable, local.class)}
      {...rest}
    />
  );
};
