import React from 'react';
import { FieldLabel } from '../primitives/Field.jsx';
import { cx } from '../primitives/cx.js';
export function Slider({ label, value, defaultValue, onValueChange, min = 0, max = 100, step = 1, format, showValue = true, showBounds = false, marks, snapToMarks = false, disabled, id, className }) {
  const autoId = React.useId();
  const fid = id || autoId;
  const init = defaultValue ?? (Array.isArray(value) ? value : min);
  const [inner, setInner] = React.useState(init);
  const cur = value !== undefined ? value : inner;
  const range = Array.isArray(cur);
  const vals = range ? cur : [cur];
  const track = React.useRef(null);
  const drag = React.useRef(-1);
  const fmt = format || ((v) => String(v));
  const pct = (v) => ((v - min) / (max - min)) * 100;
  const markList = marks === true ? Array.from({ length: Math.floor((max - min) / step) + 1 }, (_, i) => ({ value: min + i * step })) : Array.isArray(marks) ? marks.map((m) => (typeof m === 'number' ? { value: m } : m)) : [];
  const labelled = markList.some((m) => m.label != null) || marks === true;
  const snap = (v) => {
    if (snapToMarks && markList.length) return markList.reduce((b, m) => (Math.abs(m.value - v) < Math.abs(b - v) ? m.value : b), markList[0].value);
    const s = Math.round((v - min) / step) * step + min; return Math.min(max, Math.max(min, Number(s.toFixed(10))));
  };
  const stepTo = (v, dir) => { if (!(snapToMarks && markList.length)) return v; const cur = v; const sorted = markList.map((m) => m.value).sort((a, b) => a - b); return dir > 0 ? (sorted.find((x) => x > cur) ?? sorted[sorted.length - 1]) : ([...sorted].reverse().find((x) => x < cur) ?? sorted[0]); };
  const commit = (i, v) => {
    let next;
    if (range) { next = [...vals]; next[i] = i === 0 ? Math.min(snap(v), vals[1]) : Math.max(snap(v), vals[0]); }
    else next = snap(v);
    if ((range ? next[i] : next) === vals[i]) return;
    if (value === undefined) setInner(next);
    onValueChange && onValueChange(next);
  };
  const fromX = (x) => { const r = track.current.getBoundingClientRect(); return min + ((x - r.left) / r.width) * (max - min); };
  const down = (e) => {
    if (disabled || e.button !== 0) return;
    const v = fromX(e.clientX);
    const d0 = range ? Math.abs(v - vals[0]) : 0, d1 = range ? Math.abs(v - vals[1]) : 1;
    const i = !range ? 0 : d0 < d1 ? 0 : d1 < d0 ? 1 : v < vals[0] ? 0 : 1;
    drag.current = i; commit(i, v);
    track.current.setPointerCapture(e.pointerId);
    const th = track.current.querySelectorAll('[role="slider"]')[i]; th && th.focus();
  };
  const move = (e) => { if (drag.current >= 0) commit(drag.current, fromX(e.clientX)); };
  const up = () => { drag.current = -1; };
  const onKey = (i, e) => {
    const big = Math.max(step, (max - min) / 10);
    const map = { ArrowRight: step, ArrowUp: step, ArrowLeft: -step, ArrowDown: -step, PageUp: big, PageDown: -big };
    if (map[e.key] != null) { e.preventDefault(); commit(i, snapToMarks && markList.length ? stepTo(vals[i], map[e.key]) : vals[i] + map[e.key]); }
    else if (e.key === 'Home') { e.preventDefault(); commit(i, min); }
    else if (e.key === 'End') { e.preventDefault(); commit(i, max); }
  };
  const lo = range ? pct(vals[0]) : 0;
  const hi = pct(vals[vals.length - 1]);
  return (
    <div className={cx('vui-field', 'vui-slider', disabled && 'vui-slider--disabled', labelled && 'vui-slider--labelled', className)}>
      {(label || showValue) && (
        <div className="vui-slider__head">
          {label && <FieldLabel id={fid + '-label'}>{label}</FieldLabel>}
          {showValue && <span className="vui-slider__value">{range ? fmt(vals[0]) + ' – ' + fmt(vals[1]) : fmt(vals[0])}</span>}
        </div>
      )}
      <div ref={track} className="vui-slider__track" onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}>
        <span className="vui-slider__fill" style={{ left: lo + '%', width: hi - lo + '%' }} />
        {markList.map((m) => { const p = pct(m.value); const inside = p >= lo - 0.01 && p <= hi + 0.01; const on = vals.includes(m.value); return (
          <span key={'m' + m.value} className={cx('vui-slider__mark', inside && 'vui-slider__mark--in', on && 'vui-slider__mark--on')} style={{ left: p + '%' }} aria-hidden="true">
            {(m.label != null || marks === true) && <span className="vui-slider__mark-label">{m.label != null ? m.label : fmt(m.value)}</span>}
          </span>); })}
        {vals.map((v, i) => (
          <span key={i} role="slider" tabIndex={disabled ? -1 : 0} className="vui-slider__thumb" style={{ left: pct(v) + '%' }}
            aria-labelledby={label ? fid + '-label' : undefined} aria-label={range ? (i === 0 ? 'Minimum' : 'Maximum') : undefined}
            aria-valuemin={range && i === 1 ? vals[0] : min} aria-valuemax={range && i === 0 ? vals[1] : max} aria-valuenow={v} aria-valuetext={fmt(v)} aria-disabled={disabled || undefined}
            onKeyDown={(e) => onKey(i, e)} />
        ))}
      </div>
      {showBounds && <div className="vui-slider__bounds"><span>{fmt(min)}</span><span>{fmt(max)}</span></div>}
    </div>
  );
}
