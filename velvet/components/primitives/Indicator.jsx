import React from 'react';
import { cx } from './cx.js';
export function Indicator({ count, dot = false, max = 99, tone, size = 'sm', placement = 'top-end', overlap = 'rect', inset = false, label, className, children, ...rest }) {
  const hasCount = count != null && count !== 0 && count !== false;
  const show = hasCount || dot;
  const text = typeof count === 'number' && count > max ? max + '+' : count;
  return (
    <span className={cx('vui-indicator', overlap === 'circle' && 'vui-indicator--circle', placement.startsWith('bottom') && 'vui-indicator--bottom', placement.endsWith('start') && 'vui-indicator--start', inset && 'vui-indicator--inset', className)} {...rest}>
      {children}
      {show && (hasCount
        ? <span className={cx('vui-count', 'vui-indicator__item', size !== 'md' && 'vui-count--' + size, tone && tone !== 'brand' && 'vui-count--' + tone)} aria-hidden={label ? undefined : true} aria-label={label} role={label ? 'status' : undefined}>{text}</span>
        : <span className="vui-dot vui-indicator__item" data-tone={tone || 'brand'} aria-hidden={label ? undefined : true} aria-label={label} role={label ? 'status' : undefined} />)}
    </span>
  );
}
