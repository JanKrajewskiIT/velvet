import React from 'react';
import { cx } from './cx.js';
export function Separator({ variant = 'line', orientation = 'vertical', semantic = false, className, children, ...rest }) {
  return <span className={cx('vui-sep', 'vui-sep--' + variant, variant === 'line' && 'vui-sep--' + orientation, className)} role={semantic ? 'separator' : undefined} aria-orientation={semantic ? orientation : undefined} aria-hidden={semantic ? undefined : true} {...rest}>{variant === 'text' ? (children ?? '/') : null}</span>;
}
