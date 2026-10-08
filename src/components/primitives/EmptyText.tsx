import { type JSX, mergeProps, splitProps } from 'solid-js';

import { cx } from '../../utils/cx';
import { type HtmlProps, Polymorphic } from '../../utils/polymorphic';
import { renderIcon } from './Glyph';

export interface EmptyTextProps extends HtmlProps<HTMLElement> {
  /** Glyph name or node above the text. */
  icon?: JSX.Element;
  /** start = left-aligned, no inline padding (inside prose / timelines). @default 'center' */
  align?: 'center' | 'start';
  /** Dashed outline — for drop zones and empty editable lists. */
  dashed?: boolean;
  /** Element to render — `li` inside lists, `p` inside prose. @default 'div' */
  as?: 'div' | 'li' | 'p' | 'span';
}

/** One-line "nothing here" inside a list, panel or column. For a whole empty view use EmptyState. */
export const EmptyText = (props: EmptyTextProps) => {
  const merged = mergeProps({ align: 'center', as: 'div' } satisfies EmptyTextProps, props);
  const [local, rest] = splitProps(merged, ['icon', 'align', 'dashed', 'as', 'class', 'children']);
  return (
    <Polymorphic
      tag={local.as}
      class={cx(
        'vui-empty-text',
        local.align === 'start' && 'vui-empty-text--start',
        local.dashed && 'vui-empty-text--dashed',
        local.class,
      )}
      {...rest}
    >
      {renderIcon(local.icon, 'vui-empty-text__icon')}
      {local.children}
    </Polymorphic>
  );
};
