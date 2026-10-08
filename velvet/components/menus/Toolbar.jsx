import React from 'react';
import { Glyph } from '../primitives/Glyph.jsx';
import { Separator } from '../primitives/Separator.jsx';
import { Menu } from './Menu.jsx';
import { cx } from '../primitives/cx.js';
function Item({ it, measure }) {
  if (it.divider) return <Separator semantic className="vui-toolbar__sep" />;
  if (it.spacer) return <span className="vui-toolbar__spacer" />;
  const iconOnly = it.icon && !it.showLabel;
  return (
    <button type="button" tabIndex={measure ? -1 : undefined} data-tb={measure ? undefined : ''} className={cx('vui-toolbar__btn', !iconOnly && 'vui-toolbar__btn--label')} disabled={it.disabled}
      aria-pressed={it.active !== undefined ? !!it.active : undefined} aria-label={iconOnly ? it.label : undefined} title={iconOnly ? it.label + (it.shortcut ? ' (' + it.shortcut + ')' : '') : undefined} onClick={it.onClick}>
      {it.icon && <Glyph name={it.icon} />}
      {!iconOnly && it.label}
    </button>
  );
}
export function Toolbar({ items = [], label, className }) {
  const bar = React.useRef(null);
  const meas = React.useRef(null);
  const [fit, setFit] = React.useState(items.length);
  const calc = React.useCallback(() => {
    if (!bar.current || !meas.current) return;
    const avail = bar.current.clientWidth - 8;
    const kids = [...meas.current.children];
    const more = 36;
    let w = 0, n = 0;
    for (let i = 0; i < kids.length; i++) {
      const cw = kids[i].offsetWidth + 2;
      const rest = i < kids.length - 1 ? more : 0;
      if (w + cw + rest > avail) break;
      w += cw; n = i + 1;
    }
    while (n > 0 && items[n - 1] && items[n - 1].divider) n--;
    setFit(n);
  }, [items]);
  React.useLayoutEffect(calc, [calc]);
  React.useEffect(() => { if (typeof ResizeObserver === 'undefined') return; const ro = new ResizeObserver(calc); ro.observe(bar.current); return () => ro.disconnect(); }, [calc]);
  const shown = items.slice(0, fit).filter((it) => !it.spacer || fit === items.length);
  const hidden = items.slice(fit).filter((it) => !it.spacer && !(it.divider && false));
  const menuItems = hidden.filter((it, i) => !(it.divider && (i === 0 || i === hidden.length - 1))).map((it) => (it.divider ? { divider: true } : { label: it.label, icon: it.icon, disabled: it.disabled, shortcut: it.shortcut, checked: it.active !== undefined ? !!it.active : undefined, onSelect: it.onClick }));
  const onKey = (e) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) return;
    const btns = [...bar.current.querySelectorAll('[data-tb]:not(:disabled),.vui-toolbar__more')];
    let i = btns.indexOf(document.activeElement); if (i < 0) return;
    e.preventDefault();
    i = e.key === 'Home' ? 0 : e.key === 'End' ? btns.length - 1 : (i + (e.key === 'ArrowRight' ? 1 : -1) + btns.length) % btns.length;
    btns[i].focus();
  };
  return (
    <div ref={bar} role="toolbar" aria-label={label} className={cx('vui-toolbar', className)} onKeyDown={onKey}>
      <div ref={meas} className="vui-toolbar__measure" aria-hidden="true">{items.map((it, i) => <Item key={i} it={it} measure />)}</div>
      {shown.map((it, i) => <Item key={i} it={it} />)}
      {menuItems.length > 0 && <Menu align="end" items={menuItems} trigger={<button type="button" className="vui-toolbar__btn vui-toolbar__more" aria-label={'More tools (' + menuItems.filter((m) => !m.divider).length + ')'}><Glyph name="more-horizontal" /></button>} />}
    </div>
  );
}
