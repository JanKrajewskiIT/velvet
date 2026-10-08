import React from 'react';
import { cx } from '../primitives/cx.js';
export function Skeleton({ width, height = 12, circle = false, radius, className, style }) {
  const s = { width: circle ? height : width, height, borderRadius: circle ? '50%' : radius, ...style };
  return <span className={cx('vui-skeleton', className)} style={s} aria-hidden="true" />;
}
export function SkeletonText({ lines = 3, lastWidth = '60%', gap = 8, className }) {
  return (
    <span className={cx('vui-skeleton-text', className)} style={{ gap }} aria-hidden="true">
      {Array.from({ length: lines }).map((_, i) => <span key={i} className="vui-skeleton" style={{ width: i === lines - 1 && lines > 1 ? lastWidth : '100%' }} />)}
    </span>
  );
}
