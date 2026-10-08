import React from 'react';
import { cx } from '../primitives/cx.js';
const resolve = (c) => (typeof c === 'string' ? document.querySelector(c) : c && 'current' in c ? c.current : c) || null;
export function Anchor({ items = [], container, offset = 24, activeId, onChange: onChangeProp, onValueChange, label = 'On this page', title, className }) {
  const onChange = onChangeProp || onValueChange;
  const [inner, setInner] = React.useState(items[0] && items[0].id);
  const cur = activeId !== undefined ? activeId : inner;
  const lock = React.useRef(0);
  const set = (id) => { if (id === cur) return; if (activeId === undefined) setInner(id); onChange && onChange(id); };
  React.useEffect(() => {
    const el = resolve(container); const target = el || window;
    const run = () => {
      if (Date.now() < lock.current) return;
      const top = el ? el.getBoundingClientRect().top : 0;
      let id = items[0] && items[0].id;
      for (const it of items) { const h = document.getElementById(it.id); if (h && h.getBoundingClientRect().top - top <= offset + 1) id = it.id; }
      const atEnd = el ? el.scrollTop + el.clientHeight >= el.scrollHeight - 2 : window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      if (atEnd && items.length) id = items[items.length - 1].id;
      set(id);
    };
    run(); target.addEventListener('scroll', run, { passive: true });
    return () => target.removeEventListener('scroll', run);
  }, [container, items, offset, cur]);
  const go = (e, id) => {
    e.preventDefault(); const h = document.getElementById(id); if (!h) return;
    const el = resolve(container);
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (el) el.scrollTo({ top: el.scrollTop + h.getBoundingClientRect().top - el.getBoundingClientRect().top - offset + 8, behavior: reduce ? 'auto' : 'smooth' });
    else window.scrollTo({ top: window.scrollY + h.getBoundingClientRect().top - offset + 8, behavior: reduce ? 'auto' : 'smooth' });
    lock.current = Date.now() + 600; set(id);
    h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true });
  };
  return (
    <nav className={cx('vui-anchor', className)} aria-label={label}>
      {title !== null && <div className="vui-anchor__title">{title || label}</div>}
      <ul className="vui-anchor__list">
        {items.map((it) => (
          <li key={it.id}><a href={'#' + it.id} className={cx('vui-anchor__link', (it.level || 1) > 1 && 'vui-anchor__link--sub', it.id === cur && 'vui-anchor__link--on')} aria-current={it.id === cur ? 'location' : undefined} onClick={(e) => go(e, it.id)}>{it.label}</a></li>
        ))}
      </ul>
    </nav>
  );
}
