import React from 'react';
import { cx } from '../primitives/cx.js';
export function MetricGroup({ items = [], columns, minWidth = 120, size = 'md', variant = 'plain', className, ...rest }) {
  const style = columns ? { gridTemplateColumns: 'repeat(' + columns + ', minmax(0, 1fr))' } : { gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, ' + minWidth + 'px), 1fr))' };
  return (
    <dl className={cx('vui-metrics', 'vui-metrics--' + size, variant === 'subtle' && 'vui-metrics--subtle', className)} style={style} {...rest}>
      {items.map((it, i) => (
        <div key={i} className="vui-metrics__it">
          <dd className="vui-metrics__v" data-dir={it.dir}>{it.value}</dd>
          <dt className="vui-metrics__l">{it.label}</dt>
        </div>
      ))}
    </dl>
  );
}
