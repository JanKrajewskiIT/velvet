import React from 'react';
import { Glyph } from '../primitives/Glyph.jsx';
import { cx } from '../primitives/cx.js';
export function Fab({ icon = 'plus', label, extended = false, onClick, actions, position = 'fixed', className }) {
  const [open, setOpen] = React.useState(false);
  const wrap = React.useRef(null);
  React.useEffect(() => {
    if (!open) return;
    const h = (e) => { if (wrap.current && !wrap.current.contains(e.target)) setOpen(false); };
    const k = (e) => { if (e.key === 'Escape') { setOpen(false); wrap.current.querySelector('.vui-fab').focus(); } };
    document.addEventListener('mousedown', h); window.addEventListener('keydown', k);
    return () => { document.removeEventListener('mousedown', h); window.removeEventListener('keydown', k); };
  }, [open]);
  const dial = actions && actions.length > 0;
  return (
    <div ref={wrap} className={cx('vui-fab-wrap', position === 'fixed' && 'vui-fab-wrap--fixed', open && 'vui-fab-wrap--open', className)}>
      {dial && (
        <ul className="vui-fab__dial" role="menu" aria-hidden={!open}>
          {actions.map((a, i) => (
            <li key={a.label} style={{ transitionDelay: open ? (actions.length - 1 - i) * 30 + 'ms' : '0ms' }}>
              <span className="vui-fab__tag">{a.label}</span>
              <button type="button" role="menuitem" tabIndex={open ? 0 : -1} className="vui-fab__mini" aria-label={a.label} onClick={() => { setOpen(false); a.onClick && a.onClick(); }}><Glyph name={a.icon} /></button>
            </li>
          ))}
        </ul>
      )}
      <button type="button" className={cx('vui-fab', extended && 'vui-fab--extended')} aria-label={extended ? undefined : label} aria-haspopup={dial ? 'menu' : undefined} aria-expanded={dial ? open : undefined} onClick={dial ? () => setOpen(!open) : onClick}>
        <Glyph name={icon} className="vui-fab__icon" />
        {extended && <span>{label}</span>}
      </button>
    </div>
  );
}
