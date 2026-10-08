import React from 'react';
import { FieldLabel } from '../primitives/Field.jsx';
import { Separator } from '../primitives/Separator.jsx';
import { cx } from '../primitives/cx.js';
export function OtpInput({ length = 6, label, hint, error, value, defaultValue, onValueChange, onComplete, numeric = true, disabled, autoFocus, groupAt, id, className }) {
  const autoId = React.useId();
  const fid = id || autoId;
  const [inner, setInner] = React.useState((defaultValue ?? '').slice(0, length));
  const cur = (value !== undefined ? value : inner).slice(0, length);
  const refs = React.useRef([]);
  const split = groupAt ?? (length === 6 ? 3 : length === 8 ? 4 : 0);
  const re = numeric ? /^[0-9]$/ : /^[a-z0-9]$/i;
  const set = (v) => {
    if (value === undefined) setInner(v);
    onValueChange && onValueChange(v);
    if (v.length === length && !v.includes(' ')) onComplete && onComplete(v);
  };
  const focus = (i) => { const el = refs.current[Math.max(0, Math.min(length - 1, i))]; el && (el.focus(), el.select()); };
  const writeAt = (i, chars) => {
    const arr = cur.padEnd(length, ' ').split('');
    let j = i; for (const c of chars) { if (j >= length) break; arr[j++] = c; }
    set(arr.join('').replace(/\s+$/, ''));
    focus(j);
  };
  const onKey = (i, e) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      const arr = cur.padEnd(length, ' ').split('');
      if (arr[i] && arr[i] !== ' ') { arr[i] = ' '; set(arr.join('').replace(/\s+$/, '')); }
      else if (i > 0) { arr[i - 1] = ' '; set(arr.join('').replace(/\s+$/, '')); focus(i - 1); }
    } else if (e.key === 'ArrowLeft') { e.preventDefault(); focus(i - 1); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); focus(i + 1); }
  };
  const onInput = (i, e) => { const chars = e.target.value.split('').filter((c) => re.test(c)); if (chars.length) writeAt(i, numeric ? chars : chars.map((c) => c.toUpperCase())); };
  const onPaste = (i, e) => { e.preventDefault(); const chars = (e.clipboardData.getData('text') || '').split('').filter((c) => re.test(c)); if (chars.length) writeAt(i, numeric ? chars : chars.map((c) => c.toUpperCase())); };
  return (
    <div className="vui-field" role="group" aria-labelledby={label ? fid + '-label' : undefined}>
      {label && <FieldLabel id={fid + '-label'}>{label}</FieldLabel>}
      <div className={cx('vui-otp', className)}>
        {Array.from({ length }).map((_, i) => (
          <React.Fragment key={i}>
            {split > 0 && i === split && <Separator variant="dash" className="vui-otp__sep" />}
            <input ref={(el) => (refs.current[i] = el)} className={cx('vui-otp__cell', error && 'vui-otp__cell--invalid', cur[i] && cur[i] !== ' ' && 'vui-otp__cell--filled')}
              value={cur[i] && cur[i] !== ' ' ? cur[i] : ''} inputMode={numeric ? 'numeric' : 'text'} autoComplete={i === 0 ? 'one-time-code' : 'off'} maxLength={length} disabled={disabled}
              autoFocus={autoFocus && i === 0} aria-label={'Digit ' + (i + 1) + ' of ' + length} aria-invalid={!!error || undefined}
              onChange={(e) => onInput(i, e)} onKeyDown={(e) => onKey(i, e)} onPaste={(e) => onPaste(i, e)} onFocus={(e) => e.target.select()} />
          </React.Fragment>
        ))}
      </div>
      {(error || hint) && <span className={cx('vui-hint', error && 'vui-hint--error')} aria-live="polite">{error || hint}</span>}
    </div>
  );
}
