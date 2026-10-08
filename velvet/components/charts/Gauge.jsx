import React from 'react';
import { cx } from '../primitives/cx.js';
const TONE = { brand: 'var(--action-primary)', success: 'var(--status-success-solid)', warning: 'var(--status-warning-solid)', danger: 'var(--status-danger-solid)', info: 'var(--status-info-solid)', neutral: 'var(--status-neutral-solid)' };
const SZ = { sm: [136, 10], md: [188, 14], lg: [244, 18] };
export function Gauge({ value = 0, min = 0, max = 100, label, caption, format = (v) => String(Math.round(v)), unit, thresholds, tone = 'brand', size = 'md', showBounds = true, className }) {
  const [w, sw] = SZ[size] || SZ.md;
  const r = (w - sw) / 2, cx0 = w / 2, cy = r + sw / 2, h = cy + sw / 2;
  const v = Math.max(min, Math.min(max, +value || 0));
  const p = (v - min) / (max - min || 1);
  const th = (thresholds || []).slice().sort((a, b) => a.value - b.value);
  let t = tone; th.forEach((x) => { if (v >= x.value) t = x.tone; });
  const col = TONE[t] || t;
  const arc = 'M' + sw / 2 + ',' + cy + ' A' + r + ',' + r + ' 0 0 1 ' + (w - sw / 2) + ',' + cy;
  const pt = (q, rr) => { const a = Math.PI * (1 - q); return [cx0 + rr * Math.cos(a), cy - rr * Math.sin(a)]; };
  const vt = format(v) + (unit ? ' ' + unit : '');
  return (
    <div className={cx('vui-gauge', 'vui-gauge--' + size, className)} role="meter" aria-valuemin={min} aria-valuemax={max} aria-valuenow={v} aria-valuetext={vt} aria-label={typeof label === 'string' ? label : undefined}>
      <div className="vui-gauge__dial" style={{ width: w, height: h }}>
        <svg width={w} height={h} viewBox={'0 0 ' + w + ' ' + h} aria-hidden="true">
          <path d={arc} className="vui-gauge__track" strokeWidth={sw} />
          <path d={arc} className="vui-gauge__fill" strokeWidth={sw} pathLength="100" style={{ stroke: col, strokeDasharray: (p * 100).toFixed(2) + ' 100' }} />
          {th.map((x, i) => { const q = (x.value - min) / (max - min || 1); const [x1, y1] = pt(q, r - sw / 2 - 3); const [x2, y2] = pt(q, r - sw / 2 - 8); return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} className="vui-gauge__tick" style={{ stroke: TONE[x.tone] || x.tone }} />; })}
        </svg>
        <div className="vui-gauge__value"><b>{format(v)}</b>{unit && <span>{unit}</span>}</div>
      </div>
      {showBounds && <div className="vui-gauge__bounds" style={{ width: w }}><span>{format(min)}</span><span>{format(max)}</span></div>}
      {(label || caption) && <div className="vui-gauge__text">{label && <div className="vui-gauge__label">{label}</div>}{caption && <div className="vui-gauge__caption">{caption}</div>}</div>}
    </div>
  );
}
