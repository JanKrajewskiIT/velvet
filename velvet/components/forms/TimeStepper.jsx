import React from 'react';
import { Glyph } from '../primitives/Glyph.jsx';
import { pad } from '../primitives/date.js';
import { cx } from '../primitives/cx.js';
const parse = (t) => { const [h, m] = String(t || '00:00').split(':').map(Number); return [h || 0, m || 0]; };
export function TimeStepper({ value, defaultValue = '09:00', onChange: onChangeProp, onValueChange, hour12 = true, minuteStep = 5, label, size = 'md', disabled, className }) {
  const onChange = onChangeProp || onValueChange;
  const [inner, setInner] = React.useState(defaultValue);
  const cur = value ?? inner;
  const [h, m] = parse(cur);
  const set = (nh, nm) => { const v = pad((nh + 24) % 24) + ':' + pad((nm + 60) % 60); if (value === undefined) setInner(v); onChange && onChange(v); };
  const stepH = (d) => set(h + d, m);
  const stepM = (d) => { let nm = m + d * minuteStep; let nh = h; if (nm >= 60) { nm -= 60; nh++; } if (nm < 0) { nm += 60; nh--; } set(nh, nm); };
  const pm = h >= 12;
  const dispH = hour12 ? (h + 11) % 12 + 1 : h;
  const key = (fn) => (e) => { if (e.key === 'ArrowUp') { e.preventDefault(); fn(1); } else if (e.key === 'ArrowDown') { e.preventDefault(); fn(-1); } else if (e.key === 'PageUp') { e.preventDefault(); fn(5); } else if (e.key === 'PageDown') { e.preventDefault(); fn(-5); } };
  const col = ({ text, fn, name, now, max }) => (
    <div className="vui-tstep__col">
      <button type="button" tabIndex={-1} className="vui-tstep__arrow" aria-label={'Increase ' + name} disabled={disabled} onClick={() => fn(1)}><Glyph name="chevron-up" /></button>
      <div role="spinbutton" tabIndex={disabled ? -1 : 0} aria-label={name} aria-valuenow={now} aria-valuemin={0} aria-valuemax={max} aria-valuetext={text} className="vui-tstep__val" onKeyDown={key(fn)}
        onWheel={(e) => { if (!disabled && document.activeElement === e.currentTarget) fn(e.deltaY < 0 ? 1 : -1); }}>{text}</div>
      <button type="button" tabIndex={-1} className="vui-tstep__arrow" aria-label={'Decrease ' + name} disabled={disabled} onClick={() => fn(-1)}><Glyph name="chevron-down" /></button>
    </div>
  );
  return (
    <div role="group" aria-label={label || 'Time'} className={cx('vui-tstep', size !== 'md' && 'vui-tstep--' + size, disabled && 'vui-tstep--disabled', className)}>
      {col({ text: pad(dispH), fn: stepH, name: 'Hours', now: h, max: 23 })}
      <span className="vui-tstep__sep" aria-hidden="true">:</span>
      {col({ text: pad(m), fn: stepM, name: 'Minutes', now: m, max: 59 })}
      {hour12 && <button type="button" className="vui-tstep__ap" aria-label={'Switch to ' + (pm ? 'AM' : 'PM')} disabled={disabled} onClick={() => set(h + 12, m)}>{pm ? 'PM' : 'AM'}</button>}
    </div>
  );
}
