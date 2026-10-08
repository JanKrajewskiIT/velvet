import React from 'react';
import { useWidth, niceTicks, compact } from './useSize.js';
import { cx } from '../primitives/cx.js';
export function BarChart({ data = [], series, height = 240, format = compact, stacked = false, label = 'Bar chart', showLegend, className }) {
  const [ref, W] = useWidth();
  const ser = series || [{ key: 'value', label: 'Value', color: 'var(--dv-1)' }];
  const [hover, setHover] = React.useState(-1);
  const pad = { l: 40, r: 8, t: 12, b: 28 };
  const iw = W - pad.l - pad.r, ih = height - pad.t - pad.b;
  const max = Math.max(1, ...data.map((d) => (stacked ? ser.reduce((s, k) => s + (+d[k.key] || 0), 0) : Math.max(...ser.map((k) => +d[k.key] || 0)))));
  const ticks = niceTicks(max); const top = ticks[ticks.length - 1];
  const y = (v) => pad.t + ih - (v / top) * ih;
  const band = iw / Math.max(1, data.length); const gw = Math.min(56, band * 0.64);
  const bw = stacked ? gw : gw / ser.length;
  const onKey = (e) => { if (e.key === 'ArrowRight') { e.preventDefault(); setHover((h) => Math.min(data.length - 1, h + 1)); } else if (e.key === 'ArrowLeft') { e.preventDefault(); setHover((h) => Math.max(0, h < 0 ? 0 : h - 1)); } else if (e.key === 'Escape') setHover(-1); };
  const tip = hover >= 0 && data[hover];
  const tx = hover >= 0 ? pad.l + band * hover + band / 2 : 0;
  return (
    <div ref={ref} className={cx('vui-chart', className)}>
      {(showLegend ?? ser.length > 1) && <div className="vui-chart__legend">{ser.map((s, i) => <span key={s.key} className="vui-chart__lg"><i style={{ background: s.color || 'var(--dv-' + (i + 1) + ')' }} />{s.label}</span>)}</div>}
      <div className="vui-chart__plot" style={{ height }}>
        <svg width={W} height={height} role="img" aria-label={label} tabIndex={0} onKeyDown={onKey} onFocus={() => hover < 0 && setHover(0)} onBlur={() => setHover(-1)} onMouseLeave={() => setHover(-1)}>
          {ticks.map((t) => <g key={t}><line x1={pad.l} x2={W - pad.r} y1={y(t)} y2={y(t)} className="vui-chart__grid" /><text x={pad.l - 8} y={y(t)} dy="0.32em" textAnchor="end" className="vui-chart__tick">{format(t)}</text></g>)}
          {data.map((d, i) => {
            const x0 = pad.l + band * i + (band - gw) / 2; let acc = 0;
            return (
              <g key={i} onMouseEnter={() => setHover(i)} className={cx('vui-chart__group', hover >= 0 && hover !== i && 'vui-chart__group--dim')}>
                <rect x={pad.l + band * i} y={pad.t} width={band} height={ih} fill="transparent" />
                {ser.map((s, k) => {
                  const v = +d[s.key] || 0; const h = (v / top) * ih;
                  const x = stacked ? x0 : x0 + k * bw; const yy = stacked ? y(acc + v) : y(v); acc += v;
                  return <rect key={s.key} x={x + (stacked ? 0 : 1)} y={yy} width={Math.max(1, bw - (stacked ? 0 : 2))} height={Math.max(0, h - (stacked && k ? 1 : 0))} rx={stacked ? (k === ser.length - 1 ? 4 : 0) : 4} className="vui-chart__bar" style={{ fill: s.color || 'var(--dv-' + (k + 1) + ')', animationDelay: i * 30 + 'ms' }} />;
                })}
                <text x={pad.l + band * i + band / 2} y={height - 8} textAnchor="middle" className={cx('vui-chart__tick', hover === i && 'vui-chart__tick--on')}>{d.label}</text>
              </g>
            );
          })}
        </svg>
        {tip && (
          <div className="vui-chart__tip" style={{ left: Math.max(70, Math.min(W - 70, tx)), top: pad.t }} role="status">
            <div className="vui-chart__tip-t">{tip.label}</div>
            {ser.map((s, k) => <div key={s.key} className="vui-chart__tip-r"><i style={{ background: s.color || 'var(--dv-' + (k + 1) + ')' }} />{s.label}<b>{format(+tip[s.key] || 0)}</b></div>)}
          </div>
        )}
      </div>
    </div>
  );
}
