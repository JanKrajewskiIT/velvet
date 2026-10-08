import React from 'react';
import { renderIcon } from '../primitives/Glyph.jsx';
import { cx } from '../primitives/cx.js';
export function IconButton({ icon, label, variant = 'ghost', size = 'md', shape = 'square', className, type = 'button', ...rest }) {
  return (
    <button type={type} aria-label={label} title={label} className={cx('vui-btn', 'vui-btn--icon', 'vui-btn--' + variant, size !== 'md' && 'vui-btn--' + size, shape === 'circle' && 'vui-btn--circle', className)} {...rest}>
      {renderIcon(icon)}
    </button>
  );
}
