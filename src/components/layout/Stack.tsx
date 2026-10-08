import { type JSX, mergeProps, splitProps } from 'solid-js';

import { cx } from '../../utils/cx';
import { type ElementTag, type HtmlProps, Polymorphic } from '../../utils/polymorphic';
import { spaceValue } from './space';

export interface StackProps extends HtmlProps<HTMLElement> {
  /** @default 'div' */
  as?: ElementTag;
  /** @default 'column' */
  direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  /** Space-scale step (`4` → `var(--space-4)`) or any CSS length. @default 4 */
  gap?: number | string;
  align?: JSX.CSSProperties['align-items'];
  justify?: JSX.CSSProperties['justify-content'];
  wrap?: boolean;
  /** Hairlines between children. */
  divider?: boolean;
}

/** Flex stack with token gaps. */
export const Stack = (props: StackProps) => {
  const merged = mergeProps({ as: 'div', direction: 'column', gap: 4 } satisfies StackProps, props);
  const [local, rest] = splitProps(merged, [
    'as',
    'direction',
    'gap',
    'align',
    'justify',
    'wrap',
    'divider',
    'class',
    'style',
  ]);
  return (
    <Polymorphic
      tag={local.as}
      {...rest}
      class={cx('vui-stack', local.divider && 'vui-stack--divided', local.class)}
      style={{
        'flex-direction': local.direction,
        gap: spaceValue(local.gap),
        'align-items': local.align,
        'justify-content': local.justify,
        'flex-wrap': local.wrap ? 'wrap' : undefined,
        ...local.style,
      }}
    />
  );
};
