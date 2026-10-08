import React from 'react';
import { renderIcon } from './Glyph.jsx';
import { cx } from './cx.js';
export function IconTile({ icon, tone, size = 'md', shape = 'square', outline = false, halo, color, className, style, children, ...rest }) {
  return (
    <span className={cx('vui-icon-tile', 'vui-icon-tile--' + size, shape === 'circle' && 'vui-icon-tile--circle', outline && 'vui-icon-tile--outline', halo && 'vui-icon-tile--halo-' + (halo === true ? 'md' : halo), className)} data-tone={tone} style={color ? { ...style, color } : style} aria-hidden={rest['aria-label'] ? undefined : true} {...rest}>
      {children || renderIcon(icon)}
    </span>
  );
}
