import React from 'react';
import { cx } from '../primitives/cx.js';
export function Radio({ label, description, disabled, className, size, ...rest }) {
  return (
    <label className={cx('vui-check', size === 'sm' && 'vui-check--sm', disabled && 'vui-check--disabled', className)}>
      <input type="radio" className={cx('vui-radio', false)} disabled={disabled} {...rest} />
      {(label || description) && (
        <span>{label}{description && <span className="vui-check__desc">{description}</span>}</span>
      )}
    </label>
  );
}
