import { type JSX, mergeProps, splitProps } from 'solid-js';

import { cx } from '../../utils/cx';
import type { HtmlProps } from '../../utils/polymorphic';
import { renderIcon } from './Glyph';

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

export interface SegmentedItemProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Writes `aria-checked` (role="radio"), `aria-selected` (role="tab") or `aria-pressed` (no role). */
  selected?: boolean;
  /** Glyph name or node, before the label. */
  icon?: JSX.Element;
}

export const SegmentedItem = (props: SegmentedItemProps) => {
  const [local, rest] = splitProps(props, ['selected', 'icon', 'class', 'children']);
  const selectionState = () => {
    if (local.selected === undefined) return {};
    if (rest.role === 'tab') return { 'aria-selected': local.selected };
    if (rest.role === 'radio') return { 'aria-checked': local.selected };
    return { 'aria-pressed': local.selected };
  };
  return (
    <button type="button" class={cx('vui-segmented__item', local.class)} {...selectionState()} {...rest}>
      {renderIcon(local.icon)}
      {local.children}
    </button>
  );
};
