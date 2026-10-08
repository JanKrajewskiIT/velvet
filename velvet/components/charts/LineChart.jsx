import React from 'react';
import { Button } from '../actions/Button.jsx';
import { Glyph } from '../primitives/Glyph.jsx';
import { useWidth, niceTicks, compact } from './useSize.js';
import { cx } from '../primitives/cx.js';
const path = (pts) => pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ',' + p[1].toFixed(1)).join('');
const smooth = (pts) => { if (pts.length < 3) return path(pts); let d = 'M' + pts[0][0] + ',' + pts[0][1]; for (let i = 0; i < pts.length - 1; i++) { const [x0, y0] = pts[i], [x1, y1] = pts[i + 1]; const mx = (x0 + x1) / 2; d += 'C' + mx + ',' + y0 + ' ' + mx + ',' + y1 + ' ' + x1 + ',' + y1; } return d; };
export function LineChart({ data = [], series, height = 240, format = compact, area = true, curved = true, showTable = false, label = 'Line chart', className }) {
  const [ref, W] = useWidth();
  const ser = series || [{ key: 'value', label: 'Value' }];
  const [hover, setHover] = React.useState(-1);
  const [table, setTable] = React.useState(showTable);
  const gid = React.useId().replace(/:/g, '');
  const pad = { l: 40, r: 12, t: 12, b: 28 };
  const iw = W - pad.l - pad.r, ih = height - pad.t - pad.b;
  const max = Math.max(1, ...data.flatMap((d) => ser.map((s) => +d[s.key] || 0)));
  const ticks = niceTicks(max); const top = ticks[ticks.length - 1];
  const x = (i) => pad.l + (data.length < 2 ? iw / 2 : (i / (data.length - 1)) * iw);
  const y = (v) => pad.t + ih - (v / top) * ih;
  const every = Math.ceil(data.length / Math.max(2, Math.floor(iw / 64)));
  const onMove = (e) => { const r = e.currentTarget.getBoundingClientRect(); const px = e.clientX - r.left; const i = Math.round(((px - pad.l) / iw) * (data.length - 1)); setHover(Math.max(0, Math.min(data.length - 1, i))); };
  const onKey = (e) => { if (e.key === 'ArrowRight') { e.preventDefault(); setHover((h) => Math.min(data.length - 1, h + 1)); } else if (e.key === 'ArrowLeft') { e.preventDefault(); setHover((h) => Math.max(0, h - 1)); } else if (e.key === 'Home') { e.preventDefault(); setHover(0); } else if (e.key === 'End') { e.preventDefault(); setHover(data.length - 1); } else if (e.key === 'Escape') setHover(-1); };
  const tip = hover >= 0 && data[hover];
  const col = (k) => ser[k].color || 'var(--dv-' + (k + 1) + ')';
  return (
    <div ref={ref} className={cx('vui-chart', className)}>
      <div className="vui-chart__bar-top">
        {ser.length > 1 ? <div className="vui-chart__legend">{ser.map((s, k) => <span key={s.key} className="vui-chart__lg"><i style={{ background: col(k) }} />{s.label}</span>)}</div> : <span />}
        <Button variant="ghost" size="sm" iconLeft={(table ? 'bar-chart' : 'list')} aria-pressed={table} onClick={() => setTable(!table)}>{table ? 'Chart' : 'Table'}</Button>
      </div>
      {!table ? (
        <div className="vui-chart__plot" style={{ height }}>
          <svg width={W} height={height} role="img" aria-label={label + '. Use arrow keys to read values.'} tabIndex={0} onMouseMove={onMove} onMouseLeave={() => setHover(-1)} onKeyDown={onKey} onFocus={() => hover < 0 && setHover(data.length - 1)} onBlur={() => setHover(-1)}>
            <defs>{ser.map((s, k) => <linearGradient key={k} id={gid + k} x1="0" x2="0" y1="0" y2="1"><stop offset="0" style={{ stopColor: col(k), stopOpacity: 0.22 }} /><stop offset="1" style={{ stopColor: col(k), stopOpacity: 0 }} /></linearGradient>)}</defs>
            {ticks.map((t) => <g key={t}><line x1={pad.l} x2={W - pad.r} y1={y(t)} y2={y(t)} className="vui-chart__grid" /><text x={pad.l - 8} y={y(t)} dy="0.32em" textAnchor="end" className="vui-chart__tick">{format(t)}</text></g>)}
            {data.map((d, i) => i % every === 0 && <text key={i} x={x(i)} y={height - 8} textAnchor="middle" className={cx('vui-chart__tick', hover === i && 'vui-chart__tick--on')}>{d.label}</text>)}
            {ser.map((s, k) => {
              const pts = data.map((d, i) => [x(i), y(+d[s.key] || 0)]);
              const line = curved ? smooth(pts) : path(pts);
              return (
                <g key={s.key}>
                  {area && k === 0 && pts.length > 1 && <path d={line + 'L' + pts[pts.length - 1][0] + ',' + (pad.t + ih) + 'L' + pts[0][0] + ',' + (pad.t + ih) + 'Z'} fill={'url(#' + gid + k + ')'} className="vui-chart__area" />}
                  <path d={line} className="vui-chart__line" style={{ stroke: col(k) }} pathLength="1" />
                </g>
              );
            })}
            {hover >= 0 && <line x1={x(hover)} x2={x(hover)} y1={pad.t} y2={pad.t + ih} className="vui-chart__cross" />}
            {hover >= 0 && ser.map((s, k) => <circle key={s.key} cx={x(hover)} cy={y(+data[hover][s.key] || 0)} r="4.5" className="vui-chart__pt" style={{ stroke: col(k) }} />)}
          </svg>
          {tip && (
            <div className="vui-chart__tip" style={{ left: Math.max(70, Math.min(W - 70, x(hover))), top: pad.t }} role="status" aria-live="polite">
              <div className="vui-chart__tip-t">{tip.label}</div>
              {ser.map((s, k) => <div key={s.key} className="vui-chart__tip-r"><i style={{ background: col(k) }} />{s.label}<b>{format(+tip[s.key] || 0)}</b></div>)}
            </div>
          )}
        </div>
      ) : (
        <div className="vui-chart__table">
          <table className="vui-table"><thead><tr><th>Period</th>{ser.map((s) => <th key={s.key} className="vui-table__num">{s.label}</th>)}{ser.length === 1 && <th className="vui-table__num">Δ</th>}</tr></thead>
            <tbody>{data.map((d, i) => { const v = +d[ser[0].key] || 0, p = i ? +data[i - 1][ser[0].key] || 0 : null; const dl = p ? ((v - p) / p) * 100 : null; return <tr key={i}><td>{d.label}</td>{ser.map((s) => <td key={s.key} className="vui-table__num">{format(+d[s.key] || 0)}</td>)}{ser.length === 1 && <td className="vui-table__num" style={{ color: dl == null ? 'var(--fg-tertiary)' : dl >= 0 ? 'var(--status-success-fg)' : 'var(--status-danger-fg)' }}>{dl == null ? '—' : (dl >= 0 ? '+' : '') + dl.toFixed(1) + '%'}</td>}</tr>; })}</tbody>
          </table>
        </div>
      )}
    </div>
  );
}
