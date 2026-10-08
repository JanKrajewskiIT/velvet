import React from 'react';
import { Glyph } from '../primitives/Glyph.jsx';
import { Field } from '../primitives/Field.jsx';
import { Control } from '../primitives/Control.jsx';
import { Meter } from '../primitives/Meter.jsx';
const LABELS = ['Too weak', 'Weak', 'Fair', 'Good', 'Strong'];
export function passwordScore(v) {
  if (!v) return -1;
  let s = 0;
  if (v.length >= 8) s++;
  if (/[a-z]/.test(v) && /[A-Z]/.test(v)) s++;
  if (/\d/.test(v)) s++;
  if (/[^A-Za-z0-9]/.test(v)) s++;
  if (v.length >= 12) s++;
  if (v.length < 6) s = Math.min(s, 1);
  return Math.min(4, s);
}
export function PasswordInput({ label = 'Password', hint, error, optional, showStrength = false, size = 'md', disabled, id, value, defaultValue, onChange, className, ...rest }) {
  const autoId = React.useId();
  const fid = id || autoId;
  const [show, setShow] = React.useState(false);
  const [inner, setInner] = React.useState(defaultValue ?? '');
  const cur = value !== undefined ? value : inner;
  const score = showStrength ? passwordScore(cur) : -1;
  const msg = error || (score >= 0 ? LABELS[score] + (hint ? ' · ' + hint : '') : hint);
  return (
    <Field label={label} hint={score >= 0 && !error ? msg : hint} error={error} optional={optional} id={fid} reserveHint={showStrength}>
      {(ctl) => (<>
        <Control size={size} invalid={ctl.invalid} disabled={disabled} className={className} iconLeft="lock"
          end={<button type="button" className="vui-control__btn" aria-label={show ? 'Hide password' : 'Show password'} aria-pressed={show} disabled={disabled} onClick={() => setShow(!show)}><Glyph name={show ? 'eye-off' : 'eye'} /></button>}>
          <input id={ctl.id} type={show ? 'text' : 'password'} className="vui-control__input" disabled={disabled} value={cur} autoComplete="new-password" spellCheck={false}
            aria-invalid={ctl.invalid || undefined} aria-describedby={ctl.describedBy}
            onChange={(e) => { if (value === undefined) setInner(e.target.value); onChange && onChange(e); }} {...rest} />
        </Control>
        {showStrength && <Meter steps={4} value={score === 0 && cur ? 1 : Math.max(0, score)} max={4} size="sm" tone={score >= 3 ? 'success' : score === 2 ? 'warning' : 'danger'} />}
      </>)}
    </Field>
  );
}
