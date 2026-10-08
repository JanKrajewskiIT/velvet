import React from 'react';
import { Field } from '../primitives/Field.jsx';
import { Control } from '../primitives/Control.jsx';
export function Textarea({ label, hint, error, optional, rows = 3, autoResize = true, maxRows = 10, resize, size = 'md', disabled, readOnly, validate, reserveHint, showCount, maxLength, id, className, onBlur, onChange, value, defaultValue, ...rest }) {
  const autoId = React.useId();
  const fid = id || autoId;
  const ref = React.useRef(null);
  const [touched, setTouched] = React.useState(false);
  const [vErr, setVErr] = React.useState();
  const [len, setLen] = React.useState(String(defaultValue ?? '').length);
  const count = value !== undefined ? String(value ?? '').length : len;
  const fit = () => {
    const el = ref.current; if (!el || !autoResize) return;
    const cs = getComputedStyle(el); const lh = parseFloat(cs.lineHeight) || 20; const pad = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);
    el.style.height = 'auto';
    el.style.height = Math.min(Math.max(el.scrollHeight, rows * lh + pad), maxRows * lh + pad) + 'px';
    el.style.overflowY = el.scrollHeight > maxRows * lh + pad ? 'auto' : 'hidden';
  };
  React.useLayoutEffect(fit, [value, rows, maxRows, autoResize]);
  const handleBlur = (e) => { if (validate) { setTouched(true); setVErr(validate(e.target.value) || undefined); } onBlur && onBlur(e); };
  const handleChange = (e) => { setLen(e.target.value.length); if (validate && touched) setVErr(validate(e.target.value) || undefined); fit(); onChange && onChange(e); };
  const err = error || vErr;
  const counter = showCount && maxLength;
  const lane = reserveHint || !!validate || counter;
  const rz = resize ?? (autoResize ? 'none' : 'vertical');
  return (
    <Field label={label} hint={hint} error={err} optional={optional} id={fid} reserveHint={lane} count={counter ? count : undefined} maxCount={counter ? maxLength : undefined}>
      {(ctl) => (
        <Control multiline size={size} invalid={ctl.invalid} disabled={disabled} readOnly={readOnly} className={className}>
          <textarea ref={ref} id={ctl.id} rows={rows} className="vui-control__input vui-textarea" style={{ resize: rz, minHeight: 0 }} disabled={disabled} readOnly={readOnly} maxLength={maxLength} value={value} defaultValue={defaultValue} aria-invalid={ctl.invalid || undefined} aria-describedby={ctl.describedBy} onBlur={handleBlur} onChange={handleChange} {...rest} />
        </Control>
      )}
    </Field>
  );
}
