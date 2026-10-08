import React from 'react';
import { Field } from '../primitives/Field.jsx';
import { Control } from '../primitives/Control.jsx';
export function Input({ label, hint, error, optional, required, iconLeft, iconRight, prefix, suffix, size = 'md', multiline = false, disabled, readOnly, validate, reserveHint, showCount, maxLength, id, className, onBlur, onChange, value, defaultValue, ...rest }) {
  const [touched, setTouched] = React.useState(false);
  const [vErr, setVErr] = React.useState();
  const [len, setLen] = React.useState(String(defaultValue ?? '').length);
  const count = value !== undefined ? String(value ?? '').length : len;
  const handleBlur = (e) => { if (validate) { setTouched(true); setVErr(validate(e.target.value) || undefined); } onBlur && onBlur(e); };
  const handleChange = (e) => { setLen(e.target.value.length); if (validate && touched) setVErr(validate(e.target.value) || undefined); onChange && onChange(e); };
  const err = error || vErr;
  const Tag = multiline ? 'textarea' : 'input';
  return (
    <Field label={label} hint={hint} error={err} optional={optional} required={required} id={id} reserveHint={reserveHint || !!validate} count={count} maxCount={showCount && maxLength ? maxLength : undefined}>
      {(ctl) => (
        <Control size={size} multiline={multiline} invalid={ctl.invalid} disabled={disabled} readOnly={readOnly} iconLeft={iconLeft} iconRight={iconRight} prefix={prefix} suffix={suffix} className={className}>
          <Tag id={ctl.id} className="vui-control__input" disabled={disabled} readOnly={readOnly} required={required} maxLength={maxLength} value={value} defaultValue={defaultValue} aria-invalid={ctl.invalid || undefined} aria-describedby={ctl.describedBy} onBlur={handleBlur} onChange={handleChange} {...rest} />
        </Control>
      )}
    </Field>
  );
}
