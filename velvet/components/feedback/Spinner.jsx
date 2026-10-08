import React from 'react';
import { cx } from '../primitives/cx.js';
export function Spinner({ variant = 'ring', size = 'md', label = 'Loading', tone = 'brand', className }) {
  return (
    <span role="status" aria-label={label} className={cx('vui-loader', 'vui-loader--' + variant, 'vui-loader--' + size, tone === 'current' && 'vui-loader--current', className)}>
      {variant === 'dots' ? <><i /><i /><i /></> : variant === 'bars' ? <><i /><i /><i /><i /></> : variant === 'pulse' ? <i /> : null}
    </span>
  );
}
export function LoadingOverlay({ show = true, label = 'Loading…', children, className }) {
  return (
    <div className={cx('vui-loading-overlay', className)} aria-busy={show || undefined}>
      {children}
      {show && <div className="vui-loading-overlay__veil"><Spinner size="lg" label={label} /><span className="vui-loading-overlay__label">{label}</span></div>}
    </div>
  );
}
