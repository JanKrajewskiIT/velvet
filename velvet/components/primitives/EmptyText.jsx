import React from 'react';
import { renderIcon } from './Glyph.jsx';
import { cx } from './cx.js';
export function EmptyText({ icon, align = 'center', dashed = false, as: El = 'div', className, children, ...rest }) {
  return <El className={cx('vui-empty-text', align === 'start' && 'vui-empty-text--start', dashed && 'vui-empty-text--dashed', className)} {...rest}>{renderIcon(icon, 'vui-empty-text__icon')}{children}</El>;
}
