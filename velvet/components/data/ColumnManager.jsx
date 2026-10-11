import React from 'react';
import { SearchInput } from '../forms/SearchInput.jsx';
import { Count } from '../primitives/Count.jsx';
import { Switch } from '../forms/Switch.jsx';
import { Handle } from '../primitives/Handle.jsx';
import { Control } from '../primitives/Control.jsx';
import { SectionLabel } from '../primitives/SectionLabel.jsx';
import { Glyph } from '../primitives/Glyph.jsx';
import { cx } from '../primitives/cx.js';
import { Button } from '../actions/Button.jsx';
import { IconButton } from '../actions/IconButton.jsx';
const norm = (cols) => cols.map((c) => ({ key: c.key, visible: c.visible !== false, pin: c.pin || null }));
const ZONES = [['left', 'Pinned left'], [null, 'Columns'], ['right', 'Pinned right']];
export function applyColumns(columns, state) {
  const order = [...state.filter((s) => s.pin === 'left'), ...state.filter((s) => !s.pin), ...state.filter((s) => s.pin === 'right')];
  return order.filter((s) => s.visible).map((s) => { const c = columns.find((x) => x.key === s.key); return c && { ...c, pin: s.pin || undefined }; }).filter(Boolean);
}
export const ApplyColumns = applyColumns;
const capsOf = (m) => ({ hide: !m.locked && m.hideable !== false, pin: !m.locked && m.pinnable !== false, move: !m.locked && m.movable !== false });
export function ColumnManager({ columns = [], value, defaultValue, resetValue, onChange: onChangeProp, onValueChange, title = 'Columns', pinRight = false, maxPinned, searchable, className }) {
  const onChange = onChangeProp || onValueChange;
  const initial = React.useMemo(() => norm(columns), []);
  const [inner, setInner] = React.useState(() => defaultValue || initial);
  const cur = value !== undefined ? value : inner;
  const set = (v) => { if (value === undefined) setInner(v); onChange && onChange(v); };
  const meta = (k) => columns.find((c) => c.key === k) || { label: k };
  const caps = (k) => capsOf(meta(k));
  const zoneOk = (key, z) => { const c = cur.find((x) => x.key === key); return !!c && ((c.pin || null) === z || caps(key).pin); };
  const [q, setQ] = React.useState('');
  const [drag, setDrag] = React.useState(null);
  const [over, setOver] = React.useState(null);
  const [msg, setMsg] = React.useState('');
  const rootRef = React.useRef(null);
  const showSearch = searchable ?? columns.length > 8;
  const zones = ZONES.filter(([z]) => z !== 'right' || pinRight || cur.some((c) => c.pin === 'right'));
  const inZone = (z) => cur.filter((c) => (c.pin || null) === z);
  const pinnedCount = cur.filter((c) => c.pin).length;
  const name = (k) => { const l = meta(k).label; return typeof l === 'string' ? l : k; };
  // Rebuild state from zone lists so order is always left → middle → right
  const rebuild = (lists) => set([...lists.left, ...lists.mid, ...lists.right]);
  const lists = () => ({ left: inZone('left'), mid: inZone(null), right: inZone('right') });
  const zk = (z) => (z === 'left' ? 'left' : z === 'right' ? 'right' : 'mid');
  const moveTo = (key, z, idx) => {
    const L = lists(); const from = cur.find((c) => c.key === key); if (!from) return;
    Object.keys(L).forEach((k) => (L[k] = L[k].filter((c) => c.key !== key)));
    const t = L[zk(z)]; const item = { ...from, pin: z }; t.splice(idx == null ? t.length : Math.max(0, Math.min(idx, t.length)), 0, item);
    rebuild(L);
  };
  const togglePin = (c) => {
    if (c.pin) { moveTo(c.key, null, 0); setMsg(name(c.key) + ' unpinned'); return; }
    if (maxPinned != null && pinnedCount >= maxPinned) { setMsg('You can pin up to ' + maxPinned + ' columns'); return; }
    moveTo(c.key, 'left'); setMsg(name(c.key) + ' pinned left');
  };
  const toggleVis = (c) => set(cur.map((x) => (x.key === c.key ? { ...x, visible: !x.visible } : x)));
  const focusGrip = (key) => requestAnimationFrame(() => { const b = rootRef.current && rootRef.current.querySelector('[data-grip="' + key + '"]'); b && b.focus(); });
  const keyMove = (e, c) => {
    const z = c.pin || null; const list = inZone(z); const i = list.findIndex((x) => x.key === c.key);
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault(); const d = e.key === 'ArrowUp' ? -1 : 1; const to = i + d;
      if (!caps(c.key).move) return;
      if (to >= 0 && to < list.length) { if (!caps(list[to].key).move) return; moveTo(c.key, z, to); setMsg(name(c.key) + ' moved to position ' + (to + 1)); }
      else { const zi = zones.findIndex(([x]) => x === z); const nz = zones[zi + d]; if (nz && zoneOk(c.key, nz[0]) && !(nz[0] && maxPinned != null && !z && pinnedCount >= maxPinned)) { moveTo(c.key, nz[0], d < 0 ? undefined : 0); setMsg(name(c.key) + ' moved to ' + nz[1].toLowerCase()); } }
      focusGrip(c.key);
    }
  };
  const visible = cur.filter((c) => c.visible).length;
  const ql = q.trim().toLowerCase();
  const rowsFor = (z) => inZone(z).filter((c) => !ql || name(c.key).toLowerCase().includes(ql));
  const Row = ({ c, i, z }) => {
    const m = meta(c.key); const cp = caps(c.key); const lastOn = c.visible && visible <= 1;
    const atMax = !c.pin && maxPinned != null && pinnedCount >= maxPinned;
    return (
      <li className={cx('vui-colman__item', !c.visible && 'vui-colman__item--off', drag === c.key && 'vui-colman__item--drag', over && over.key === c.key && drag && drag !== c.key && 'vui-colman__item--' + over.pos)}
        draggable={cp.move} onDragStart={(e) => { setDrag(c.key); e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', c.key); }}
        onDragOver={(e) => { if (!drag) return; e.preventDefault(); e.stopPropagation(); const r = e.currentTarget.getBoundingClientRect(); setOver({ key: c.key, z, i, pos: e.clientY < r.top + r.height / 2 ? 'above' : 'below' }); }}
        onDragEnd={() => { setDrag(null); setOver(null); }}
        onDrop={(e) => { e.preventDefault(); e.stopPropagation(); if (drag && over && zoneOk(drag, z)) { const list = inZone(z).filter((x) => x.key !== drag); let idx = list.findIndex((x) => x.key === c.key); if (over.pos === 'below') idx++; if (!(z && !cur.find((x) => x.key === drag).pin && maxPinned != null && pinnedCount >= maxPinned)) moveTo(drag, z, idx); } setDrag(null); setOver(null); }}>
        <Handle data-grip={c.key} className="vui-colman__grip" icon={cp.move ? 'grip-vertical' : 'lock'} disabled={!cp.move} label={'Reorder ' + name(c.key) + '. Arrow keys move it, across sections too.'} onKeyDown={(e) => keyMove(e, c)} />
        <span className="vui-colman__name">{m.label}</span>
        <IconButton size="xs" icon="pin" label={(c.pin ? 'Unpin ' : 'Pin ') + name(c.key)} title={atMax ? 'Pin limit reached' : c.pin ? 'Unpin' : 'Pin left'} className={cx('vui-colman__pin', c.pin && 'vui-colman__pin--on')} disabled={!cp.pin || atMax} aria-pressed={!!c.pin} onClick={() => togglePin(c)} />
        <Switch size="sm" aria-label={'Show ' + name(c.key)} title={lastOn ? 'At least one column stays visible' : undefined} checked={c.visible} disabled={!cp.hide || lastOn} onChange={() => toggleVis(c)} />
      </li>
    );
  };
  return (
    <div ref={rootRef} className={cx('vui-colman', className)}>
      <div className="vui-colman__head">
        <span className="vui-colman__title">{title}</span>
        <Button variant="link" size="xs" onClick={() => { set(resetValue || initial); setQ(''); setMsg('Columns reset'); }}>Reset</Button>
      </div>
      {showSearch && <SearchInput size="sm" className="vui-colman__search" placeholder="Find a column…" aria-label="Find a column" value={q} onValueChange={setQ} />}
      <div className="vui-colman__body">
        {zones.map(([z, label]) => {
          const rows = rowsFor(z); const all = inZone(z);
          if (ql && !rows.length) return null;
          return (
            <section key={label} className={cx('vui-colman__zone', z && 'vui-colman__zone--pinned')} aria-label={label}>
              <SectionLabel className="vui-colman__sec" end={z && all.length > 0 ? <Count value={all.length} size="sm" tone="soft" /> : null}>{label}</SectionLabel>
              <ul className="vui-colman__list" onDragOver={(e) => { if (drag && !all.length) { e.preventDefault(); setOver({ key: null, z, i: 0, pos: 'below' }); } }} onDrop={(e) => { if (drag && !all.length && zoneOk(drag, z)) { e.preventDefault(); moveTo(drag, z, 0); setDrag(null); setOver(null); } }}>
                {rows.map((c, i) => <Row key={c.key} c={c} i={i} z={z} />)}
                {!all.length && <li className={cx('vui-colman__drop', drag && over && over.z === z && 'vui-colman__drop--on')}>{z ? 'Drag a column here or use its pin' : 'All columns are pinned'}</li>}
              </ul>
            </section>
          );
        })}
      </div>
      <div className="vui-colman__foot">
        <span>{visible + ' of ' + cur.length + ' visible'}</span>
        <span>{pinnedCount ? pinnedCount + ' pinned' + (maxPinned != null ? ' of ' + maxPinned : '') : 'Nothing pinned'}</span>
      </div>
      <span className="vui-sr-only" aria-live="polite">{msg}</span>
    </div>
  );
}
