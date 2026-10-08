import React from 'react';
import { Control } from '../primitives/Control.jsx';
import { FieldLabel, FieldHint } from '../primitives/Field.jsx';
import { Glyph } from '../primitives/Glyph.jsx';
import { cx } from '../primitives/cx.js';
const decimals = (n) => { const s = String(n); return s.includes('.') ? s.split('.')[1].length : 0; };
export function NumberInput({ label, hint, error, optional, value, defaultValue, onValueChange, min = -Infinity, max = Infinity, step = 1, suffix, size = 'md', disabled, id, className, ...rest }) {
  const autoId = React.useId();
  const fid = id || autoId;
  const hintId = fid + '-hint';
  const [inner, setInner] = React.useState(defaultValue ?? 0);
  const cur = value !== undefined ? value : inner;
  const [text, setText] = React.useState(String(cur));
  React.useEffect(() => { setText(String(cur)); }, [cur]);
  const dp = decimals(step);
  const clamp = (n) => Math.min(max, Math.max(min, Number(n.toFixed(dp))));
  React.useEffect(() => { if ((cur <= min || cur >= max) && hold.current) stop(); }, [cur]);
  const commit = (n) => { const v = clamp(n); if (value === undefined) setInner(v); onValueChange && onValueChange(v); setText(String(v)); };
  const curRef = React.useRef(cur); curRef.current = cur;
  const bump = (dir, mult = 1) => commit((Number(curRef.current) || 0) + dir * step * mult);
  const hold = React.useRef(null);
  const stop = () => { if (hold.current) { clearTimeout(hold.current.t); clearInterval(hold.current.i); hold.current = null; } };
  React.useEffect(() => stop, []);
  const press = (dir) => (e) => { if (e.button !== 0 || disabled) return; e.preventDefault(); stop(); bump(dir); hold.current = { t: setTimeout(() => { hold.current.i = setInterval(() => bump(dir), 60); }, 450) }; };
  const stepProps = (dir) => ({ onPointerDown: press(dir), onPointerUp: stop, onPointerLeave: stop, onPointerCancel: stop, onKeyDown: (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); bump(dir); } } });
  const onKey = (e) => {
    if (e.key === 'ArrowUp') { e.preventDefault(); bump(1, e.shiftKey ? 10 : 1); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); bump(-1, e.shiftKey ? 10 : 1); }
    else if (e.key === 'Home' && min > -Infinity) { e.preventDefault(); commit(min); }
    else if (e.key === 'End' && max < Infinity) { e.preventDefault(); commit(max); }
    else if (e.key === 'Enter') { const n = parseFloat(text.replace(',', '.')); commit(isNaN(n) ? cur : n); }
  };
  return (
    <div className="vui-field">
      {label && <FieldLabel htmlFor={fid} optional={optional}>{label}</FieldLabel>}
      <Control size={size} invalid={!!(error)} disabled={disabled} className={cx('vui-number', className)}>
        <button type="button" tabIndex={-1} className="vui-number__step" aria-label="Decrease" disabled={disabled || cur <= min} {...stepProps(-1)}><Glyph name="minus" /></button>
        <input id={fid} type="text" inputMode={dp ? 'decimal' : 'numeric'} role="spinbutton" aria-valuenow={cur} aria-valuemin={min > -Infinity ? min : undefined} aria-valuemax={max < Infinity ? max : undefined}
          aria-invalid={!!error || undefined} aria-describedby={error || hint ? hintId : undefined}
          className="vui-control__input vui-number__input" value={text} disabled={disabled}
          onChange={(e) => setText(e.target.value.replace(/[^\d.,-]/g, ''))} onBlur={() => { const n = parseFloat(text.replace(',', '.')); commit(isNaN(n) ? cur : n); }} onKeyDown={onKey} {...rest} />
        {suffix && <span className="vui-control__affix vui-control__affix--end" style={{ paddingLeft: 0 }}>{suffix}</span>}
        <button type="button" tabIndex={-1} className="vui-number__step" aria-label="Increase" disabled={disabled || cur >= max} {...stepProps(1)}><Glyph name="plus" /></button>
      </Control>
      {(error || hint) && <FieldHint id={hintId} error={!!error}>{error || hint}</FieldHint>}
    </div>
  );
}
