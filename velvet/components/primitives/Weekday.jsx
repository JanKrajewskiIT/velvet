import React from 'react';
import { cx } from './cx.js';
export function Weekday({ as: El = 'span', today = false, className, children, ...rest }) {
  return <El className={cx('vui-weekday', today && 'vui-weekday--today', className)} {...rest}>{children}</El>;
}
