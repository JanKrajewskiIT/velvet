import React from 'react';
import { Chevron } from '../primitives/Chevron.jsx';
import { Checkmark } from '../primitives/Checkmark.jsx';
import { Button } from '../actions/Button.jsx';
import { Glyph } from '../primitives/Glyph.jsx';
import { cx } from '../primitives/cx.js';
function flatten(nodes, open, load, level = 1, parent = null, out = []) {
  nodes.forEach((n, i) => {
    out.push({ n, level, parent, pos: i + 1, size: nodes.length });
    if (!open.has(n.id)) return;
    if (n.children && n.children.length) flatten(n.children, open, load, level + 1, n.id, out);
    else if (n.lazy && load[n.id]) out.push({ status: load[n.id], n: { id: n.id + '::' + load[n.id].kind, owner: n }, level: level + 1, parent: n.id, pos: 1, size: 1 });
  });
  return out;
}
function indexTree(nodes, parent = null, map = new Map()) { nodes.forEach((n, i) => { map.set(n.id, { n, parent, siblings: nodes, index: i }); if (n.children) indexTree(n.children, n.id, map); }); return map; }
const isWithin = (map, id, ancestor) => { for (let x = id; x != null; x = map.get(x) && map.get(x).parent) if (x === ancestor) return true; return false; };
const canNest = (n) => Array.isArray(n.children) || !!n.lazy;
/** Pure helper: returns a new tree with the move applied (app decides whether to use it). */
export function moveTreeNode(data, { id, targetId, position }) {
  let picked = null;
  const strip = (list) => list.filter((n) => (n.id === id ? ((picked = n), false) : true)).map((n) => (n.children ? { ...n, children: strip(n.children) } : n));
  const rest = strip(data); if (!picked) return data;
  const put = (list) => { const i = list.findIndex((n) => n.id === targetId); if (i >= 0) { if (position === 'inside') return list.map((n) => (n.id === targetId ? { ...n, children: [...(n.children || []), picked] } : n)); const c = list.slice(); c.splice(position === 'before' ? i : i + 1, 0, picked); return c; } return list.map((n) => (n.children ? { ...n, children: put(n.children) } : n)); };
  return put(rest);
}
const leavesOf = (n) => (n.children && n.children.length ? n.children.flatMap(leavesOf) : [n.id]);
export function TreeView({ onLoadChildren, checkable = false, checked, defaultChecked = [], onCheckedChange, data = [], selected, defaultSelected = null, onSelect, expanded, defaultExpanded = [], onExpandedChange, onMove, canDrop, label, className }) {
  const [innerSel, setInnerSel] = React.useState(defaultSelected);
  const sel = selected !== undefined ? selected : innerSel;
  const [innerExp, setInnerExp] = React.useState(() => new Set(defaultExpanded));
  const open = expanded !== undefined ? new Set(expanded) : innerExp;
  const [focus, setFocus] = React.useState(sel ?? (data[0] && data[0].id));
  const root = React.useRef(null);
  const kb = React.useRef(false);
  const [load, setLoad] = React.useState({});
  const fetchKids = async (n) => {
    if (!onLoadChildren || (load[n.id] && load[n.id].kind === 'loading')) return;
    setLoad((m) => ({ ...m, [n.id]: { kind: 'loading' } }));
    try { await onLoadChildren(n); setLoad((m) => { const x = { ...m }; delete x[n.id]; return x; }); }
    catch (e) { setLoad((m) => ({ ...m, [n.id]: { kind: 'error', message: (e && e.message) || 'Couldn’t load' } })); }
  };
  const rows = flatten(data, open, load);
  const map = React.useMemo(() => indexTree(data), [data]);
  const [drag, setDrag] = React.useState(null);
  const [drop, setDrop] = React.useState(null);
  const [said, setSaid] = React.useState('');
  const refocus = React.useRef(false);
  const nameOf = (n) => (typeof n.label === 'string' ? n.label : n.id);
  const validMove = (id, targetId, position) => {
    if (!onMove || id == null || targetId == null || id === targetId) return false;
    const t = map.get(targetId); const d = map.get(id); if (!t || !d) return false;
    if (isWithin(map, targetId, id)) return false;
    if (position === 'inside' && !canNest(t.n)) return false;
    return canDrop ? canDrop(d.n, t.n, position) !== false : true;
  };
  const doMove = (id, targetId, position, kbd) => {
    if (!validMove(id, targetId, position)) { if (kbd) setSaid('Can’t move there'); return; }
    if (position === 'inside' && !open.has(targetId)) { const s2 = new Set(open); s2.add(targetId); setOpen(s2); }
    onMove({ id, targetId, position });
    const t = map.get(targetId).n; setSaid(nameOf(map.get(id).n) + ' moved ' + (position === 'inside' ? 'into ' : position + ' ') + nameOf(t));
    if (kbd) refocus.current = true;
  };
  React.useEffect(() => { if (!refocus.current) return; refocus.current = false; const el = root.current && root.current.querySelector('[data-id="' + CSS.escape(String(focus)) + '"]'); el && el.focus(); }, [data]);
  const kbMove = (id, key) => {
    const m = map.get(id); if (!m) return; const { siblings, index, parent } = m;
    if (key === 'ArrowUp' && index > 0) doMove(id, siblings[index - 1].id, 'before', true);
    else if (key === 'ArrowDown' && index < siblings.length - 1) doMove(id, siblings[index + 1].id, 'after', true);
    else if (key === 'ArrowRight' && index > 0) doMove(id, siblings[index - 1].id, 'inside', true);
    else if (key === 'ArrowLeft' && parent != null) doMove(id, parent, 'after', true);
    else setSaid('Can’t move further');
  };
  const dropPos = (e, n) => { const r = e.currentTarget.getBoundingClientRect(); const y = (e.clientY - r.top) / r.height; return canNest(n) && y > 0.28 && y < 0.72 ? 'inside' : y < 0.5 ? 'before' : 'after'; };
  const dnd = (n) => (onMove ? {
    draggable: true,
    onDragStart: (e) => { setDrag(n.id); e.dataTransfer.effectAllowed = 'move'; try { e.dataTransfer.setData('text/plain', String(n.id)); } catch (_) {} },
    onDragEnd: () => { setDrag(null); setDrop(null); },
    onDragOver: (e) => { if (drag == null) return; const p = dropPos(e, n); if (!validMove(drag, n.id, p)) { if (drop) setDrop(null); return; } e.preventDefault(); e.dataTransfer.dropEffect = 'move'; if (!drop || drop.id !== n.id || drop.p !== p) setDrop({ id: n.id, p }); },
    onDragLeave: (e) => { if (!e.currentTarget.contains(e.relatedTarget) && drop && drop.id === n.id) setDrop(null); },
    onDrop: (e) => { e.preventDefault(); const p = dropPos(e, n); const id = drag; setDrag(null); setDrop(null); doMove(id, n.id, p); },
  } : {});
  const [innerChk, setInnerChk] = React.useState(defaultChecked);
  const chk = new Set(checked !== undefined ? checked : innerChk);
  const chkState = (n) => { const l = leavesOf(n); const c = l.filter((x) => chk.has(x)).length; return c === 0 ? 'off' : c === l.length ? 'on' : 'mixed'; };
  const toggleCheck = (n) => { const l = leavesOf(n); const all = l.every((x) => chk.has(x)); const s = new Set(chk); l.forEach((x) => (all ? s.delete(x) : s.add(x))); const v = [...s]; if (checked === undefined) setInnerChk(v); onCheckedChange && onCheckedChange(v); };
  const setOpen = (s) => { if (expanded === undefined) setInnerExp(s); onExpandedChange && onExpandedChange([...s]); };
  const find = (id, list = data) => { for (const n of list) { if (n.id === id) return n; const c = n.children && find(id, n.children); if (c) return c; } return null; };
  const toggle = (id, force) => { const s = new Set(open); const want = force ?? !s.has(id); want ? s.add(id) : s.delete(id); setOpen(s); const n = want && find(id); if (n && n.lazy && !(n.children && n.children.length)) fetchKids(n); };
  const choose = (n) => { if (selected === undefined) setInnerSel(n.id); onSelect && onSelect(n.id, n); };
  React.useEffect(() => { if (!kb.current) return; kb.current = false; const el = root.current && root.current.querySelector('[data-id="' + CSS.escape(String(focus)) + '"]'); el && el.focus(); }, [focus]);
  const onKey = (e) => {
    const i = rows.findIndex((r) => r.n.id === focus); if (i < 0) return;
    const r = rows[i]; const has = (r.n.children && r.n.children.length) || r.n.lazy;
    if (r.status) { if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') move(r.parent); else if (e.key === 'ArrowDown' && rows[i + 1]) move(rows[i + 1].n.id); else if ((e.key === 'Enter' || e.key === ' ') && r.status.kind === 'error') { e.preventDefault(); fetchKids(r.n.owner); } return; }
    const move = (id) => { e.preventDefault(); kb.current = true; setFocus(id); };
    if (onMove && e.altKey && e.key.startsWith('Arrow')) { e.preventDefault(); kbMove(r.n.id, e.key); return; }
    if (e.key === 'ArrowDown' && rows[i + 1]) move(rows[i + 1].n.id);
    else if (e.key === 'ArrowUp' && rows[i - 1]) move(rows[i - 1].n.id);
    else if (e.key === 'Home') move(rows[0].n.id);
    else if (e.key === 'End') move(rows[rows.length - 1].n.id);
    else if (e.key === 'ArrowRight') { e.preventDefault(); if (has && !open.has(r.n.id)) toggle(r.n.id, true); else if (has && rows[i + 1] && rows[i + 1].parent === r.n.id) move(rows[i + 1].n.id); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); if (has && open.has(r.n.id)) toggle(r.n.id, false); else if (r.parent != null) move(r.parent); }
    else if (e.key === ' ' && checkable) { e.preventDefault(); toggleCheck(r.n); }
    else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); choose(r.n); }
    else if (e.key === '*') { e.preventDefault(); const s = new Set(open); rows.filter((x) => x.parent === r.parent && x.n.children).forEach((x) => s.add(x.n.id)); setOpen(s); }
  };
  return (
    <>
    <ul ref={root} role="tree" aria-label={label} aria-multiselectable={checkable || undefined} className={cx('vui-tree', checkable && 'vui-tree--checkable', className)} onKeyDown={onKey}>
      {rows.map(({ n, level, pos, size, status }) => {
        if (status) return (
          <li key={n.id} data-id={n.id} role="treeitem" aria-level={level} aria-disabled={status.kind === 'loading' || undefined} tabIndex={focus === n.id ? 0 : -1} className={cx('vui-tree__row', 'vui-tree__row--status', status.kind === 'error' && 'vui-tree__row--error')} style={{ '--lvl': level - 1 }} onFocus={() => setFocus(n.id)}>
            <span className="vui-tree__caret vui-tree__caret--leaf" aria-hidden="true" />
            {status.kind === 'loading' ? <><span className="vui-loader vui-loader--ring vui-loader--sm" aria-hidden="true" /><span className="vui-tree__label">Loading…</span></> : <><Glyph name="alert-circle" className="vui-tree__icon" /><span className="vui-tree__label">{status.message}</span><Button variant="ghost" size="sm" className="vui-tree__retry" tabIndex={-1} onClick={(e) =>{ e.stopPropagation(); fetchKids(n.owner); }}>Retry</Button></>}
          </li>
        );
        const has = (n.children && n.children.length) || n.lazy;
        const isOpen = has && open.has(n.id);
        const cs = checkable ? chkState(n) : null;
        return (
          <li key={n.id} data-id={n.id} role="treeitem" aria-level={level} aria-setsize={size} aria-posinset={pos} aria-expanded={has ? isOpen : undefined} aria-selected={checkable ? undefined : sel === n.id} aria-checked={checkable ? (cs === 'mixed' ? 'mixed' : cs === 'on') : undefined}
            tabIndex={focus === n.id ? 0 : -1} {...dnd(n)} aria-roledescription={onMove ? 'movable item' : undefined} className={cx('vui-tree__row', sel === n.id && 'vui-tree__row--sel', drag === n.id && 'vui-tree__row--dragging', drop && drop.id === n.id && 'vui-tree__row--drop-' + drop.p)} style={{ '--lvl': level - 1 }}
            onClick={() => { setFocus(n.id); if (checkable) { if (has) toggle(n.id); else toggleCheck(n); return; } choose(n); if (has) toggle(n.id); }} onFocus={() => setFocus(n.id)}>
            {Array.from({ length: level - 1 }).map((_, k) => <span key={k} className="vui-tree__guide" style={{ left: 17 + k * 20 }} aria-hidden="true" />)}
            <span className={cx('vui-tree__caret', isOpen && 'vui-tree__caret--open', !has && 'vui-tree__caret--leaf')} aria-hidden="true">{has && <Chevron direction="right" open={isOpen} />}</span>
            {checkable && <Checkmark size="sm" className="vui-tree__check" checked={cs === 'on'} indeterminate={cs === 'mixed'} onClick={(e) => { e.stopPropagation(); setFocus(n.id); toggleCheck(n); }} />}
            {(!checkable || n.icon) && <Glyph name={(n.icon || (has ? 'folder' : 'file'))} className="vui-tree__icon" />}
            <span className="vui-tree__label">{n.label}</span>
            {n.meta != null && <span className="vui-tree__meta">{n.meta}</span>}
          </li>
        );
      })}
    </ul>
    {onMove && <span className="vui-sr-only" aria-live="polite">{said}</span>}
    </>
  );
}
