import React from 'react';
import { cx } from '../primitives/cx.js';
export function SplitPane({ children, direction = 'horizontal', defaultSize = 50, size, onSizeChange, min = 15, max = 85, minPx = 120, collapsible = false, label = 'Resize panels', className, style }) {
  const [inner, setInner] = React.useState(defaultSize);
  const cur = size !== undefined ? size : inner;
  const box = React.useRef(null);
  const last = React.useRef(cur > 0 ? cur : defaultSize);
  const [drag, setDrag] = React.useState(false);
  const h = direction === 'horizontal';
  const total = () => { const r = box.current && box.current.getBoundingClientRect(); return r ? (h ? r.width : r.height) : 0; };
  const clamp = (v) => {
    const t = total(); const pxPct = t ? (minPx / t) * 100 : 0;
    const lo = Math.max(min, pxPct), hi = Math.min(max, 100 - pxPct);
    if (collapsible && v < lo / 2) return 0;
    return Math.max(lo, Math.min(hi, v));
  };
  const set = (v) => { const n = clamp(v); if (n > 0) last.current = n; if (size === undefined) setInner(n); onSizeChange && onSizeChange(n); };
  const [a, b] = React.Children.toArray(children);
  const at = (e) => { const r = box.current.getBoundingClientRect(); return h ? ((e.clientX - r.left) / r.width) * 100 : ((e.clientY - r.top) / r.height) * 100; };
  const down = (e) => {
    if (e.button !== 0) return; e.preventDefault(); e.stopPropagation();
    const el = e.currentTarget; el.setPointerCapture && el.setPointerCapture(e.pointerId); setDrag(true);
    const mv = (ev) => set(at(ev));
    const up = () => { setDrag(false); el.removeEventListener('pointermove', mv); el.removeEventListener('pointerup', up); el.removeEventListener('pointercancel', up); };
    el.addEventListener('pointermove', mv); el.addEventListener('pointerup', up); el.addEventListener('pointercancel', up);
  };
  const tpl = cur <= 0 ? '0px var(--split-handle) minmax(0,1fr)' : 'minmax(0,' + cur + 'fr) var(--split-handle) minmax(0,' + (100 - cur) + 'fr)';
  return (
    <div ref={box} className={cx('vui-split', 'vui-split--' + direction, drag && 'vui-split--drag', cur <= 0 && 'vui-split--collapsed', className)} style={{ ...(h ? { gridTemplateColumns: tpl } : { gridTemplateRows: tpl }), ...style }}>
      <div className="vui-split__pane">{a}</div>
      <div role="separator" tabIndex={0} aria-label={label} aria-orientation={h ? 'vertical' : 'horizontal'} aria-valuenow={Math.round(cur)} aria-valuemin={collapsible ? 0 : min} aria-valuemax={max} className="vui-split__handle"
        onPointerDown={down} onDoubleClick={() => set(collapsible && cur > 0 ? 0 : cur <= 0 ? last.current : defaultSize)}
        onKeyDown={(e) => { const st = e.shiftKey ? 10 : 2; const k = h ? { ArrowLeft: -st, ArrowRight: st } : { ArrowUp: -st, ArrowDown: st }; if (k[e.key] != null) { e.preventDefault(); set((cur <= 0 ? 0 : cur) + k[e.key]); } else if (e.key === 'Home') { e.preventDefault(); set(collapsible ? 0 : min); } else if (e.key === 'End') { e.preventDefault(); set(max); } else if (e.key === 'Enter') { e.preventDefault(); set(cur <= 0 ? last.current : defaultSize); } }}>
        <span className="vui-split__grip" />
      </div>
      <div className="vui-split__pane">{b}</div>
    </div>
  );
}
