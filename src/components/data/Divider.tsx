import { type JSX, mergeProps, splitProps } from 'solid-js';

import { cx } from '../../utils/cx';
import type { HtmlProps } from '../../utils/polymorphic';

export interface DividerProps extends HtmlProps<HTMLDivElement, 'children'> {
  label?: JSX.Element;
  /** @default 'horizontal' */
  orientation?: 'horizontal' | 'vertical';
}

/** Hairline separator, optionally with a centered label ("or"). */
export const Divider = (props: DividerProps) => {
  const merged = mergeProps({ orientation: 'horizontal' } satisfies DividerProps, props);
  const [local, rest] = splitProps(merged, ['label', 'orientation', 'class']);
  return (
    <div
      {...rest}
      role="separator"
      aria-orientation={local.orientation}
      class={cx(
        'vui-divider',
        !local.label && local.orientation === 'horizontal' && 'vui-divider--plain',
        local.orientation === 'vertical' && 'vui-divider--vertical',
        local.class,
      )}
    >
      {local.label}
    </div>
  );
};
