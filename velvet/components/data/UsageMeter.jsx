import React from 'react';
import { Meter } from '../primitives/Meter.jsx';
import { cx } from '../primitives/cx.js';
export function UsageMeter({ label, value, max = 100, unit = '', valueText, hint, tone, thresholds = [0.7, 0.9], size = 'md', format, className, ...rest }) {
  const p = max ? value / max : 0;
  const auto = p >= thresholds[1] ? 'danger' : p >= thresholds[0] ? 'warning' : 'brand';
  const f = format || ((v) => (v == null ? '—' : String(v)));
  const txt = valueText != null ? valueText : f(value) + unit + ' / ' + f(max) + unit;
  return (
    <div className={cx('vui-usage', size === 'sm' && 'vui-usage--sm', className)} {...rest}>
      <div className="vui-usage__top"><span className="vui-usage__label">{label}</span><span className="vui-usage__val">{txt}</span></div>
      <Meter value={value ?? 0} max={max} tone={tone || auto} size={size === 'sm' ? 'sm' : 'md'} label={typeof label === 'string' ? label : undefined} />
      {hint && <span className="vui-usage__hint">{hint}</span>}
    </div>
  );
}
