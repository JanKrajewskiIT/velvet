import React from 'react';
import { cx } from '../primitives/cx.js';
import { ymd, addDays } from '../primitives/date.js';
const toDay = (s) => { if (s instanceof Date) return new Date(s.getFullYear(), s.getMonth(), s.getDate()); const [y, m, d] = String(s).slice(0, 10).split('-').map(Number); return new Date(y, m - 1, d); };
export const HEATMAP_COLORS = ['var(--bg-sunken)', 'var(--dv-seq-1)', 'var(--dv-seq-2)', 'var(--dv-seq-3)', 'var(--dv-seq-4)'];
export function Heatmap({ data = [], weeks = 20, end, weekStart = 1, locale = 'en', label = 'Activity', unit, format, colors = HEATMAP_COLORS, thresholds, cellMax = 16, showTotal = true, showLegend = true, onCellClick, className }) {
  const fmt = format || ((v) => v.toLocaleString(locale));
  const byDay = React.useMemo(() => { const m = new Map(); for (const p of data) { const k = ymd(toDay(p.date)); m.set(k, (m.get(k) || 0) + (Number(p.value) || 0)); } return m; }, [data]);
  const last = React.useMemo(() => { if (end) return toDay(end); let mx = null; for (const p of data) { const d = toDay(p.date); if (!mx || d > mx) mx = d; } return mx || toDay(new Date()); }, [data, end]);
  const offset = (last.getDay() - weekStart + 7) % 7;
  const start = addDays(last, -offset - (weeks - 1) * 7);
  const lastIdx = (weeks - 1) * 7 + offset;
  const cells = []; let total = 0, max = 0;
  for (let i = 0; i < weeks * 7; i++) { const d = addDays(start, i); const v = i > lastIdx ? 0 : byDay.get(ymd(d)) || 0; if (i <= lastIdx) { total += v; if (v > max) max = v; } cells.push({ i, d, v }); }
  const n = colors.length;
  const level = (v) => { if (v <= 0) return 0; if (thresholds) { let l = 1; for (const t of thresholds) if (v >= t) l++; return Math.min(n - 1, l); } return Math.max(1, Math.min(n - 1, Math.ceil((v / (max || 1)) * (n - 1)))); };
  const mFmt = new Intl.DateTimeFormat(locale, { month: 'short' });
  const wFmt = new Intl.DateTimeFormat(locale, { weekday: 'short' });
  const dFmt = new Intl.DateTimeFormat(locale, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
  const months = [];
  for (let w = 0; w < weeks; w++) { const d = addDays(start, w * 7); if (!w || d.getMonth() !== addDays(start, (w - 1) * 7).getMonth()) months.push({ w, label: mFmt.format(d) }); }
  if (months.length > 1 && months[1].w - months[0].w < 3) months.shift();
  const [hover, setHover] = React.useState(-1);
  const [focusI, setFocusI] = React.useState(-1);
  const fi = focusI < 0 || focusI > lastIdx ? lastIdx : focusI;
  const refs = React.useRef([]);
  const go = (i) => { i = Math.max(0, Math.min(lastIdx, i)); setFocusI(i); setHover(i); const el = refs.current[i]; el && el.focus(); };
  const onKey = (e, c) => {
    const k = e.key, step = { ArrowUp: -1, ArrowDown: 1, ArrowLeft: -7, ArrowRight: 7 }[k];
    if (step) { e.preventDefault(); go(c.i + step); } else if (k === 'Home') { e.preventDefault(); go(0); } else if (k === 'End') { e.preventDefault(); go(lastIdx); } else if (k === 'Escape') setHover(-1);
  };
  const say = (c) => dFmt.format(c.d) + ': ' + fmt(c.v) + (unit ? ' ' + unit : '');
  const cols = { gridTemplateColumns: 'repeat(' + weeks + ', minmax(0,1fr))' };
  const tipEl = hover >= 0 && refs.current[hover];
  const tc = hover >= 0 ? cells[hover] : null;
  return (
    <div className={cx('vui-chart', 'vui-heat-wrap', className)} role="group" aria-label={label}>
      {(showTotal || showLegend) && (
        <div className="vui-chart__bar-top">
          {showTotal ? <span className="vui-heat__total"><b>{fmt(total)}</b>{unit ? ' ' + unit : ''}<span> · {label}</span></span> : <span />}
          {showLegend && <span className="vui-heat__legend" aria-hidden="true"><span>Less</span>{colors.map((c, i) => <i key={i} style={{ background: c }} />)}<span>More</span></span>}
        </div>
      )}
      <div className="vui-heat" style={{ maxWidth: 'calc(' + weeks + ' * ' + (cellMax + 3) + 'px + 34px)' }} onMouseLeave={() => setHover(-1)}>
        <div className="vui-heat__months" style={cols} aria-hidden="true">{months.map((m) => <span key={m.w} style={{ gridColumn: m.w + 1 + ' / span ' + Math.min(3, weeks - m.w) }}>{m.label}</span>)}</div>
        <div className="vui-heat__days" aria-hidden="true">{[0, 1, 2, 3, 4, 5, 6].map((r) => <span key={r}>{r % 2 === 0 && r < 6 ? wFmt.format(addDays(start, r)) : ''}</span>)}</div>
        <div className="vui-heat__cells" style={cols}>
          {cells.map((c) => c.i > lastIdx
            ? <span key={c.i} className="vui-heat__cell vui-heat__cell--future" aria-hidden="true" />
            : <button key={c.i} ref={(el) => (refs.current[c.i] = el)} type="button" tabIndex={c.i === fi ? 0 : -1} className={cx('vui-heat__cell', onCellClick && 'vui-heat__cell--click', hover === c.i && 'vui-heat__cell--on')} style={{ background: colors[level(c.v)] }} aria-label={say(c)} onMouseEnter={() => setHover(c.i)} onFocus={() => { setFocusI(c.i); setHover(c.i); }} onBlur={() => setHover(-1)} onKeyDown={(e) => onKey(e, c)} onClick={onCellClick ? () => onCellClick({ date: ymd(c.d), value: c.v }) : undefined} />)}
          {tipEl && tc && (
            <div className="vui-chart__tip" style={{ left: tipEl.offsetLeft + tipEl.offsetWidth / 2, top: tipEl.offsetTop }} aria-hidden="true">
              <div className="vui-chart__tip-t">{dFmt.format(tc.d)}</div>
              <div className="vui-chart__tip-r"><i style={{ background: colors[level(tc.v)] }} />{unit || 'Value'}<b>{fmt(tc.v)}</b></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
