import React from 'react';
import { cx } from './cx.js';
// Pointer drag reports the new width via onResize(width); ←/→ step by `step`; double-click calls onReset.
export function ColumnResize({ label, width, min = 64, step = 16, onResize, onReset, className, ...rest }) {
  const [active, setActive] = React.useState(false);
  const down = (e) => {
    e.preventDefault(); e.stopPropagation();
    const cell = e.currentTarget.parentElement; const x0 = e.clientX; const w0 = width || cell.getBoundingClientRect().width;
    setActive(true);
    const mv = (ev) => onResize && onResize(Math.max(min, Math.round(w0 + ev.clientX - x0)));
    const up = () => { setActive(false); window.removeEventListener('pointermove', mv); window.removeEventListener('pointerup', up); };
    window.addEventListener('pointermove', mv); window.addEventListener('pointerup', up);
  };
  const key = (e) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    e.preventDefault(); e.stopPropagation();
    const w = width || e.currentTarget.parentElement.getBoundingClientRect().width;
    onResize && onResize(Math.max(min, Math.round(w + (e.key === 'ArrowRight' ? step : -step))));
  };
  return <span role="separator" tabIndex={0} aria-orientation="vertical" aria-label={label} aria-valuenow={width ? Math.round(width) : undefined} className={cx('vui-col-resize', active && 'vui-col-resize--active', className)} onPointerDown={down} onKeyDown={key} onDoubleClick={onReset} onClick={(e) => e.stopPropagation()} {...rest} />;
}
