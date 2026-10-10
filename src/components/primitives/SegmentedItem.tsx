import { type JSX, splitProps } from 'solid-js';

import { cx } from '../../utils/cx';
import { renderIcon } from './Glyph';

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
