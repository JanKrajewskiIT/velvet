import React from 'react';
import { cx } from '../primitives/cx.js';
export function Checkbox({ label, description, disabled, className, size, indeterminate = false, ...rest }) {
  const ref = React.useRef(null);
  React.useEffect(() => { if (ref.current) ref.current.indeterminate = indeterminate; }, [indeterminate]);
  return (
    <label className={cx('vui-check', size === 'sm' && 'vui-check--sm', disabled && 'vui-check--disabled', className)}>
      <input ref={ref} type="checkbox" className={cx('vui-checkbox', false)} disabled={disabled} {...rest} />
      {(label || description) && (
        <span>{label}{description && <span className="vui-check__desc">{description}</span>}</span>
      )}
    </label>
  );
}
