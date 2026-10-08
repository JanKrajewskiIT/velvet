import React from 'react';
import { Glyph } from '../primitives/Glyph.jsx';
import { compact } from './useSize.js';
import { cx } from '../primitives/cx.js';
const pc = (x) => (x < 10 ? x.toFixed(1) : Math.round(x)) + '%';
export function FunnelChart({ data = [], format = compact, color = 'var(--dv-1)', showConversion = true, relativeTo = 'previous', label = 'Funnel', className }) {
  const [hi, setHi] = React.useState(-1);
  const max = Math.max(1, ...data.map((d) => +d.value || 0));
  const first = data.length ? +data[0].value || 0 : 0;
  const step = Math.min(14, 56 / Math.max(1, data.length - 1));
  return (
    <div className={cx('vui-funnel', className)} role="list" aria-label={label}>
      {data.map((d, i) => {
        const v = +d.value || 0;
        const prev = i ? +data[i - 1].value || 0 : null;
        const base = relativeTo === 'first' ? first : prev;
        const conv = i && base ? (v / base) * 100 : null;
        const ofTotal = first ? (v / first) * 100 : 0;
        return (
          <React.Fragment key={d.label}>
            {showConversion && i > 0 && (
              <div className="vui-funnel__conv" aria-hidden="true"><span><b><Glyph name="arrow-down" />{pc(conv || 0)}</b><small>−{format(Math.max(0, prev - v))} drop-off</small></span></div>
            )}
            <div role="listitem" tabIndex={0} className={cx('vui-funnel__row', hi >= 0 && hi !== i && 'vui-funnel__row--dim')}
              aria-label={d.label + ': ' + format(v) + (i ? ', ' + pc(ofTotal) + ' of ' + data[0].label + (conv != null ? ', ' + pc(conv) + ' from ' + (relativeTo === 'first' ? data[0].label : data[i - 1].label) : '') : '')}
              onMouseEnter={() => setHi(i)} onMouseLeave={() => setHi(-1)} onFocus={() => setHi(i)} onBlur={() => setHi(-1)}>
              <span className="vui-funnel__label">{d.label}</span>
              <span className="vui-funnel__track">
                {prev != null && <span className="vui-funnel__ghost" style={{ width: (prev / max) * 100 + '%' }} />}
                <span className="vui-funnel__bar" style={{ width: Math.max(0.5, (v / max) * 100) + '%', background: 'color-mix(in oklab, ' + (d.color || color) + ' ' + (100 - i * step) + '%, var(--bg-raised))', animationDelay: i * 60 + 'ms' }} />
              </span>
              <span className="vui-funnel__val"><b>{format(v)}</b><small>{i ? pc(ofTotal) : '100%'}</small></span>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}
