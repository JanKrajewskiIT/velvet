import React from 'react';
import { cx } from '../primitives/cx.js';
export function DonutChart({ data = [], size = 180, thickness = 22, format = (v) => v.toLocaleString(), centerLabel = 'Total', label = 'Donut chart', className }) {
  const [off, setOff] = React.useState([]);
  const [hover, setHover] = React.useState(null);
  const items = data.map((d, i) => ({ ...d, color: d.color || 'var(--dv-' + ((i % 8) + 1) + ')' }));
  const vis = items.filter((d) => !off.includes(d.label));
  const total = vis.reduce((s, d) => s + d.value, 0);
  const r = (size - thickness) / 2, C = 2 * Math.PI * r;
  let acc = 0;
  const h = hover && vis.find((d) => d.label === hover);
  return (
    <div className={cx('vui-donut', className)}>
      <div className="vui-donut__ring" style={{ width: size, height: size }}>
        <svg viewBox={'0 0 ' + size + ' ' + size} role="img" aria-label={label + ': ' + vis.map((d) => d.label + ' ' + Math.round((d.value / (total || 1)) * 100) + '%').join(', ')}>
          <circle cx={size / 2} cy={size / 2} r={r} className="vui-donut__track" strokeWidth={thickness} />
          {vis.map((d) => { const len = total ? (d.value / total) * C : 0; const gap = vis.length > 1 ? Math.min(3, len / 3) : 0; const el = <circle key={d.label} cx={size / 2} cy={size / 2} r={r} strokeWidth={thickness} className={cx('vui-donut__seg', hover && hover !== d.label && 'vui-donut__seg--dim')} style={{ stroke: d.color, strokeDasharray: Math.max(0, len - gap) + ' ' + C, strokeDashoffset: -acc }} onMouseEnter={() => setHover(d.label)} onMouseLeave={() => setHover(null)} />; acc += len; return el; })}
        </svg>
        <div className="vui-donut__center" aria-hidden="true"><span className="vui-donut__value">{h ? Math.round((h.value / total) * 100) + '%' : format(total)}</span><span className="vui-donut__label">{h ? h.label : centerLabel}</span></div>
      </div>
      <ul className="vui-donut__legend">
        {items.map((d) => { const on = !off.includes(d.label); return (
          <li key={d.label}>
            <button type="button" aria-pressed={on} className={cx('vui-donut__item', !on && 'vui-donut__item--off')} onMouseEnter={() => on && setHover(d.label)} onMouseLeave={() => setHover(null)} onFocus={() => on && setHover(d.label)} onBlur={() => setHover(null)}
              onClick={() => setOff((o) => (on ? (vis.length > 1 ? [...o, d.label] : o) : o.filter((x) => x !== d.label)))}>
              <i style={{ background: d.color }} /><span className="vui-donut__name">{d.label}</span><span className="vui-donut__num">{format(d.value)}</span><span className="vui-donut__pct">{on && total ? Math.round((d.value / total) * 100) + '%' : '—'}</span>
            </button>
          </li>
        ); })}
      </ul>
    </div>
  );
}
