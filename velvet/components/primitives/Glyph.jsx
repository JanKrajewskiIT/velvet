import React from 'react';
import { cx } from './cx.js';
export function Glyph({ name, size, label, className, style, ...rest }) {
  const st = typeof size === 'number' ? { fontSize: size, ...style } : style;
  return <i className={cx('vui-icon', 'icon-' + name, typeof size === 'string' && 'vui-icon--' + size, className)} style={st} role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : true} {...rest} />;
}
export const renderIcon = (i, className) => (typeof i === 'string' ? <Glyph name={i} className={className} /> : i || null);
