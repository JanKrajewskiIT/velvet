import React from 'react';
import { cx } from '../primitives/cx.js';
export function ContributionBar({ items = [], max, unit = '', digits = 0, sort = false, labelWidth = 180, className, ...rest }) {
  const rows = sort ? [...items].sort((a, b) => Math.abs(b.value) - Math.abs(a.value)) : items;
  const m = max || Math.max(1, ...rows.map((r) => Math.abs(+r.value || 0)));
  const fmt = (v) => (v > 0 ? '+' : v < 0 ? '−' : '') + Math.abs(v).toFixed(digits) + unit;
  return (
    <div className={cx('vui-contrib', className)} role="list" style={{ '--contrib-label': typeof labelWidth === 'number' ? labelWidth + 'px' : labelWidth }} {...rest}>
      {rows.map((r, i) => {
        const v = +r.value || 0; const w = Math.min(50, (Math.abs(v) / m) * 50);
        return (
          <div key={i} className="vui-contrib__row" role="listitem" aria-label={r.label + ' ' + fmt(v)}>
            <span className="vui-contrib__l">{r.label}</span>
            <span className="vui-contrib__track" aria-hidden="true"><span className="vui-contrib__axis" /><span className="vui-contrib__bar" data-dir={v >= 0 ? 'up' : 'down'} style={v >= 0 ? { left: '50%', width: w + '%' } : { right: '50%', width: w + '%' }} /></span>
            <span className="vui-contrib__v" data-dir={v > 0 ? 'up' : v < 0 ? 'down' : 'flat'}>{fmt(v)}</span>
          </div>
        );
      })}
    </div>
  );
}
