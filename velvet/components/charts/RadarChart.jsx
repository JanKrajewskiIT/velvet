import React from 'react';
import { cx } from '../primitives/cx.js';
export function RadarChart({ axes = [], series = [], size = 300, levels = 4, max, format = (v) => v.toLocaleString(), showLegend = true, fill = true, label = 'Radar chart', className }) {
  const [off, setOff] = React.useState([]);
  const [hover, setHover] = React.useState(null);
  const items = series.map((s, i) => ({ ...s, color: s.color || 'var(--dv-' + ((i % 8) + 1) + ')' }));
  const vis = items.filter((s) => !off.includes(s.label));
  const pad = 56, cx0 = size / 2, cy0 = size / 2, R = size / 2 - pad;
  const n = Math.max(axes.length, 3);
  const val = (s, k) => { const v = +s.values[k]; return Number.isFinite(v) ? Math.max(0, v) : 0; };
  const top = (a) => a.max ?? max ?? Math.max(1, ...items.map((s) => val(s, a.key)));
  const ang = (i) => -Math.PI / 2 + (i * 2 * Math.PI) / n;
  const pt = (i, r) => [cx0 + Math.cos(ang(i)) * r, cy0 + Math.sin(ang(i)) * r];
  const ring = (f) => axes.map((_, i) => pt(i, R * f).join(',')).join(' ');
  const desc = vis.map((s) => s.label + ': ' + axes.map((a) => a.label + ' ' + format(val(s, a.key))).join(', ')).join('; ');
  return (
    <div className={cx('vui-chart', 'vui-radar', className)}>
      {showLegend && items.length > 1 && (
        <div className="vui-chart__legend">
          {items.map((s) => <button key={s.label} type="button" className={cx('vui-chart__lg', 'vui-radar__lg', off.includes(s.label) && 'vui-radar__lg--off')} aria-pressed={!off.includes(s.label)} onClick={() => setOff((o) => (o.includes(s.label) ? o.filter((x) => x !== s.label) : vis.length > 1 ? [...o, s.label] : o))}><i style={{ background: s.color }} />{s.label}</button>)}
        </div>
      )}
      <div className="vui-chart__plot" style={{ width: size, maxWidth: '100%' }}>
        <svg viewBox={'0 0 ' + size + ' ' + size} width="100%" role="img" aria-label={label + '. ' + desc}>
          {Array.from({ length: levels }, (_, k) => <polygon key={k} points={ring((k + 1) / levels)} className="vui-radar__ring" />)}
          {axes.map((a, i) => { const [x, y] = pt(i, R); return <line key={a.key} x1={cx0} y1={cy0} x2={x} y2={y} className="vui-chart__grid" />; })}
          {axes.map((a, i) => {
            const [x, y] = pt(i, R + 16); const c = Math.cos(ang(i));
            return <text key={a.key} x={x} y={y} className={cx('vui-chart__tick', 'vui-radar__axis', hover && hover.axis === a.key && 'vui-chart__tick--on')} textAnchor={Math.abs(c) < 0.2 ? 'middle' : c > 0 ? 'start' : 'end'} dominantBaseline="middle">{a.label}</text>;
          })}
          {vis.map((s, si) => {
            const pts = axes.map((a, i) => pt(i, R * Math.min(1, val(s, a.key) / top(a))));
            const dim = hover && hover.series !== s.label;
            return (
              <g key={s.label} className={cx('vui-radar__series', dim && 'vui-radar__series--dim')} style={{ '--c': s.color, animationDelay: si * 80 + 'ms' }}>
                <polygon points={pts.map((p) => p.join(',')).join(' ')} className="vui-radar__area" fillOpacity={fill ? undefined : 0} />
                {pts.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={hover && hover.series === s.label && hover.axis === axes[i].key ? 5 : 3.5} className="vui-radar__pt" onMouseEnter={() => setHover({ series: s.label, axis: axes[i].key, x, y, v: val(s, axes[i].key), color: s.color })} onMouseLeave={() => setHover(null)} />)}
              </g>
            );
          })}
        </svg>
        {hover && (
          <div className="vui-chart__tip vui-radar__tip" style={{ left: (hover.x / size) * 100 + '%', top: (hover.y / size) * 100 + '%' }}>
            <span className="vui-radar__tip-k"><i style={{ background: hover.color }} />{hover.series}</span>
            <span>{(axes.find((a) => a.key === hover.axis) || {}).label}<strong>{format(hover.v)}</strong></span>
          </div>
        )}
      </div>
    </div>
  );
}
