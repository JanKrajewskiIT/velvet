import React from 'react';
import { renderIcon } from './Glyph.jsx';
import { cx } from './cx.js';
export function Control({ size = 'md', invalid = false, disabled = false, readOnly = false, multiline = false, iconLeft, iconRight, prefix, suffix, end, className, children, ...rest }) {
  return (
    <div className={cx('vui-control', size !== 'md' && 'vui-control--' + size, multiline && 'vui-control--textarea', invalid && 'vui-control--invalid', disabled && 'vui-control--disabled', readOnly && 'vui-control--readonly', className)} {...rest}>
      {iconLeft && <span className="vui-control__adorn">{renderIcon(iconLeft)}</span>}
      {prefix && <span className="vui-control__affix">{prefix}</span>}
      {children}
      {suffix && <span className="vui-control__affix vui-control__affix--end">{suffix}</span>}
      {iconRight && <span className="vui-control__adorn vui-control__adorn--end">{renderIcon(iconRight)}</span>}
      {end}
    </div>
  );
}
