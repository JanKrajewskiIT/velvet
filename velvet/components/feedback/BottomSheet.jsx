import React from 'react';
import { cx } from '../primitives/cx.js';
export function BottomSheet({ open, onClose, title, description, footer, children, className }) {
  const sheet = React.useRef(null);
  const drag = React.useRef(null);
  const [dy, setDy] = React.useState(0);
  const closeRef = React.useRef(onClose); closeRef.current = onClose;
  React.useEffect(() => {
    if (!open) return;
    const prev = document.activeElement;
    requestAnimationFrame(() => sheet.current && sheet.current.focus({ preventScroll: true }));
    const k = (e) => { if (e.key === 'Escape') closeRef.current && closeRef.current(); };
    window.addEventListener('keydown', k);
    return () => { window.removeEventListener('keydown', k); prev && prev.focus && prev.focus(); };
  }, [open]);
  if (!open) return null;
  const down = (e) => { drag.current = { y: e.clientY, t: Date.now() }; e.currentTarget.setPointerCapture(e.pointerId); };
  const move = (e) => { if (drag.current) setDy(Math.max(0, e.clientY - drag.current.y)); };
  const up = (e) => { if (!drag.current) return; const v = dy / Math.max(1, Date.now() - drag.current.t); drag.current = null; if (dy > 120 || v > 0.6) { setDy(0); onClose && onClose(); } else setDy(0); };
  return (
    <div className="vui-sheet-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose && onClose(); }}>
      <div ref={sheet} tabIndex={-1} role="dialog" aria-modal="true" aria-label={typeof title === 'string' ? title : 'Sheet'} className={cx('vui-sheet', dy > 0 && 'vui-sheet--dragging', className)} style={{ transform: dy ? 'translateY(' + dy + 'px)' : undefined }}>
        <div className="vui-sheet__grab" onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} aria-hidden="true"><span /></div>
        {(title || description) && <div className="vui-sheet__head">{title && <h2 className="vui-sheet__title">{title}</h2>}{description && <p className="vui-sheet__desc">{description}</p>}</div>}
        <div className="vui-sheet__body">{children}</div>
        {footer && <div className="vui-sheet__foot">{footer}</div>}
      </div>
    </div>
  );
}
