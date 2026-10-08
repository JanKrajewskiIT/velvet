import React from 'react';
import { cx } from '../primitives/cx.js';
import { Meter } from '../primitives/Meter.jsx';
export function Progress({ value = 0, max = 100, label, showValue = false, indeterminate = false, tone = 'brand', size = 'md', format, className }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const txt = format ? format(value, max) : Math.round(pct) + '%';
  return (
    <div className={cx('vui-progress', 'vui-progress--' + size, 'vui-progress--' + tone, indeterminate && 'vui-progress--indeterminate', className)}>
      {(label || showValue) && <div className="vui-progress__head">{label && <span className="vui-progress__label">{label}</span>}{showValue && !indeterminate && <span className="vui-progress__value">{txt}</span>}</div>}
      <Meter value={value} max={max} size={size} tone={tone === 'brand' ? undefined : tone} indeterminate={indeterminate} className="vui-progress__track"
        role="progressbar" aria-hidden={undefined} aria-label={typeof label === 'string' ? label : undefined} aria-valuemin={0} aria-valuemax={max} aria-valuenow={indeterminate ? undefined : value} aria-valuetext={indeterminate ? 'Loading' : txt} />
    </div>
  );
}
export function ProgressRing({ value = 0, max = 100, size = 48, stroke = 4, tone = 'brand', showValue = true, label, role = 'progressbar', className, children }) {
  const r = (size - stroke) / 2, C = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(1, value / max));
  return (
    <span className={cx('vui-ring', 'vui-progress--' + tone, className)} style={{ width: size, height: size }} role={role} aria-valuemin={role === 'img' ? undefined : 0} aria-valuemax={role === 'img' ? undefined : max} aria-valuenow={role === 'img' ? undefined : value} aria-label={label}>
      <svg viewBox={'0 0 ' + size + ' ' + size} aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={r} strokeWidth={stroke} className="vui-ring__track" />
        <circle cx={size / 2} cy={size / 2} r={r} strokeWidth={stroke} className="vui-ring__bar" style={{ strokeDasharray: C, strokeDashoffset: C * (1 - pct) }} />
      </svg>
      {children ?? (showValue && <span className="vui-ring__value" style={{ fontSize: Math.max(10, size * 0.24) }}>{Math.round(pct * 100)}<small>%</small></span>)}
    </span>
  );
}
