import React from 'react';
import { Spinner } from '../feedback/Spinner.jsx';
import { renderIcon } from '../primitives/Glyph.jsx';
import { cx } from '../primitives/cx.js';
export function Button({ variant = 'primary', size = 'md', iconLeft, iconRight, loading = false, block = false, disabled, className, children, type = 'button', ...rest }) {
  return (
    <button type={type} className={cx('vui-btn', 'vui-btn--' + variant, size !== 'md' && 'vui-btn--' + size, block && 'vui-btn--block', className)} disabled={disabled || loading} aria-busy={loading || undefined} {...rest}>
      {loading ? <Spinner size="inline" tone="current" /> : renderIcon(iconLeft)}
      {children}
      {!loading && renderIcon(iconRight)}
    </button>
  );
}
