import React from 'react';
import { Tag } from '../display/Tag.jsx';
import { Control } from '../primitives/Control.jsx';
import { Button } from '../actions/Button.jsx';
import { Glyph } from '../primitives/Glyph.jsx';
import { useDismiss } from '../primitives/useDismiss.js';
import { EmptyText } from '../primitives/EmptyText.jsx';
import { Field } from '../primitives/Field.jsx';
import { cx } from '../primitives/cx.js';
const leaves = (n) => (n.children && n.children.length ? n.children.flatMap(leaves) : [n.id]);
const find = (nodes, id) => { for (const n of nodes) { if (n.id === id) return n; if (n.children) { const r = find(n.children, id); if (r) return r; } } return null; };
function visible(nodes, open, q, level = 1, out = []) {
  for (const n of nodes) {
    const kids = n.children || [];
    const match = !q || String(n.label).toLowerCase().includes(q);
    const sub = []; if (kids.length) visible(kids, open, q, level + 1, sub);
    if (!match && !sub.length) continue;
    out.push({ n, level, has: kids.length > 0 });
    if (kids.length && (q || open.has(n.id))) out.push(...sub);
  }
  return out;
}
export function TreeSelect({ label, hint, error, optional, required, data = [], value, defaultValue, onChange: onChangeProp, onValueChange, multiple = false, leavesOnly = false, placeholder = 'Select…', searchable = true, defaultExpanded = [], maxTags = 2, size = 'md', disabled, id }) {
  const onChange = onChangeProp || onValueChange;
  const [inner, setInner] = React.useState(defaultValue ?? (multiple ? [] : null));
  const cur = value !== undefined ? value : inner;
  const set = (v) => { if (value === undefined) setInner(v); onChange && onChange(v); };
  const [open, setOpen] = React.useState(false);
  const [exp, setExp] = React.useState(() => new Set(defaultExpanded));
  const [q, setQ] = React.useState('');
  const [active, setActive] = React.useState(0);
  const ref = React.useRef(null), searchRef = React.useRef(null), treeRef = React.useRef(null);
  useDismiss(open, setOpen, ref);
  React.useEffect(() => { if (open) { setQ(''); setActive(0); requestAnimationFrame(() => (searchRef.current || treeRef.current) && (searchRef.current || treeRef.current).focus()); } }, [open]);
  const rows = visible(data, exp, q.trim().toLowerCase());
  const sel = new Set(multiple ? cur : cur != null ? [cur] : []);
  const state = (n) => { if (!multiple) return sel.has(n.id) ? 'on' : 'off'; const l = leaves(n); const c = l.filter((x) => sel.has(x)).length; return c === 0 ? 'off' : c === l.length ? 'on' : 'mixed'; };
  const pick = (n, has) => {
    if (multiple) { const l = leaves(n); const all = l.every((x) => sel.has(x)); const s = new Set(sel); l.forEach((x) => (all ? s.delete(x) : s.add(x))); set([...s]); }
    else if (has && leavesOnly) toggle(n.id);
    else { set(n.id); setOpen(false); requestAnimationFrame(() => { const b = ref.current && ref.current.querySelector('.vui-tselect__trigger'); b && b.focus(); }); }
  };
  const toggle = (id, force) => setExp((p) => { const s = new Set(p); (force ?? !s.has(id)) ? s.add(id) : s.delete(id); return s; });
  const onKey = (e) => {
    const r = rows[active];
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(rows.length - 1, a + 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(0, a - 1)); }
    else if (e.key === 'ArrowRight' && r && r.has && !q) { e.preventDefault(); toggle(r.n.id, true); }
    else if (e.key === 'ArrowLeft' && r && r.has && !q) { e.preventDefault(); toggle(r.n.id, false); }
    else if (e.key === 'Enter' && r) { e.preventDefault(); pick(r.n, r.has); }
  };
  React.useEffect(() => { const el = treeRef.current && treeRef.current.children[active]; if (el && treeRef.current) { const t = treeRef.current; if (el.offsetTop < t.scrollTop) t.scrollTop = el.offsetTop; else if (el.offsetTop + el.offsetHeight > t.scrollTop + t.clientHeight) t.scrollTop = el.offsetTop + el.offsetHeight - t.clientHeight; } }, [active]);
  const picked = [...sel].map((x) => find(data, x)).filter(Boolean);
  const listId = React.useId();
  return (
    <Field label={label} hint={hint} error={error} optional={optional} required={required} id={id}>
      {(ctl) => (
        <div ref={ref} className="vui-select vui-tselect">
          <Control size={size} invalid={!!(ctl.invalid)} disabled={disabled} className={cx(multiple && picked.length > 0 && 'vui-tselect__control--tags')}>
            <button id={ctl.id} type="button" className="vui-tselect__trigger" disabled={disabled} aria-haspopup="tree" aria-expanded={open} aria-controls={listId} aria-describedby={ctl.describedBy} onClick={() => setOpen(!open)}>
              {picked.length === 0 && <span className="vui-tselect__ph">{placeholder}</span>}
              {!multiple && picked[0] && <span className="vui-tselect__val">{picked[0].label}</span>}
              {multiple && picked.slice(0, maxTags).map((n) => <Tag key={n.id} size="sm" onRemove={() => set(cur.filter((x) => x !== n.id))}>{n.label}</Tag>)}
              {multiple && picked.length > maxTags && <Tag size="sm">{'+' + (picked.length - maxTags)}</Tag>}
            </button>
            <Glyph name="chevron-down" className="vui-control__chevron" />
          </Control>
          {open && (
            <div className="vui-select__menu vui-tselect__menu" onKeyDown={onKey}>
              {searchable && <Control size="sm" className="vui-tselect__search" iconLeft="search"><input ref={searchRef} className="vui-control__input" placeholder="Search" aria-label="Search options" aria-controls={listId} aria-activedescendant={rows[active] ? listId + '-' + rows[active].n.id : undefined} value={q} onChange={(e) => { setQ(e.target.value); setActive(0); }} /></Control>}
              <div ref={treeRef} id={listId} role="tree" aria-multiselectable={multiple || undefined} aria-label={label || 'Options'} tabIndex={searchable ? -1 : 0} className="vui-tselect__tree" aria-activedescendant={!searchable && rows[active] ? listId + '-' + rows[active].n.id : undefined}>
                {rows.length === 0 && <EmptyText className="vui-tselect__empty">No matches</EmptyText>}
                {rows.map((r, i) => {
                  const st = state(r.n);
                  return (
                    <div key={r.n.id} id={listId + '-' + r.n.id} role="treeitem" aria-level={r.level} aria-expanded={r.has ? q ? true : exp.has(r.n.id) : undefined} aria-selected={multiple ? undefined : st === 'on'} aria-checked={multiple ? (st === 'mixed' ? 'mixed' : st === 'on') : undefined}
                      className={cx('vui-option', 'vui-tselect__row', i === active && 'vui-option--active')} style={{ paddingLeft: 'calc(var(--option-px) + ' + (r.level - 1) * 18 + 'px)' }}
                      onMouseEnter={() => setActive(i)} onMouseDown={(e) => e.preventDefault()} onClick={() => pick(r.n, r.has)}>
                      <span className={cx('vui-tselect__twist', !r.has && 'vui-tselect__twist--leaf')} onClick={(e) => { if (r.has) { e.stopPropagation(); toggle(r.n.id); } }} aria-hidden="true">{r.has && <Glyph name={'chevron-' + (q || exp.has(r.n.id) ? 'down' : 'right')} />}</span>
                      {multiple && <span className={cx('vui-fchip__box', st !== 'off' && 'vui-fchip__box--on')} aria-hidden="true">{st === 'on' && <Glyph name="check" />}{st === 'mixed' && <Glyph name="minus" />}</span>}
                      {r.n.icon && <Glyph name={r.n.icon} />}
                      <span className="vui-option__label">{r.n.label}</span>
                      {r.n.meta != null && <span className="vui-option__kbd">{r.n.meta}</span>}
                      {!multiple && st === 'on' && <Glyph name="check" className="vui-select__check" />}
                    </div>
                  );
                })}
              </div>
              {multiple && picked.length > 0 && <div className="vui-fchip__foot"><span className="vui-tselect__sum">{picked.length + ' selected'}</span><Button variant="ghost" size="sm" onClick={() =>set([])}>Clear</Button></div>}
            </div>
          )}
        </div>
      )}
    </Field>
  );
}
