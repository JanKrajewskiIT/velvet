import React from 'react';
import { renderIcon } from './Glyph.jsx';
import { cx } from './cx.js';
export function Segmented({ size = 'md', block = false, round = false, iconOnly = false, className, children, ...rest }) {
  return <div className={cx('vui-segmented', size === 'sm' && 'vui-segmented--sm', block && 'vui-segmented--block', round && 'vui-segmented--round', iconOnly && 'vui-segmented--icon', className)} {...rest}>{children}</div>;
}
export const SegmentedItem = React.forwardRef(function SegmentedItem({ selected, icon, className, children, ...rest }, ref) {
  const st = selected === undefined ? null : rest.role === 'tab' ? { 'aria-selected': !!selected } : rest.role === 'radio' ? { 'aria-checked': !!selected } : { 'aria-pressed': !!selected };
  return <button ref={ref} type="button" className={cx('vui-segmented__item', className)} {...st} {...rest}>{renderIcon(icon)}{children}</button>;
});
