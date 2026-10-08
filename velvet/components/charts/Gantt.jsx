import React from 'react';
import { cx } from '../primitives/cx.js';
const DAY = 864e5;
const day = (x) => { const d = typeof x === 'string' && x.length === 10 ? new Date(x + 'T00:00:00') : new Date(x); d.setHours(0, 0, 0, 0); return d; };
const add = (d, n) => { const r = new Date(d); r.setDate(r.getDate() + n); return r; };
const diff = (a, b) => Math.round((b - a) / DAY);
const PX = { day: 36, week: 16, month: 5 };
export function Gantt({ tasks = [], scale = 'day', start, end, today = new Date(), labelWidth = 220, rowHeight = 40, height, showDependencies = true, onTaskClick, locale = 'en-US', label = 'Project timeline', className }) {
  const scroller = React.useRef(null);
  const T = tasks.map((t, i) => ({ ...t, key: t.id ?? i, s: day(t.start), e: day(t.end || t.start) }));
  const td = day(today);
  const r0 = start ? day(start) : T.length ? add(new Date(Math.min(...T.map((t) => +t.s))), -2) : add(td, -7);
  const r1 = end ? day(end) : T.length ? add(new Date(Math.max(...T.map((t) => +t.e))), 3) : add(td, 21);
  const n = diff(r0, r1) + 1, px = PX[scale] || 36, W = n * px;
  const x = (d) => diff(r0, d) * px;
  const days = Array.from({ length: n }, (_, k) => add(r0, k));
  const groups = [...new Set(T.map((t) => t.group).filter(Boolean))];
  const rows = []; let g;
  T.forEach((t) => { if (t.group && t.group !== g) { g = t.group; rows.push({ group: g }); } rows.push({ task: t }); });
  const rowOf = {}; rows.forEach((r, k) => { if (r.task) rowOf[r.task.key] = k; });
  const months = []; days.forEach((d, k) => { const m = d.getFullYear() * 12 + d.getMonth(); if (!months.length || months[months.length - 1].m !== m) months.push({ m, k, d }); });
  const mfmt = (d, i) => d.toLocaleDateString(locale, { month: px < 8 ? 'short' : 'long', ...(i === 0 || d.getMonth() === 0 ? { year: 'numeric' } : {}) });
  const dfmt = (d) => d.toLocaleDateString(locale, { month: 'short', day: 'numeric' });
  const color = (t) => t.color || 'var(--dv-' + ((t.group ? groups.indexOf(t.group) : 0) % 8 + 1) + ')';
  const tdx = td >= r0 && td <= r1 ? x(td) + px / 2 : null;
  React.useLayoutEffect(() => { const el = scroller.current; if (el && tdx != null) el.scrollLeft = Math.max(0, tdx - px * 4); }, []);
  const H = rows.length * rowHeight;
  const deps = [];
  if (showDependencies) T.forEach((t) => [].concat(t.dependsOn || []).forEach((id) => {
    const p = T.find((q) => q.key === id); if (!p) return;
    const x1 = x(p.e) + (p.milestone ? px / 2 + 7 : px), y1 = rowOf[p.key] * rowHeight + rowHeight / 2;
    const x2 = x(t.s) + (t.milestone ? px / 2 - 8 : 0), y2 = rowOf[t.key] * rowHeight + rowHeight / 2;
    const d = x2 - x1 >= 14 ? 'M' + x1 + ',' + y1 + 'H' + (x1 + 7) + 'V' + y2 + 'H' + (x2 - 1) : 'M' + x1 + ',' + y1 + 'h7V' + (y2 - rowHeight / 2) + 'H' + (x2 - 9) + 'V' + y2 + 'H' + (x2 - 1);
    deps.push(<path key={p.key + '-' + t.key} d={d} className="vui-gantt__dep" markerEnd="url(#vui-gantt-arrow)" />);
  }));
  return (
    <div className={cx('vui-gantt', 'vui-gantt--' + scale, className)} style={{ '--gantt-label': labelWidth + 'px', '--row': rowHeight + 'px' }} role="group" aria-label={label}>
      <div ref={scroller} className="vui-gantt__scroll" style={{ maxHeight: height }}>
        <div style={{ width: labelWidth + W }}>
          <div className="vui-gantt__head">
            <div className="vui-gantt__corner">Task</div>
            <div className="vui-gantt__scale" style={{ width: W }}>
              <div className="vui-gantt__months">{months.map((m, i) => <span key={m.m} className="vui-gantt__month" style={{ left: m.k * px, width: ((months[i + 1] ? months[i + 1].k : n) - m.k) * px }}>{mfmt(m.d, i)}</span>)}</div>
              {scale !== 'month' && (
                <div className="vui-gantt__units">{days.map((d, k) => {
                  if (scale === 'week' && d.getDay() !== 1) return null;
                  const we = d.getDay() === 0 || d.getDay() === 6;
                  return <span key={k} className={cx('vui-gantt__unit', scale === 'day' && we && 'vui-gantt__unit--we', scale === 'day' && +d === +td && 'vui-gantt__unit--today')} style={{ left: k * px, width: scale === 'week' ? 7 * px : px }}>{scale === 'week' ? dfmt(d) : d.getDate()}</span>;
                })}</div>
              )}
            </div>
          </div>
          <div className="vui-gantt__body">
            <div className="vui-gantt__labels">{rows.map((r, k) => r.group
              ? <div key={'g' + k} className="vui-gantt__label vui-gantt__label--group">{r.group}</div>
              : <div key={r.task.key} className="vui-gantt__label"><i style={{ background: color(r.task) }} /><span title={r.task.name}>{r.task.name}</span>{r.task.progress != null && !r.task.milestone && <small>{r.task.progress}%</small>}</div>)}</div>
            <div className="vui-gantt__canvas" style={{ width: W, height: H }}>
              {rows.map((r, k) => r.group && <span key={k} className="vui-gantt__grp" style={{ top: k * rowHeight, height: rowHeight }} />)}
              {scale === 'day' && days.map((d, k) => (d.getDay() === 0 || d.getDay() === 6) && <span key={k} className="vui-gantt__we" style={{ left: k * px, width: px }} />)}
              {months.slice(1).map((m) => <span key={m.m} className="vui-gantt__mline" style={{ left: m.k * px }} />)}
              {tdx != null && <span className="vui-gantt__today" style={{ left: tdx }} title="Today" />}
              <svg className="vui-gantt__deps" width={W} height={H} aria-hidden="true">
                <defs><marker id="vui-gantt-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0L8,4L0,8z" className="vui-gantt__arrow" /></marker></defs>
                {deps}
              </svg>
              {T.map((t) => {
                const top = rowOf[t.key] * rowHeight;
                const aria = t.name + ', ' + dfmt(t.s) + (t.milestone ? '' : ' – ' + dfmt(t.e)) + (t.progress != null && !t.milestone ? ', ' + t.progress + '% done' : '');
                if (t.milestone) return (
                  <button key={t.key} type="button" className="vui-gantt__ms" style={{ left: x(t.s) + px / 2, top: top + rowHeight / 2, '--c': color(t) }} aria-label={'Milestone: ' + aria} title={aria} onClick={() => onTaskClick && onTaskClick(t)}><span>{t.name}</span></button>
                );
                const w = (diff(t.s, t.e) + 1) * px;
                const out = w < Math.min(160, t.name.length * 7 + 20);
                return (
                  <button key={t.key} type="button" className={cx('vui-gantt__bar', out && 'vui-gantt__bar--out')} style={{ left: x(t.s) + 1, width: w - 2, top: top + (rowHeight - 24) / 2, '--c': color(t) }} aria-label={aria} title={aria} onClick={() => onTaskClick && onTaskClick(t)}>
                    {t.progress != null && <span className="vui-gantt__prog" style={{ width: Math.max(0, Math.min(100, t.progress)) + '%' }} />}
                    <span className="vui-gantt__name">{t.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
