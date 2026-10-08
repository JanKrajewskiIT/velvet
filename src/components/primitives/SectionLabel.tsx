import { type JSX, mergeProps, Show, splitProps } from 'solid-js';

import { cx } from '../../utils/cx';
import { type ElementTag, type HtmlProps, Polymorphic } from '../../utils/polymorphic';
import { renderIcon } from './Glyph';

export interface SectionLabelProps extends HtmlProps<HTMLElement> {
  /** @default 'div' */
  as?: ElementTag;
  /** Leading glyph name or node. */
  icon?: JSX.Element;
  /** Trailing slot — count, "Clear" link, action. */
  end?: JSX.Element;
  /** Default is tertiary. */
  tone?: 'secondary' | 'brand';
  /** Sticks to the top of a scrolling list with a frosted ground. */
  sticky?: boolean;
}

/** Uppercase group heading inside menus, listboxes, sidebars, filter bars and panels. */
export const SectionLabel = (props: SectionLabelProps) => {
  const merged = mergeProps({ as: 'div' } satisfies SectionLabelProps, props);
  const [local, rest] = splitProps(merged, ['as', 'icon', 'end', 'tone', 'sticky', 'class', 'children']);
  return (
    <Polymorphic
      tag={local.as}
      class={cx(
        'vui-section-label',
        local.tone && `vui-section-label--${local.tone}`,
        local.sticky && 'vui-section-label--sticky',
        local.class,
      )}
      {...rest}
    >
      {renderIcon(local.icon)}
      <span class="vui-section-label__text">{local.children}</span>
      <Show when={local.end != null}>
        <span class="vui-section-label__end">{local.end}</span>
      </Show>
    </Polymorphic>
  );
};
