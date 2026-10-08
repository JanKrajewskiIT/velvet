import React from 'react';
import { cx } from './cx.js';
export function Count({ value, max = 99, tone = 'brand', size = 'md', showZero = false, pop = false, label, className, ...rest }) {
  if (!showZero && (value === 0 || value == null)) return null;
  const text = typeof value === 'number' && value > max ? max + '+' : value;
  return <span className={cx('vui-count', size !== 'md' && 'vui-count--' + size, tone !== 'brand' && 'vui-count--' + tone, pop && 'vui-count--pop', className)} aria-label={label} {...rest}>{text}</span>;
}
