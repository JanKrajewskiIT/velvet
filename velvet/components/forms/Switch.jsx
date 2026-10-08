import React from 'react';
import { cx } from '../primitives/cx.js';
export function Switch({ label, description, disabled, className, size, ...rest }) {
  return (
    <label className={cx('vui-check', disabled && 'vui-check--disabled', className)}>
      <input type="checkbox" role="switch" className={cx('vui-switch', size === 'sm' && 'vui-switch--sm')} disabled={disabled} {...rest} />
      {(label || description) && (
        <span>{label}{description && <span className="vui-check__desc">{description}</span>}</span>
      )}
    </label>
  );
}
