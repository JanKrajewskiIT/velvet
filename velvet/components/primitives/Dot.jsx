import React from 'react';
import { cx } from './cx.js';
export function Dot({ tone = 'neutral', size = 'md', pulse = false, ring = false, label, className, ...rest }) {
  return <span className={cx('vui-dot', size !== 'md' && 'vui-dot--' + size, pulse && 'vui-dot--pulse', ring && 'vui-dot--ring', className)} data-tone={tone} role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : true} {...rest} />;
}
