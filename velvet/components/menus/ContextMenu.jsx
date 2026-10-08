import React from 'react';
import { MenuPanel } from './Menu.jsx';
export function ContextMenu({ items = [], disabled, children, className, style }) {
  const [pos, setPos] = React.useState(null);
  const panel = React.useRef(null);
  const zone = React.useRef(null);
  const openAt = (x, y) => setPos({ x, y });
  React.useLayoutEffect(() => {
    if (!pos || !panel.current) return;
    const el = panel.current.firstChild; if (!el) return;
    const r = el.getBoundingClientRect();
    const x = Math.min(pos.x, window.innerWidth - r.width - 8), y = Math.min(pos.y, window.innerHeight - r.height - 8);
    if (x !== pos.x || y !== pos.y) setPos({ x: Math.max(8, x), y: Math.max(8, y), fixed: true });
  }, [pos]);
  React.useEffect(() => {
    if (!pos) return;
    const down = (e) => { if (panel.current && !panel.current.contains(e.target)) setPos(null); };
    const close = (e) => { if (e && e.type === 'scroll' && panel.current && panel.current.contains(e.target)) return; setPos(null); };
    document.addEventListener('mousedown', down); window.addEventListener('scroll', close, true); window.addEventListener('resize', close);
    return () => { document.removeEventListener('mousedown', down); window.removeEventListener('scroll', close, true); window.removeEventListener('resize', close); };
  }, [pos]);
  return (
    <div ref={zone} className={className} style={style} tabIndex={0} aria-haspopup="menu"
      onContextMenu={(e) => { if (disabled) return; e.preventDefault(); openAt(e.clientX, e.clientY); }}
      onKeyDown={(e) => { if (disabled) return; if ((e.shiftKey && e.key === 'F10') || e.key === 'ContextMenu') { e.preventDefault(); const r = zone.current.getBoundingClientRect(); openAt(r.left + 16, r.top + 16); } }}>
      {children}
      {pos && window.ReactDOM.createPortal(
        <div ref={panel}>
          <MenuPanel items={items} style={{ position: 'fixed', left: pos.x, top: pos.y, zIndex: 'var(--z-dropdown)' }} onClose={(refocus) => { setPos(null); refocus && zone.current && zone.current.focus({ preventScroll: true }); }} />
        </div>, document.body
      )}
    </div>
  );
}
