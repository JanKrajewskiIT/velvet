import React from 'react';
import { IconButton } from '../actions/IconButton.jsx';
import { Glyph } from '../primitives/Glyph.jsx';
import { cx } from '../primitives/cx.js';
export function HierarchyNavigator({ data = [], value, onSelect, rootLabel = 'All', className }) {
  const [path, setPath] = React.useState([]);
  const [dir, setDir] = React.useState(1);
  const list = React.useRef(null);
  const level = path.length ? path[path.length - 1].children : data;
  React.useEffect(() => { const b = list.current && list.current.querySelector('button'); b && b.focus({ preventScroll: true }); }, [path.length]);
  const into = (n) => { setDir(1); setPath([...path, n]); };
  const back = (k = path.length - 1) => { setDir(-1); setPath(path.slice(0, k)); };
  return (
    <div className={cx('vui-hnav', className)} onKeyDown={(e) => { if ((e.key === 'ArrowLeft' || e.key === 'Backspace') && path.length && e.target.tagName === 'BUTTON') { e.preventDefault(); back(); } }}>
      <div className="vui-hnav__head">
        {path.length > 0 ? <IconButton icon="arrow-left" label="Back" size="sm" onClick={() => back()} /> : <span style={{ width: 4 }} />}
        <nav aria-label="Path" className="vui-hnav__path">
          <button type="button" className="vui-hnav__crumb" disabled={!path.length} onClick={() => back(0)}>{rootLabel}</button>
          {path.map((p, k) => <React.Fragment key={p.id}><Glyph name="chevron-right" /><button type="button" className="vui-hnav__crumb" disabled={k === path.length - 1} onClick={() => back(k + 1)}>{p.label}</button></React.Fragment>)}
        </nav>
      </div>
      <ul ref={list} key={path.length} className={cx('vui-hnav__list', dir > 0 ? 'vui-hnav__list--in' : 'vui-hnav__list--out')}>
        {level.map((n) => {
          const has = n.children && n.children.length;
          return (
            <li key={n.id}>
              <button type="button" className={cx('vui-hnav__item', value === n.id && 'vui-hnav__item--sel')} aria-current={value === n.id || undefined}
                onClick={() => (has ? into(n) : onSelect && onSelect(n.id, n, [...path, n]))} onKeyDown={(e) => { if (e.key === 'ArrowRight' && has) { e.preventDefault(); into(n); } }}>
                {n.icon && <Glyph name={n.icon} />}
                <span className="vui-hnav__label">{n.label}{n.description && <span className="vui-hnav__desc">{n.description}</span>}</span>
                {has ? <><span className="vui-hnav__count">{n.children.length}</span><Glyph name="chevron-right" className="vui-hnav__go" /></> : value === n.id && <Glyph name="check" className="vui-hnav__go" />}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
