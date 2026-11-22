import type { JSX } from '@solidjs/web';

import { booleanAttribute } from '../../utils/booleanAttribute';
import { cx } from '../../utils/cx';
import { partitionProps } from '../../utils/props';
import { renderIcon } from './Glyph';
import { useSegmentedSize } from './Segmented';
import styles from './SegmentedItem.module.css';
import { typographyClass } from './typography';

export interface SegmentedItemProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Writes `aria-checked` (role="radio"), `aria-selected` (role="tab") or `aria-pressed` (no role). */
  selected?: boolean;
  /** Glyph name or node, before the label. */
  icon?: JSX.Element;
}

export const SegmentedItem = (props: SegmentedItemProps) => {
  const [local, rest] = partitionProps(props, ['selected', 'icon', 'class', 'children']);
  const size = useSegmentedSize();
  const selectionState = () => {
    if (local.selected === undefined) return {};
    if (rest.role === 'tab') return { 'aria-selected': booleanAttribute(local.selected) };
    if (rest.role === 'radio') return { 'aria-checked': booleanAttribute(local.selected) };
    return { 'aria-pressed': booleanAttribute(local.selected) };
  };
  return (
    <button
      {...rest}
      {...selectionState()}
      type="button"
      class={cx(typographyClass(size() === 'sm' ? 'label-sm' : 'button-sm'), styles.segmentedPartItem, local.class)}
    >
      {renderIcon(local.icon)}
      {local.children}
    </button>
  );
};
