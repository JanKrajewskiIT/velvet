import React from 'react';
import { Glyph } from '../primitives/Glyph.jsx';
import { cx } from '../primitives/cx.js';
import { sameDay, startOfDay, addDays, addMonths, fmtDate, weekdayNames } from '../primitives/date.js';
import { Weekday } from '../primitives/Weekday.jsx';
import { IconButton } from '../actions/IconButton.jsx';
export { sameDay, startOfDay, addDays, addMonths, fmtDate };
const monthKey = (d) => d.getFullYear() * 12 + d.getMonth();
export function Calendar({ mode = 'single', value, defaultValue, onChange: onChangeProp, onValueChange, months = 1, month, defaultMonth, onMonthChange, min, max, isDisabled, marks, weekStartsOn = 1, locale = 'en-US', className }) {
  const onChange = onChangeProp || onValueChange;
  const [innerVal, setInnerVal] = React.useState(defaultValue ?? (mode === 'range' ? { start: null, end: null } : null));
  const val = value !== undefined ? value : innerVal;
  const anchor = mode === 'range' ? val && val.start : val;
  const [innerMonth, setInnerMonth] = React.useState(() => { const d = defaultMonth || anchor || new Date(); return new Date(d.getFullYear(), d.getMonth(), 1); });
  const view = month ? new Date(month.getFullYear(), month.getMonth(), 1) : innerMonth;
  const setView = (d) => { const m = new Date(d.getFullYear(), d.getMonth(), 1); if (!month) setInnerMonth(m); onMonthChange && onMonthChange(m); };
  const [focus, setFocus] = React.useState(() => startOfDay(anchor || new Date()));
  const [hover, setHover] = React.useState(null);
  const kb = React.useRef(false);
  const root = React.useRef(null);
  const today = startOfDay(new Date());
  const disabled = (d) => (min && d < startOfDay(min)) || (max && d > startOfDay(max)) || (isDisabled && isDisabled(d));
  const marked = (d) => (typeof marks === 'function' ? marks(d) : Array.isArray(marks) ? marks.some((m) => sameDay(m, d)) : false);
  React.useEffect(() => {
    if (!kb.current || !root.current) return;
    kb.current = false;
    const b = root.current.querySelector('[data-day="' + focus.toDateString() + '"]'); b && b.focus();
  }, [focus]);
  const commit = (v) => { if (value === undefined) setInnerVal(v); onChange && onChange(v); };
  const pick = (d) => {
    if (disabled(d)) return;
    setFocus(d);
    if (mode === 'range') {
      if (!val || !val.start || (val.start && val.end)) commit({ start: d, end: null });
      else commit(d < val.start ? { start: d, end: val.start } : { start: val.start, end: d });
    } else commit(d);
    if (monthKey(d) < monthKey(view) || monthKey(d) > monthKey(view) + months - 1) setView(d);
  };
  const onKey = (e) => {
    const map = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };
    let n = null;
    if (map[e.key] != null) n = addDays(focus, map[e.key]);
    else if (e.key === 'PageUp') n = new Date(focus.getFullYear(), focus.getMonth() - (e.shiftKey ? 12 : 1), focus.getDate());
    else if (e.key === 'PageDown') n = new Date(focus.getFullYear(), focus.getMonth() + (e.shiftKey ? 12 : 1), focus.getDate());
    else if (e.key === 'Home') n = addDays(focus, -((focus.getDay() - weekStartsOn + 7) % 7));
    else if (e.key === 'End') n = addDays(focus, 6 - ((focus.getDay() - weekStartsOn + 7) % 7));
    else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(focus); return; }
    if (!n) return;
    e.preventDefault(); kb.current = true; setFocus(n);
    if (monthKey(n) < monthKey(view)) setView(n); else if (monthKey(n) > monthKey(view) + months - 1) setView(addMonths(n, -(months - 1)));
  };
  const wd = weekdayNames(locale, weekStartsOn, 2);
  const rs = mode === 'range' && val ? val.start : null;
  const re = mode === 'range' && val ? (val.end || (val.start && hover && hover >= val.start ? hover : null)) : null;
  const focusVisible = monthKey(focus) >= monthKey(view) && monthKey(focus) <= monthKey(view) + months - 1;
  const grid = (m, mi) => {
    const first = addMonths(view, m);
    const off = (first.getDay() - weekStartsOn + 7) % 7;
    const start = addDays(first, -off);
    const days = Array.from({ length: 42 }).map((_, i) => addDays(start, i));
    return (
      <div key={m} className="vui-cal__month">
        <div className="vui-cal__head">
          {mi === 0 ? <IconButton size="sm" icon="chevron-left" label="Previous month" className="vui-cal__nav" onClick={() => setView(addMonths(view, -1))} /> : <span className="vui-cal__nav-sp" />}
          <span className="vui-cal__title" aria-live="polite">{fmtDate(first, locale, { month: 'long', year: 'numeric' })}</span>
          {mi === months - 1 ? <IconButton size="sm" icon="chevron-right" label="Next month" className="vui-cal__nav" onClick={() => setView(addMonths(view, 1))} /> : <span className="vui-cal__nav-sp" />}
        </div>
        <div role="grid" className="vui-cal__grid" aria-label={fmtDate(first, locale, { month: 'long', year: 'numeric' })}>
          {wd.map((w, i) => <Weekday key={i} className="vui-cal__wd" role="columnheader">{w}</Weekday>)}
          {days.map((d) => {
            const out = d.getMonth() !== first.getMonth();
            if (out && months > 1) return <span key={d.toISOString()} />;
            const sel = mode === 'range' ? sameDay(d, rs) || sameDay(d, re) : sameDay(d, val);
            const inR = rs && re && d > rs && d < re;
            const dis = disabled(d);
            const isFocus = focusVisible ? sameDay(d, focus) : !out && d.getDate() === 1;
            return (
              <button key={d.toISOString()} type="button" role="gridcell" data-day={d.toDateString()} tabIndex={isFocus ? 0 : -1} disabled={dis} aria-selected={sel || inR || undefined} aria-current={sameDay(d, today) ? 'date' : undefined}
                aria-label={fmtDate(d, locale, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                className={cx('vui-cal__day', out && 'vui-cal__day--out', sameDay(d, today) && 'vui-cal__day--today', sel && 'vui-cal__day--sel', inR && 'vui-cal__day--in', sameDay(d, rs) && re && 'vui-cal__day--start', sameDay(d, re) && rs && 'vui-cal__day--end')}
                onClick={() => pick(d)} onMouseEnter={() => mode === 'range' && setHover(d)} onFocus={() => setFocus(d)}>
                <span>{d.getDate()}</span>
                {marked(d) && <i className="vui-cal__mark" aria-hidden="true" />}
              </button>
            );
          })}
        </div>
      </div>
    );
  };
  return (
    <div ref={root} className={cx('vui-cal', months > 1 && 'vui-cal--multi', className)} onKeyDown={onKey} onMouseLeave={() => setHover(null)}>
      {Array.from({ length: months }).map((_, i) => grid(i, i))}
    </div>
  );
}
