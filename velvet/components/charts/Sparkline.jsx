import React from 'react';
import { useWidth } from './useSize.js';
import { cx } from '../primitives/cx.js';
export function Sparkline({ data = [], height = 40, color = 'var(--dv-1)', area = true, format = (v) => String(v), labels, label = 'Trend', className }) {
  const [ref, W] = useWidth(160);
  const [i, setI] = React.useState(-1);
  const gid = React.useId().replace(/:/g, '');
  const mn = Math.min(...data), mx = Math.max(...data), rng = mx - mn || 1;
  const x = (k) => 2 + (k / Math.max(1, data.length - 1)) * (W - 4);
  const y = (v) => 3 + (1 - (v - mn) / rng) * (height - 6);
  const d = data.map((v, k) => (k ? 'L' : 'M') + x(k).toFixed(1) + ',' + y(v).toFixed(1)).join('');
  const cur = i >= 0 ? i : data.length - 1;
  const onKey = (e) => { if (e.key === 'ArrowRight') { e.preventDefault(); setI(Math.min(data.length - 1, cur + 1)); } else if (e.key === 'ArrowLeft') { e.preventDefault(); setI(Math.max(0, cur - 1)); } else if (e.key === 'Escape') setI(-1); };
  return (
    <div ref={ref} className={cx('vui-spark', className)}>
      <svg width={W} height={height} role="img" tabIndex={0} aria-label={label + ': ' + (labels ? labels[cur] + ' ' : '') + format(data[cur])} onMouseMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); setI(Math.max(0, Math.min(data.length - 1, Math.round(((e.clientX - r.left) / r.width) * (data.length - 1))))); }} onMouseLeave={() => setI(-1)} onKeyDown={onKey} onBlur={() => setI(-1)}>
        <defs><linearGradient id={gid} x1="0" x2="0" y1="0" y2="1"><stop offset="0" style={{ stopColor: color, stopOpacity: 0.25 }} /><stop offset="1" style={{ stopColor: color, stopOpacity: 0 }} /></linearGradient></defs>
        {area && <path d={d + 'L' + x(data.length - 1) + ',' + height + 'L' + x(0) + ',' + height + 'Z'} fill={'url(#' + gid + ')'} />}
        <path d={d} fill="none" style={{ stroke: color }} strokeWidth="1.75" strokeLinejoin="round" strokeLinecap="round" />
        {i >= 0 && <line x1={x(i)} x2={x(i)} y1="0" y2={height} className="vui-chart__cross" />}
        <circle cx={x(cur)} cy={y(data[cur])} r="3" style={{ fill: color }} stroke="var(--bg-raised)" strokeWidth="1.5" />
      </svg>
      {i >= 0 && <span className="vui-spark__val">{labels ? <span>{labels[i]}</span> : null}{format(data[i])}</span>}
    </div>
  );
}
