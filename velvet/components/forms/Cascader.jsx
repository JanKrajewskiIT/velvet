import React from 'react';
import { Control } from '../primitives/Control.jsx';
import { Glyph } from '../primitives/Glyph.jsx';
import { EmptyText } from '../primitives/EmptyText.jsx';
import { Separator } from '../primitives/Separator.jsx';
import { Chevron } from '../primitives/Chevron.jsx';
import { Field } from '../primitives/Field.jsx';
import { cx } from '../primitives/cx.js';
const pathTo = (nodes, id, acc = []) => { for (const n of nodes) { const p = [...acc, n]; if (n.id === id) return p; if (n.children) { const r = pathTo(n.children, id, p); if (r) return r; } } return null; };
const allPaths = (nodes, acc = [], out = []) => { for (const n of nodes) { const p = [...acc, n]; if (n.children && n.children.length) allPaths(n.children, p, out); else out.push(p); } return out; };
export function Cascader({ label, hint, error, optional, required, data = [], value, defaultValue, onChange: onChangeProp, onValueChange, placeholder = 'Select…', separator = '/', changeOnSelect = false, expandTrigger = 'click', searchable = false, displayLast = false, size = 'md', disabled, id }) {
  const onChange = onChangeProp || onValueChange;
  const [inner, setInner] = React.useState(defaultValue ?? null);
  const cur = value !== undefined ? value : inner;
  const curPath = cur != null ? pathTo(data, cur) || [] : [];
  const [open, setOpen] = React.useState(false);
  const [trail, setTrail] = React.useState([]);
  const [col, setCol] = React.useState(0);
  const [q, setQ] = React.useState('');
  const [qi, setQi] = React.useState(0);
  const ref = React.useRef(null), menuRef = React.useRef(null), searchRef = React.useRef(null);
  const listId = React.useId();
  React.useEffect(() => {
    if (!open) return;
    const d = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', d);
    return () => document.removeEventListener('mousedown', d);
  }, [open]);
  React.useEffect(() => {
    if (!open) return;
    const t = curPath.map((n) => n.id); setTrail(t.length ? t : [data[0] && data[0].id].filter(Boolean)); setCol(Math.max(0, t.length - 1)); setQ(''); setQi(0);
    requestAnimationFrame(() => { (searchRef.current || menuRef.current) && (searchRef.current || menuRef.current).focus(); });
  }, [open]);
  const commit = (path) => { const leaf = path[path.length - 1]; if (value === undefined) setInner(leaf.id); onChange && onChange(leaf.id, path); };
  const close = () => { setOpen(false); requestAnimationFrame(() => { const b = ref.current && ref.current.querySelector('.vui-casc__trigger'); b && b.focus(); }); };
  const columns = [data];
  trail.forEach((tid, i) => { const n = (columns[i] || []).find((x) => x.id === tid); if (n && n.children && n.children.length) columns.push(n.children); });
  const activate = (level, n, viaPointer) => {
    const t = [...trail.slice(0, level), n.id]; setTrail(t); setCol(level);
    const has = n.children && n.children.length;
    if (!has) { if (!viaPointer || viaPointer === 'click') { commit(pathTo(data, n.id)); close(); } }
    else if (changeOnSelect && viaPointer === 'click') commit(pathTo(data, n.id));
  };
  const query = q.trim().toLowerCase();
  const hits = query ? allPaths(data).filter((p) => p.some((n) => String(n.label).toLowerCase().includes(query))).slice(0, 50) : [];
  const onKey = (e) => {
    if (e.key === 'Escape') { e.preventDefault(); close(); return; }
    if (query) {
      if (e.key === 'ArrowDown') { e.preventDefault(); setQi((i) => Math.min(hits.length - 1, i + 1)); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); setQi((i) => Math.max(0, i - 1)); }
      else if (e.key === 'Enter' && hits[qi]) { e.preventDefault(); commit(hits[qi]); close(); }
      return;
    }
    const list = columns[col] || []; const idx = Math.max(0, list.findIndex((x) => x.id === trail[col])); const n = list[idx];
    const go = (j) => { e.preventDefault(); const m = list[j]; if (m) setTrail([...trail.slice(0, col), m.id]); };
    if (e.key === 'ArrowDown') go(Math.min(list.length - 1, idx + 1));
    else if (e.key === 'ArrowUp') go(Math.max(0, idx - 1));
    else if (e.key === 'ArrowRight' && n && n.children && n.children.length) { e.preventDefault(); setTrail([...trail.slice(0, col + 1), n.children[0].id]); setCol(col + 1); }
    else if (e.key === 'ArrowLeft' && col > 0) { e.preventDefault(); setTrail(trail.slice(0, col)); setCol(col - 1); }
    else if (e.key === 'Enter' && n) { e.preventDefault(); if (n.children && n.children.length) { if (changeOnSelect) { commit(pathTo(data, n.id)); close(); } else { setTrail([...trail.slice(0, col + 1), n.children[0].id]); setCol(col + 1); } } else { commit(pathTo(data, n.id)); close(); } }
  };
  const hl = (s) => { const t = String(s); const i = t.toLowerCase().indexOf(query); return i < 0 ? t : <>{t.slice(0, i)}<mark className="vui-casc__mark">{t.slice(i, i + query.length)}</mark>{t.slice(i + query.length)}</>; };
  return (
    <Field label={label} hint={hint} error={error} optional={optional} required={required} id={id}>
      {(ctl) => (
        <div ref={ref} className="vui-casc">
          <Control size={size} invalid={!!(ctl.invalid)} disabled={disabled} className={cx(open && 'vui-casc__control--open')}>
            <button id={ctl.id} type="button" className="vui-casc__trigger vui-tselect__trigger" disabled={disabled} aria-haspopup="dialog" aria-expanded={open} aria-controls={listId} aria-describedby={ctl.describedBy} onClick={() => setOpen(!open)}>
              {curPath.length === 0 ? <span className="vui-tselect__ph">{placeholder}</span> : displayLast ? <span className="vui-tselect__val">{curPath[curPath.length - 1].label}</span> :
                <span className="vui-casc__path">{curPath.map((n, i) => <React.Fragment key={n.id}>{i > 0 && <Separator variant="text">{separator}</Separator>}<span className={i === curPath.length - 1 ? 'vui-casc__leaf' : undefined}>{n.label}</span></React.Fragment>)}</span>}
            </button>
            <Chevron open={open} className="vui-control__chevron vui-casc__chev" />
          </Control>
          {open && (
            <div ref={menuRef} id={listId} tabIndex={-1} className="vui-select__menu vui-casc__menu" role="dialog" aria-label={label || 'Choose'} onKeyDown={onKey}>
              {searchable && <Control size="sm" className="vui-casc__search" iconLeft="search"><input ref={searchRef} className="vui-control__input" placeholder="Search" aria-label="Search options" value={q} onChange={(e) => { setQ(e.target.value); setQi(0); }} /></Control>}
              {query ? (
                <div className="vui-casc__results" role="listbox">
                  {hits.length === 0 && <EmptyText className="vui-tselect__empty">No matches</EmptyText>}
                  {hits.map((p, i) => <div key={p.map((n) => n.id).join('.')} role="option" aria-selected={p[p.length - 1].id === cur} className={cx('vui-option', i === qi && 'vui-option--active')} onMouseEnter={() => setQi(i)} onMouseDown={(e) => e.preventDefault()} onClick={() => { commit(p); close(); }}><span className="vui-option__label vui-casc__hit">{p.map((n, j) => <React.Fragment key={n.id}>{j > 0 && <Separator variant="text">{separator}</Separator>}<span>{hl(n.label)}</span></React.Fragment>)}</span></div>)}
                </div>
              ) : (
                <div className="vui-casc__cols">
                  {columns.map((list, level) => (
                    <ul key={level} className="vui-casc__col" role="listbox" aria-label={'Level ' + (level + 1)}>
                      {list.map((n) => {
                        const has = n.children && n.children.length; const on = trail[level] === n.id; const picked = curPath[level] && curPath[level].id === n.id;
                        return (
                          <li key={n.id} role="option" aria-selected={on} aria-disabled={n.disabled || undefined} className={cx('vui-option', 'vui-casc__opt', on && 'vui-casc__opt--on', on && level === col && 'vui-option--active', picked && 'vui-casc__opt--picked')}
                            onMouseDown={(e) => e.preventDefault()} onMouseEnter={expandTrigger === 'hover' && has && !n.disabled ? () => activate(level, n, 'hover') : undefined} onClick={n.disabled ? undefined : () => activate(level, n, 'click')}>
                            {n.icon && <Glyph name={n.icon} />}
                            <span className="vui-option__label">{n.label}</span>
                            {n.meta != null && <span className="vui-option__kbd">{n.meta}</span>}
                            {has ? <Glyph name="chevron-right" className="vui-casc__arrow" /> : picked ? <Glyph name="check" className="vui-select__check" /> : null}
                          </li>
                        );
                      })}
                    </ul>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </Field>
  );
}
