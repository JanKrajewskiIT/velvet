import React from 'react';
import { Glyph } from '../primitives/Glyph.jsx';
import { cx } from '../primitives/cx.js';
export function ErrorSummary({ errors = [], title, focusOnShow = true, className }) {
  const ref = React.useRef(null);
  const sig = errors.map((e) => e.id + e.message).join('|');
  React.useEffect(() => { if (focusOnShow && errors.length && ref.current) ref.current.focus({ preventScroll: true }); }, [sig]);
  if (!errors.length) return null;
  const jump = (e, id) => { e.preventDefault(); const el = document.getElementById(id); if (!el) return; el.focus({ preventScroll: true }); const y = el.getBoundingClientRect().top + window.scrollY - 120; window.scrollTo({ top: y, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }); };
  return (
    <div ref={ref} tabIndex={-1} role="alert" aria-labelledby="vui-errsum-t" className={cx('vui-errsum', className)}>
      <div className="vui-errsum__head"><Glyph name="circle-x" /><span id="vui-errsum-t">{title || (errors.length === 1 ? 'There’s 1 problem to fix' : 'There are ' + errors.length + ' problems to fix')}</span></div>
      <ul className="vui-errsum__list">{errors.map((er) => <li key={er.id}><a href={'#' + er.id} onClick={(e) => jump(e, er.id)}>{er.message}</a></li>)}</ul>
    </div>
  );
}
