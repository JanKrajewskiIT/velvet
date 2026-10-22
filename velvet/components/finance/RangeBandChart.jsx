import React from 'react';
import { useWidth, niceRange, compact } from '../charts/useSize.js';
import { cx } from '../primitives/cx.js';
export function RangeBandChart({ data = [], loKey = 'lo', hiKey = 'hi', midKey = 'mid', valueKey = 'value', bandLabel = 'Expected range', midLabel = 'Median', valueLabel = 'Actual', height = 260, format = compact, label = 'Range band chart', className }) {
  const [ref, W] = useWidth();
  const [hover, setHover] = React.useState(-1);
  const pad = { l: 44, r: 12, t: 12, b: 28 };
  const iw = Math.max(10, W - pad.l - pad.r), ih = height - pad.t - pad.b;
  const vals = data.flatMap((d) => [d[loKey], d[hiKey], d[midKey], d[valueKey]]).filter((v) => v != null && !Number.isNaN(+v)).map(Number);
  const ticks = niceRange(Math.min(0, ...vals), Math.max(0, ...vals));
  const lo = ticks[0], hi = ticks[ticks.length - 1];
  const x = (i) => pad.l + (data.length < 2 ? iw / 2 : (i / (data.length - 1)) * iw);
  const y = (v) => pad.t + ih - ((v - lo) / (hi - lo || 1)) * ih;
  const line = (k) => data.map((d, i) => d[k] == null ? null : [x(i), y(+d[k])]).filter(Boolean).map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ',' + p[1].toFixed(1)).join('');
  const band = data.length > 1 ? data.map((d, i) => (i ? 'L' : 'M') + x(i).toFixed(1) + ',' + y(+d[hiKey]).toFixed(1)).join('') + data.slice().reverse().map((d, j) => 'L' + x(data.length - 1 - j).toFixed(1) + ',' + y(+d[loKey]).toFixed(1)).join('') + 'Z' : '';
  const every = Math.ceil(data.length / Math.max(2, Math.floor(iw / 64)));
  const outs = data.map((d, i) => d[valueKey] != null && (+d[valueKey] < +d[loKey] || +d[valueKey] > +d[hiKey]) ? i : -1).filter((i) => i >= 0);
  const onMove = (e) => { const r = e.currentTarget.getBoundingClientRect(); const i = Math.round(((e.clientX - r.left - pad.l) / iw) * (data.length - 1)); setHover(Math.max(0, Math.min(data.length - 1, i))); };
  const onKey = (e) => { if (e.key === 'ArrowRight') { e.preventDefault(); setHover((h) => Math.min(data.length - 1, h + 1)); } else if (e.key === 'ArrowLeft') { e.preventDefault(); setHover((h) => Math.max(0, h - 1)); } else if (e.key === 'Escape') setHover(-1); };
  const tip = hover >= 0 && data[hover];
  return (
    <div ref={ref} className={cx('vui-chart', 'vui-band', className)}>
      <div className="vui-chart__bar-top"><div className="vui-chart__legend">
        <span className="vui-chart__lg"><span className="vui-band__sw" />{bandLabel}</span>
        <span className="vui-chart__lg"><i style={{ background: 'var(--market-median)' }} />{midLabel}</span>
        <span className="vui-chart__lg"><i style={{ background: 'var(--dv-1)' }} />{valueLabel}</span>
        {outs.length > 0 && <span className="vui-chart__lg"><i style={{ background: 'var(--market-down-solid)', borderRadius: 99 }} />{outs.length} outside range</span>}
      </div><span /></div>
      <div className="vui-chart__plot" style={{ height }}>
        <svg width={W} height={height} role="img" aria-label={label + '. ' + outs.length + ' points outside the expected range. Use arrow keys to read values.'} tabIndex={0} onMouseMove={onMove} onMouseLeave={() => setHover(-1)} onKeyDown={onKey} onFocus={() => hover < 0 && setHover(data.length - 1)} onBlur={() => setHover(-1)}>
          {ticks.map((t) => <g key={t}><line x1={pad.l} x2={W - pad.r} y1={y(t)} y2={y(t)} className={t === 0 ? 'vui-band__zero' : 'vui-chart__grid'} /><text x={pad.l - 8} y={y(t)} dy="0.32em" textAnchor="end" className="vui-chart__tick">{format(t)}</text></g>)}
          {data.map((d, i) => i % every === 0 && <text key={i} x={x(i)} y={height - 8} textAnchor="middle" className={cx('vui-chart__tick', hover === i && 'vui-chart__tick--on')}>{d.label}</text>)}
          <path d={band} className="vui-band__band" />
          <path d={line(hiKey)} className="vui-band__edge" /><path d={line(loKey)} className="vui-band__edge" />
          <path d={line(midKey)} className="vui-band__mid" />
          <path d={line(valueKey)} className="vui-band__val" />
          {outs.map((i) => <circle key={i} cx={x(i)} cy={y(+data[i][valueKey])} r="3.5" className="vui-band__out" />)}
          {hover >= 0 && <line x1={x(hover)} x2={x(hover)} y1={pad.t} y2={pad.t + ih} className="vui-chart__cross" />}
        </svg>
        {tip && (
          <div className="vui-chart__tip" style={{ left: Math.max(80, Math.min(W - 80, x(hover))), top: pad.t }} role="status" aria-live="polite">
            <div className="vui-chart__tip-t">{tip.label}</div>
            <div className="vui-chart__tip-r"><i style={{ background: 'var(--dv-1)' }} />{valueLabel}<b>{tip[valueKey] == null ? '—' : format(+tip[valueKey])}</b></div>
            <div className="vui-chart__tip-r"><i style={{ background: 'var(--market-median)' }} />{midLabel}<b>{format(+tip[midKey])}</b></div>
            <div className="vui-chart__tip-r"><span className="vui-band__sw" />{bandLabel}<b>{format(+tip[loKey]) + ' … ' + format(+tip[hiKey])}</b></div>
          </div>
        )}
      </div>
    </div>
  );
}
