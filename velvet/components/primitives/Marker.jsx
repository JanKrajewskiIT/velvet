import React from 'react';
import { cx } from './cx.js';
export function Marker({ size = 'md', appearance = 'soft', tone, ring = false, gap = false, dot = false, className, children, ...rest }) {
  return <span className={cx('vui-marker', size !== 'md' && 'vui-marker--' + size, 'vui-marker--' + appearance, ring && 'vui-marker--ring', gap && 'vui-marker--gap', className)} data-tone={tone} {...rest}>{dot ? <span className="vui-marker__dot" /> : children}</span>;
}
