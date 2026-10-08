import React from 'react';
import { renderIcon } from '../primitives/Glyph.jsx';
import { cx } from '../primitives/cx.js';
export function Badge({ tone = 'neutral', variant = 'soft', size = 'md', dot = false, pulse = false, icon, className, children, ...rest }) {
  return (
    <span className={cx('vui-badge', 'vui-badge--' + tone, variant !== 'soft' && 'vui-badge--' + variant, size === 'sm' && 'vui-badge--sm', pulse && 'vui-badge--pulse', className)} {...rest}>
      {dot && <span className="vui-badge__dot" aria-hidden="true" />}
      {!dot && renderIcon(icon)}
      {children}
    </span>
  );
}
