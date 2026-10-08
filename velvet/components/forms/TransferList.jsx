import React from 'react';
import { SearchInput } from './SearchInput.jsx';
import { Checkmark } from '../primitives/Checkmark.jsx';
import { Meter } from '../primitives/Meter.jsx';
import { SectionLabel } from '../primitives/SectionLabel.jsx';
import { Glyph } from '../primitives/Glyph.jsx';
import { EmptyText } from '../primitives/EmptyText.jsx';
import { Handle } from '../primitives/Handle.jsx';
import { CloseButton } from '../primitives/CloseButton.jsx';
import { highlightMatch } from '../primitives/Mark.jsx';
import { cx } from '../primitives/cx.js';
const norm = (s) => String(s ?? '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
const text = (i) => [typeof i.label === 'string' ? i.label : '', i.description, i.meta, i.group, i.keywords].filter(Boolean).join(' ');
function Panel({ side, title, items, q, setQ, mark, setMark, onMove, moveLabel, onDropIn, onReorder, orderable, height, searchable, placeholder, empty, limitHit, focusKey, renderItem, groupBy }) {
  const lid = React.useId();
  const [focus, setFocus] = React.useState(0);
  const [drop, setDrop] = React.useState(null);
  const anchor = React.useRef(null);
  const listRef = React.useRef(null);
  const vis = React.useMemo(() => (q ? items.filter((i) => norm(text(i)).includes(norm(q))) : items), [items, q]);
  const enabled = vis.filter((i) => !i.disabled);
  const on = enabled.filter((i) => mark.has(i.value));
  React.useEffect(() => { if (focus >= vis.length) setFocus(Math.max(0, vis.length - 1)); }, [vis.length]);
  const toggle = (i, e) => {
    if (i.disabled) return;
    const n = new Set(mark); const idx = vis.indexOf(i);
    if (e && e.shiftKey && anchor.current != null) { const [a, b] = [anchor.current, idx].sort((x, y) => x - y); vis.slice(a, b + 1).forEach((x) => !x.disabled && n.add(x.value)); }
    else { n.has(i.value) ? n.delete(i.value) : n.add(i.value); anchor.current = idx; }
    setMark(n); setFocus(idx);
  };
  const all = () => { const n = new Set(mark); const full = on.length === enabled.length; enabled.forEach((i) => (full ? n.delete(i.value) : n.add(i.value))); setMark(n); };
  const focusRow = (k) => { setFocus(k); const el = listRef.current && listRef.current.querySelector('[data-k="' + k + '"]'); el && el.focus({ preventScroll: false }); };
  const onKey = (e) => {
    const i = vis[focus];
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (orderable && e.altKey && i) { onReorder(i.value, e.key === 'ArrowDown' ? 1 : -1); return; }
      const k = Math.max(0, Math.min(vis.length - 1, focus + (e.key === 'ArrowDown' ? 1 : -1))); focusRow(k);
      if (e.shiftKey && vis[k] && !vis[k].disabled) setMark(new Set([...mark, vis[k].value]));
    } else if (e.key === 'Home' || e.key === 'End') { e.preventDefault(); focusRow(e.key === 'Home' ? 0 : vis.length - 1); }
    else if (e.key === ' ') { e.preventDefault(); i && toggle(i); }
    else if (e.key === 'Enter') { e.preventDefault(); onMove(on.length ? on.map((x) => x.value) : i && !i.disabled ? [i.value] : []); }
    else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'a') { e.preventDefault(); all(); }
  };
  const dragStart = (e, i) => {
    if (i.disabled) { e.preventDefault(); return; }
    const vals = mark.has(i.value) ? on.map((x) => x.value) : [i.value];
    e.dataTransfer.setData('application/x-vui-transfer', JSON.stringify({ from: side, vals }));
    e.dataTransfer.effectAllowed = 'move';
  };
  const over = (e, before) => { if ([...e.dataTransfer.types].includes('application/x-vui-transfer')) { e.preventDefault(); setDrop(before ?? '__end'); } };
  const dropIt = (e, before) => {
    e.preventDefault(); e.stopPropagation(); setDrop(null);
    try { const d = JSON.parse(e.dataTransfer.getData('application/x-vui-transfer')); onDropIn(d.from, d.vals, before); } catch (_) {}
  };
  let lastGroup;
  return (
    <section className={cx('vui-xfer__panel', drop && 'vui-xfer__panel--drop', limitHit && side === 'right' && 'vui-xfer__panel--full')} aria-labelledby={lid}
      onDragOver={(e) => over(e)} onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setDrop(null); }} onDrop={(e) => dropIt(e)}>
      <header className="vui-xfer__head">
        <span role="checkbox" tabIndex={0} aria-checked={on.length && on.length === enabled.length ? true : on.length ? 'mixed' : false} aria-disabled={!enabled.length || undefined} aria-label={'Select all in ' + title}
          className={cx('vui-checkmark', on.length && on.length === enabled.length && 'vui-checkmark--on', on.length > 0 && on.length < enabled.length && 'vui-checkmark--mixed')}
          onClick={() => enabled.length && all()} onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); enabled.length && all(); } }} />
        <h3 id={lid} className="vui-xfer__title">{title}</h3>
        <span className="vui-xfer__count">{on.length ? <><b>{on.length}</b> / </> : null}{items.length}</span>
      </header>
      {searchable && (
        <div className="vui-xfer__search"><SearchInput size="sm" value={q} onValueChange={setQ} placeholder={placeholder} aria-label={'Search ' + title} onKeyDown={(e) => { if (e.key === 'ArrowDown') { e.preventDefault(); focusRow(0); } if (e.key === 'Escape' && q) { e.stopPropagation(); setQ(''); } }} /></div>
      )}
      <ul ref={listRef} className="vui-xfer__list" role="listbox" aria-multiselectable="true" aria-labelledby={lid} style={{ height }} onKeyDown={onKey}>
        {vis.map((i, k) => {
          const g = groupBy && i.group && i.group !== lastGroup ? (lastGroup = i.group) : null;
          const sel = mark.has(i.value);
          return (
            <React.Fragment key={i.value}>
              {g && <SectionLabel as="li" role="presentation" className="vui-xfer__group">{g}</SectionLabel>}
              <li data-k={k} role="option" aria-selected={sel} aria-disabled={i.disabled || undefined} tabIndex={k === focus ? 0 : -1}
                className={cx('vui-xfer__item', sel && 'vui-xfer__item--on', i.disabled && 'vui-xfer__item--disabled', drop === i.value && 'vui-xfer__item--before')}
                draggable={!i.disabled} onDragStart={(e) => dragStart(e, i)} onDragOver={(e) => orderable && over(e, i.value)} onDrop={(e) => orderable && dropIt(e, i.value)}
                onClick={(e) => toggle(i, e)} onDoubleClick={() => !i.disabled && onMove([i.value])} onFocus={() => setFocus(k)}>
                <Checkmark checked={sel} aria-hidden="true" />
                {renderItem ? renderItem(i, { query: q, selected: sel }) : (
                  <>
                    {(i.avatar || i.icon) && <span className={cx('vui-xfer__lead', i.icon && 'vui-xfer__lead--icon')} aria-hidden="true">{i.icon ? <Glyph name={i.icon} /> : i.avatar}</span>}
                    <span className="vui-xfer__text"><span className="vui-xfer__label">{highlightMatch(i.label, q)}</span>{i.description && <span className="vui-xfer__desc">{highlightMatch(i.description, q)}</span>}</span>
                    {i.meta && <span className="vui-xfer__meta">{i.meta}</span>}
                  </>
                )}
                {orderable && !i.disabled && <Handle decorative className="vui-xfer__grip" />}
              </li>
            </React.Fragment>
          );
        })}
        {!vis.length && <EmptyText as="li" role="presentation" className="vui-xfer__empty">{q ? <>No matches for “{q}”<button type="button" className="vui-xfer__link" onClick={() => setQ('')}>Clear search</button></> : empty}</EmptyText>}
        {drop === '__end' && vis.length > 0 && <li role="presentation" className="vui-xfer__dropline" />}
      </ul>
      <footer className="vui-xfer__foot">
        <button type="button" className="vui-xfer__move" disabled={!on.length || (side === 'left' && limitHit)} onClick={() => onMove(on.map((x) => x.value))}>
          {side === 'right' && <Glyph name="arrow-left" />}{moveLabel}{on.length ? ' ' + on.length : ''}{side === 'left' && <Glyph name="arrow-right" />}
        </button>
        {on.length > 0 && <button type="button" className="vui-xfer__link" onClick={() => setMark(new Set([...mark].filter((v) => !on.some((x) => x.value === v))))}>Deselect</button>}
      </footer>
    </section>
  );
}
export function TransferList({ items = [], value, defaultValue = [], onValueChange, titles = ['Available', 'Selected'], height = 280, label = 'Transfer list', searchable = true, searchPlaceholder = ['Search…', 'Search selected…'], orderable = false, max, groupBy = true, emptyText = ['Everything has been added', 'Nothing selected yet — pick from the left'], moveLabels = ['Add', 'Remove'], renderItem, className }) {
  const [inner, setInner] = React.useState(defaultValue);
  const chosen = value !== undefined ? value : inner;
  const [markL, setMarkL] = React.useState(new Set());
  const [markR, setMarkR] = React.useState(new Set());
  const [qL, setQL] = React.useState(''); const [qR, setQR] = React.useState('');
  const [live, setLive] = React.useState('');
  const byVal = React.useMemo(() => new Map(items.map((i) => [i.value, i])), [items]);
  const dup = items.length !== byVal.size;
  const left = items.filter((i) => !chosen.includes(i.value));
  const right = chosen.map((v) => byVal.get(v)).filter(Boolean);
  const full = max != null && right.length >= max;
  const commit = (v, msg) => { if (dup) return; if (value === undefined) setInner(v); onValueChange && onValueChange(v); msg && setLive(msg); };
  const add = (vals, before) => {
    let ok = vals.filter((v) => !chosen.includes(v) && byVal.get(v) && !byVal.get(v).disabled);
    if (max != null) ok = ok.slice(0, Math.max(0, max - chosen.length));
    if (!ok.length) return;
    const at = before ? chosen.indexOf(before) : -1;
    const next = at < 0 ? [...chosen, ...ok] : [...chosen.slice(0, at), ...ok, ...chosen.slice(at)];
    commit(next, ok.length + (ok.length === 1 ? ' item' : ' items') + ' added to ' + titles[1]); setMarkL(new Set([...markL].filter((v) => !ok.includes(v))));
  };
  const remove = (vals) => {
    const ok = vals.filter((v) => byVal.get(v) && !byVal.get(v).disabled); if (!ok.length) return;
    commit(chosen.filter((v) => !ok.includes(v)), ok.length + (ok.length === 1 ? ' item' : ' items') + ' moved to ' + titles[0]); setMarkR(new Set([...markR].filter((v) => !ok.includes(v))));
  };
  const reorder = (v, d) => { const k = chosen.indexOf(v), j = k + d; if (k < 0 || j < 0 || j >= chosen.length) return; const n = [...chosen]; [n[k], n[j]] = [n[j], n[k]]; commit(n, 'Moved to position ' + (j + 1)); requestAnimationFrame(() => { const el = document.activeElement && document.activeElement.closest('[role=listbox]'); const r = el && el.querySelector('[data-k="' + j + '"]'); r && r.focus(); }); };
  const dropInto = (side) => (from, vals, before) => {
    if (side === 'right' && from === 'left') add(vals, before);
    else if (side === 'left' && from === 'right') remove(vals);
    else if (side === 'right' && from === 'right' && orderable) { const rest = chosen.filter((v) => !vals.includes(v)); const at = before ? rest.indexOf(before) : -1; commit(at < 0 ? [...rest, ...vals] : [...rest.slice(0, at), ...vals, ...rest.slice(at)], 'Reordered'); }
  };
  const sortL = groupBy ? [...left].sort((a, b) => String(a.group ?? '').localeCompare(String(b.group ?? ''))) : left;
  return (
    <div className={cx('vui-xfer', className)} role="group" aria-label={label}>
      {dup && <div className="vui-xfer__err" role="alert"><Glyph name="alert-circle" />Duplicate item values — transfer is disabled until every value is unique.</div>}
      <div className="vui-xfer__grid">
        <Panel side="left" title={titles[0]} items={sortL} q={qL} setQ={setQL} mark={markL} setMark={setMarkL} onMove={(v) => add(v)} moveLabel={moveLabels[0]} onDropIn={dropInto('left')} height={height} searchable={searchable} placeholder={searchPlaceholder[0]} empty={emptyText[0]} limitHit={full} renderItem={renderItem} groupBy={groupBy} />
        <div className="vui-xfer__ctrl" aria-hidden="true"><Glyph name="chevrons-right" /></div>
        <Panel side="right" title={titles[1]} items={right} q={qR} setQ={setQR} mark={markR} setMark={setMarkR} onMove={remove} moveLabel={moveLabels[1]} onDropIn={dropInto('right')} onReorder={reorder} orderable={orderable} height={height} searchable={searchable} placeholder={searchPlaceholder[1]} empty={emptyText[1]} limitHit={full} renderItem={renderItem} />
      </div>
      {max != null && (
        <div className={cx('vui-xfer__limit', full && 'vui-xfer__limit--full')}>
          <Meter size="sm" tone={full ? 'warning' : undefined} value={right.length} max={max} />
          <span>{right.length} of {max}{full ? ' — limit reached' : ' selected'}</span>
        </div>
      )}
      <span className="vui-sr-only" aria-live="polite">{live}</span>
    </div>
  );
}
