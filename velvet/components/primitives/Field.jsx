import React from 'react';
import { cx } from './cx.js';
export function FieldLabel({ as, htmlFor, optional, required, children, className, ...rest }) {
  const Tag = as || (htmlFor ? 'label' : 'span');
  return <Tag className={cx('vui-label', className)} htmlFor={Tag === 'label' ? htmlFor : undefined} {...rest}>{children}{required && <span className="vui-label__req" aria-hidden="true">*</span>}{optional && <span className="vui-label__opt">Optional</span>}</Tag>;
}
export function FieldHint({ error = false, lane = false, id, children, className, ...rest }) {
  return <span id={id} className={cx('vui-hint', error && 'vui-hint--error', lane && 'vui-hint--lane', className)} aria-live={lane ? 'polite' : undefined} {...rest}>{children}</span>;
}
export function Field({ label, hint, error, optional, required, id, count, maxCount, reserveHint = false, className, children }) {
  const autoId = React.useId();
  const fid = id || autoId;
  const hintId = fid + '-hint';
  const counter = maxCount != null;
  const lane = reserveHint || counter;
  const describedBy = error || hint || counter ? hintId : undefined;
  const ctl = { id: fid, invalid: !!error, describedBy, required };
  const body = typeof children === 'function' ? children(ctl) : children;
  return (
    <div className={cx('vui-field', className)}>
      {label && <FieldLabel htmlFor={fid} optional={optional} required={required}>{label}</FieldLabel>}
      {body}
      {(error || hint || lane) && (
        <div className={cx('vui-field__foot', lane && 'vui-hint--lane')}>
          <FieldHint id={hintId} error={!!error} lane={lane}>{error || hint}</FieldHint>
          {counter && <span className={cx('vui-hint', 'vui-field__count', count >= maxCount && 'vui-field__count--max')}>{count}/{maxCount}</span>}
        </div>
      )}
    </div>
  );
}
