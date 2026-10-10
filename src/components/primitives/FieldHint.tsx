import { splitProps } from 'solid-js';

import { cx } from '../../utils/cx';
import type { HtmlProps } from '../../utils/polymorphic';

export interface FieldHintProps extends HtmlProps<HTMLSpanElement> {
  error?: boolean;
  /** Fixed-height lane that announces changes politely. */
  lane?: boolean;
}

export const FieldHint = (props: FieldHintProps) => {
  const [local, rest] = splitProps(props, ['error', 'lane', 'class', 'children']);
  return (
    <span
      class={cx('vui-hint', local.error && 'vui-hint--error', local.lane && 'vui-hint--lane', local.class)}
      aria-live={local.lane ? 'polite' : undefined}
      {...rest}
    >
      {local.children}
    </span>
  );
};
