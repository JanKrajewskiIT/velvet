import React from 'react';
import { Glyph } from '../primitives/Glyph.jsx';
import { cx } from '../primitives/cx.js';
export function BackToTop({ target, threshold = 400, label = 'Back to top', position = 'fixed', className }) {
  const [p, setP] = React.useState(0);
  const [show, setShow] = React.useState(false);
  const getEl = () => (typeof target === 'string' ? document.querySelector(target) : target && target.current) || null;
  React.useEffect(() => {
    const el = getEl();
    const src = el || window;
    const read = () => { const top = el ? el.scrollTop : window.scrollY; const max = el ? el.scrollHeight - el.clientHeight : document.documentElement.scrollHeight - window.innerHeight; setShow(top > threshold); setP(max > 0 ? top / max : 0); };
    read(); src.addEventListener('scroll', read, { passive: true });
    return () => src.removeEventListener('scroll', read);
  }, [target, threshold]);
  const C = 2 * Math.PI * 21;
  return (
    <button type="button" aria-label={label} title={label} className={cx('vui-backtop', position === 'fixed' && 'vui-backtop--fixed', show && 'vui-backtop--show', className)}
      tabIndex={show ? 0 : -1} aria-hidden={!show || undefined}
      onClick={() => { const el = getEl(); const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches; (el || window).scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); }}>
      <svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="21" className="vui-backtop__track" /><circle cx="24" cy="24" r="21" className="vui-backtop__ring" style={{ strokeDasharray: C, strokeDashoffset: C * (1 - p) }} /></svg>
      <Glyph name="arrow-up" />
    </button>
  );
}
