import React from 'react';
import { Control } from '../primitives/Control.jsx';
import { FieldLabel, FieldHint } from '../primitives/Field.jsx';
import { Select } from './Select.jsx';
import { cx } from '../primitives/cx.js';
const isNum = (v) => typeof v === 'number' && isFinite(v);
function Bound({ value, onCommit, locale, min, max, size, disabled, invalid, placeholder, ariaLabel, prefix, suffix, describedBy, id }) {
  const fmt = (v) => (isNum(v) ? new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(v) : '');
  const [focus, setFocus] = React.useState(false);
  const [text, setText] = React.useState(fmt(value));
  React.useEffect(() => { if (!focus) setText(fmt(value)); }, [value, focus, locale]);
  const commit = () => {
    const raw = text.replace(/[\s\u00a0]/g, '').replace(',', '.');
    let n = raw === '' ? null : parseFloat(raw);
    if (n != null && isNaN(n)) n = value ?? null;
    if (isNum(n)) n = Math.min(max ?? Infinity, Math.max(min ?? -Infinity, n));
    setFocus(false); setText(fmt(n)); onCommit(n);
  };
  return (
    <Control size={size} disabled={disabled} invalid={invalid} prefix={prefix} suffix={suffix} className="vui-range__bound">
      <input id={id} className="vui-control__input" inputMode="decimal" value={text} placeholder={placeholder} aria-label={ariaLabel} aria-invalid={invalid || undefined} aria-describedby={describedBy} disabled={disabled}
        onFocus={() => { setFocus(true); setText(isNum(value) ? String(value) : ''); }} onBlur={commit}
        onChange={(e) => setText(e.target.value.replace(/[^\d.,\s-]/g, ''))} onKeyDown={(e) => { if (e.key === 'Enter') commit(); }} />
    </Control>
  );
}
export function RangeInput({ label, hint, error, optional, required, value, defaultValue = {}, onValueChange, min = 0, max, prefix, suffix, fromLabel = 'From', toLabel = 'To', invertedError = 'The lower bound is greater than the upper bound', unit, defaultUnit, unitOptions, onUnitChange, unitLabel = 'Currency', period, defaultPeriod, periodOptions, onPeriodChange, periodLabel = 'Period', locale, size = 'md', disabled, id, className }) {
  const autoId = React.useId();
  const fid = id || autoId;
  const [inner, setInner] = React.useState(defaultValue);
  const cur = value !== undefined ? value : inner;
  const [u, setU] = React.useState(defaultUnit ?? '');
  const [p, setP] = React.useState(defaultPeriod ?? '');
  const curU = unit !== undefined ? unit : u;
  const curP = period !== undefined ? period : p;
  const set = (k) => (n) => { const next = { ...cur, [k]: n }; if (value === undefined) setInner(next); onValueChange && onValueChange(next); };
  const inverted = isNum(cur.min) && isNum(cur.max) && cur.min > cur.max;
  const err = error || (inverted ? invertedError : null);
  const hintId = fid + '-hint';
  const shared = { locale, min, max, size, disabled, invalid: !!err, prefix, suffix, describedBy: err || hint ? hintId : undefined };
  return (
    <div className={cx('vui-field', 'vui-range', className)}>
      {label && <FieldLabel htmlFor={fid + '-min'} optional={optional} required={required}>{label}</FieldLabel>}
      <div className="vui-range__row" role="group" aria-label={typeof label === 'string' ? label : undefined}>
        <div className="vui-range__bounds">
          <Bound {...shared} id={fid + '-min'} value={cur.min} onCommit={set('min')} placeholder={fromLabel} ariaLabel={label ? undefined : fromLabel} />
          <span className="vui-range__sep" aria-hidden="true">–</span>
          <Bound {...shared} value={cur.max} onCommit={set('max')} placeholder={toLabel} ariaLabel={(typeof label === 'string' ? label + ', ' : '') + toLabel} />
        </div>
        {unitOptions && <Select className="vui-range__select" size={size} disabled={disabled} options={unitOptions} value={curU} placeholder={unitLabel} aria-label={unitLabel} onValueChange={(v) => { setU(v); onUnitChange && onUnitChange(v); }} />}
        {periodOptions && <Select className="vui-range__select vui-range__select--wide" size={size} disabled={disabled} options={periodOptions} value={curP} placeholder={periodLabel} aria-label={periodLabel} onValueChange={(v) => { setP(v); onPeriodChange && onPeriodChange(v); }} />}
      </div>
      {(err || hint) && <FieldHint id={hintId} error={!!err}>{err || hint}</FieldHint>}
    </div>
  );
}
