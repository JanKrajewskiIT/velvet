import React from 'react';
import { Glyph } from '../primitives/Glyph.jsx';
import { Menu } from '../menus/Menu.jsx';
import { cx } from '../primitives/cx.js';
export function Breadcrumb({ items = [], maxItems = 4, className }) {
  let shown = items.map((it, i) => ({ it, i }));
  let hidden = [];
  if (items.length > maxItems && maxItems >= 2) { hidden = shown.slice(1, items.length - (maxItems - 1)); shown = [shown[0], { ellipsis: true }, ...shown.slice(items.length - (maxItems - 1))]; }
  return (
    <nav aria-label="Breadcrumb" className={cx('vui-crumbs', className)}>
      <ol>
        {shown.map((s, k) => {
          const last = k === shown.length - 1;
          return (
            <li key={k} className="vui-crumbs__item">
              {s.ellipsis ? (
                <Menu items={hidden.map(({ it }) => ({ label: it.label, icon: it.icon, onSelect: it.onClick || (it.href ? () => (window.location.href = it.href) : undefined) }))}
                  trigger={<button type="button" className="vui-crumbs__link vui-crumbs__more" aria-label={'Show ' + hidden.length + ' more'}><Glyph name="more-horizontal" /></button>} />
              ) : last ? (
                <span className="vui-crumbs__current" aria-current="page">{s.it.icon && <Glyph name={s.it.icon} />}{s.it.label}</span>
              ) : s.it.href ? (
                <a className="vui-crumbs__link" href={s.it.href} onClick={s.it.onClick}>{s.it.icon && <Glyph name={s.it.icon} />}{s.it.label}</a>
              ) : (
                <button type="button" className="vui-crumbs__link" onClick={s.it.onClick}>{s.it.icon && <Glyph name={s.it.icon} />}{s.it.label}</button>
              )}
              {!last && <Glyph name="chevron-right" className="vui-crumbs__sep" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
