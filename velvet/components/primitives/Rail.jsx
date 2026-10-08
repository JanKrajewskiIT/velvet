import React from 'react';
import { cx } from './cx.js';
export function Rail({ as: El = 'ol', size = 'md', line = true, className, children, ...rest }) {
  return <El data-rail={size} className={cx('vui-rail', !line && 'vui-rail--none', className)} {...rest}>{children}</El>;
}
export function RailItem({ as: El = 'li', state, className, children, ...rest }) {
  return <El className={cx('vui-rail__item', state && 'vui-rail__item--' + state, className)} {...rest}>{children}</El>;
}
