import React from 'react';
import { cx } from './cx.js';
export function Meter({ value = 0, max = 100, tone, size = 'md', steps, shimmer = false, rating = false, indeterminate = false, label, className, ...rest }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const a11y = label ? { role: 'meter', 'aria-label': label, 'aria-valuemin': 0, 'aria-valuemax': max, 'aria-valuenow': value } : { 'aria-hidden': true };
  const cls = cx('vui-meter', size !== 'md' && 'vui-meter--' + size, steps && 'vui-meter--segmented', shimmer && 'vui-meter--shimmer', rating && 'vui-meter--rating', indeterminate && 'vui-meter--indeterminate', className);
  if (steps) { const on = Math.round((pct / 100) * steps); return <span className={cls} data-tone={tone} {...a11y} {...rest}>{Array.from({ length: steps }, (_, i) => <span key={i} className={cx('vui-meter__seg', i < on && 'vui-meter__seg--on')} />)}</span>; }
  return <span className={cls} data-tone={tone} {...a11y} {...rest}><span className="vui-meter__fill" style={indeterminate ? undefined : { width: pct + '%' }} /></span>;
}
