import React from 'react';
import { cx } from './cx.js';
export function Swatch({ color, tone, size = 'md', round = false, selected, onClick, label, className, style, children, ...rest }) {
  const Tag = onClick ? 'button' : 'span';
  return <Tag type={onClick ? 'button' : undefined} className={cx('vui-swatch', size !== 'md' && 'vui-swatch--' + size, round && 'vui-swatch--round', className)} data-tone={tone} style={{ ...(color ? { '--swatch': color } : null), ...style }} aria-pressed={onClick && selected != null ? !!selected : undefined} aria-label={label} role={!onClick && label ? 'img' : undefined} onClick={onClick} {...rest}>{selected && onClick ? <i className="vui-icon icon-check" aria-hidden="true" /> : children}</Tag>;
}
