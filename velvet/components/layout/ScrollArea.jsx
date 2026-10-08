import React from 'react';
import { cx } from '../primitives/cx.js';
export function ScrollArea({ maxHeight, height, maxWidth, orientation = 'vertical', fade = true, label, className, style, children, ...rest }) {
  const ref = React.useRef(null);
  const [edge, setEdge] = React.useState({ start: false, end: false });
  const horiz = orientation === 'horizontal';
  const measure = React.useCallback(() => {
    const el = ref.current; if (!el) return;
    const pos = horiz ? el.scrollLeft : el.scrollTop;
    const max = horiz ? el.scrollWidth - el.clientWidth : el.scrollHeight - el.clientHeight;
    setEdge((p) => { const n = { start: pos > 1, end: pos < max - 1 }; return n.start === p.start && n.end === p.end ? p : n; });
  }, [horiz]);
  React.useEffect(() => {
    measure(); const el = ref.current; if (!el || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(measure); ro.observe(el); if (el.firstElementChild) ro.observe(el.firstElementChild);
    return () => ro.disconnect();
  }, [measure]);
  return (
    <div ref={ref} onScroll={measure} tabIndex={0} role={label ? 'region' : undefined} aria-label={label}
      className={cx('vui-scroll', 'vui-scroll--' + (horiz ? 'x' : orientation === 'both' ? 'both' : 'y'), className)}
      style={{ maxHeight, height, maxWidth, '--_fs': fade && edge.start ? '28px' : '0px', '--_fe': fade && edge.end ? '28px' : '0px', ...style }} {...rest}>
      {horiz ? <div className="vui-scroll__track">{children}</div> : children}
    </div>
  );
}
