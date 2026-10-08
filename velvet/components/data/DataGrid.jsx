import React from 'react';
import { SearchInput } from '../forms/SearchInput.jsx';
import { Count } from '../primitives/Count.jsx';
import { Checkbox } from '../forms/Checkbox.jsx';
import { Control } from '../primitives/Control.jsx';
import { Glyph } from '../primitives/Glyph.jsx';
import { EmptyText } from '../primitives/EmptyText.jsx';
import { Popover } from '../feedback/Popover.jsx';
import { Button } from '../actions/Button.jsx';
import { ColumnManager, applyColumns } from './ColumnManager.jsx';
import { QueryBuilder, emptyQuery } from '../patterns/QueryBuilder.jsx';
import { cx } from '../primitives/cx.js';
import { ColumnResize } from '../primitives/ColumnResize.jsx';
const NOV = ['empty', 'not_empty', 'true', 'false'];
const isActive = (r) => (r.rules ? r.rules.some(isActive) : NOV.includes(r.op) || (r.value !== '' && r.value != null));
const countActive = (r) => (r.rules ? r.rules.reduce((n, x) => n + countActive(x), 0) : isActive(r) ? 1 : 0);
function test(r, row) {
  if (r.rules) { const rs = r.rules.filter(isActive); if (!rs.length) return true; return r.combinator === 'or' ? rs.some((x) => test(x, row)) : rs.every((x) => test(x, row)); }
  const v = row[r.field]; const s = String(v ?? '').toLowerCase(); const q = String(r.value ?? '').toLowerCase(); const n = parseFloat(v), m = parseFloat(r.value); const num = typeof v === 'number';
  switch (r.op) {
    case 'contains': return s.includes(q); case 'not_contains': return !s.includes(q);
    case 'eq': return num ? n === m : s === q; case 'neq': return num ? n !== m : s !== q;
    case 'starts': return s.startsWith(q); case 'empty': return v == null || v === ''; case 'not_empty': return !(v == null || v === '');
    case 'gt': return n > m; case 'gte': return n >= m; case 'lt': return n < m; case 'lte': return n <= m;
    case 'on': return s.slice(0, 10) === q; case 'before': return s < q; case 'after': return s > q;
    case 'true': return !!v; case 'false': return !v; default: return true;
  }
}
const RN = 44, CHK = 40;
export function DataGrid({ columns = [], rows = [], rowKey = 'id', onRowsChange, height = 360, stickyFirst = true, rowNumbers = true, selectable = false, selected, onSelectionChange, bulkActions, renderDetail, searchable = false, searchPlaceholder, filterFields, columnManager = false, onExport, toolbarEnd, footer = false, className }) {
  const [cell, setCell] = React.useState({ r: 0, c: 0 });
  const [edit, setEdit] = React.useState(null);
  const [draft, setDraft] = React.useState('');
  const [widths, setWidths] = React.useState(() => Object.fromEntries(columns.map((c) => [c.key, c.width || 160])));
  const [sort, setSort] = React.useState(null);
  const [q, setQ] = React.useState('');
  const [query, setQuery] = React.useState(() => (filterFields ? emptyQuery(filterFields) : null));
  const [colState, setColState] = React.useState(() => { const anyPin = columns.some((c) => c.pin); return columns.map((c, i) => ({ key: c.key, visible: !c.hidden, pin: c.pin || (!anyPin && stickyFirst && i === 0 ? 'left' : null) })); });
  const [selInner, setSelInner] = React.useState([]);
  const sel = new Set(selected !== undefined ? selected : selInner);
  const [open, setOpen] = React.useState(() => new Set());
  const [scrolled, setScrolled] = React.useState(false);
  const grid = React.useRef(null);
  const cols = React.useMemo(() => applyColumns(columns, colState), [columns, colState]);
  const view = React.useMemo(() => {
    let out = rows;
    const t = q.trim().toLowerCase();
    if (t) out = out.filter((r) => cols.some((c) => String(r[c.key] ?? '').toLowerCase().includes(t)));
    if (query && countActive(query)) out = out.filter((r) => test(query, r));
    if (sort) { const k = sort.key; const typed = columns.find((c) => c.key === k); out = [...out].sort((a, b) => { const x = a[k], y = b[k]; return typeof x === 'number' ? x - y : String(x ?? '').localeCompare(String(y ?? ''), undefined, { numeric: true }); }); if (sort.dir < 0) out.reverse(); }
    return out;
  }, [rows, sort, q, query, cols]);
  const setSel = (s) => { const v = [...s]; if (selected === undefined) setSelInner(v); onSelectionChange && onSelectionChange(v); };
  const allOn = view.length > 0 && view.every((r) => sel.has(r[rowKey]));
  const someOn = !allOn && view.some((r) => sel.has(r[rowKey]));
  const toggleAll = () => { const s = new Set(sel); view.forEach((r) => (allOn ? s.delete(r[rowKey]) : s.add(r[rowKey]))); setSel(s); };
  const toggleRow = (k) => { const s = new Set(sel); s.has(k) ? s.delete(k) : s.add(k); setSel(s); };
  const toggleOpen = (k) => setOpen((o) => { const n = new Set(o); n.has(k) ? n.delete(k) : n.add(k); return n; });
  const focusCell = (r, c) => { setCell({ r, c }); requestAnimationFrame(() => { const el = grid.current && grid.current.querySelector('[data-rc="' + r + '-' + c + '"]'); el && el.focus(); }); };
  const startEdit = (r, c, seed) => { if (!cols[c] || !cols[c].editable) return; setEdit({ r, c }); setDraft(seed ?? String(view[r][cols[c].key] ?? '')); };
  const commit = (move) => {
    if (!edit) return;
    const col = cols[edit.c]; const row = view[edit.r];
    let v = draft; if (col.type === 'number') { const n = parseFloat(String(draft).replace(',', '.')); v = isNaN(n) ? row[col.key] : n; }
    if (v !== row[col.key]) onRowsChange && onRowsChange(rows.map((x) => (x[rowKey] === row[rowKey] ? { ...x, [col.key]: v } : x)), { row: row[rowKey], key: col.key, value: v });
    const { r, c } = edit; setEdit(null);
    if (move === 'down') focusCell(Math.min(view.length - 1, r + 1), c); else if (move === 'right') focusCell(r, Math.min(cols.length - 1, c + 1)); else focusCell(r, c);
  };
  const onKey = (e) => {
    if (edit || !e.target.matches('[role="gridcell"]')) return;
    const { r, c } = cell; const R = view.length - 1, C = cols.length - 1;
    const go = (nr, nc) => { e.preventDefault(); focusCell(Math.max(0, Math.min(R, nr)), Math.max(0, Math.min(C, nc))); };
    if (e.key === 'ArrowDown') go(r + 1, c); else if (e.key === 'ArrowUp') go(r - 1, c); else if (e.key === 'ArrowRight') go(r, c + 1); else if (e.key === 'ArrowLeft') go(r, c - 1);
    else if (e.key === 'Home') go(e.ctrlKey ? 0 : r, 0); else if (e.key === 'End') go(e.ctrlKey ? R : r, C);
    else if (e.key === 'PageDown') go(r + 10, c); else if (e.key === 'PageUp') go(r - 10, c);
    else if (e.key === ' ' && selectable) { e.preventDefault(); toggleRow(view[r][rowKey]); }
    else if (e.key === 'Enter' || e.key === 'F2') { e.preventDefault(); if (cols[c].editable) startEdit(r, c); else if (renderDetail) toggleOpen(view[r][rowKey]); }
    else if ((e.key === 'Delete' || e.key === 'Backspace') && cols[c].editable) { e.preventDefault(); startEdit(r, c, ''); }
    else if (e.key.length === 1 && !e.metaKey && !e.ctrlKey && cols[c].editable) { e.preventDefault(); startEdit(r, c, e.key); }
    else if ((e.metaKey || e.ctrlKey) && e.key === 'c') { const v = view[r][cols[c].key]; navigator.clipboard && navigator.clipboard.writeText(String(v ?? '')); }
  };
  const exportCsv = () => {
    if (onExport) return onExport(view, cols);
    const esc = (v) => '"' + String(v ?? '').replace(/"/g, '""') + '"';
    const csv = [cols.map((c) => esc(typeof c.label === 'string' ? c.label : c.key)).join(','), ...view.map((r) => cols.map((c) => esc(r[c.key])).join(','))].join('\n');
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' })); a.download = 'export.csv'; a.click(); URL.revokeObjectURL(a.href);
  };
  const lead = (rowNumbers ? RN : 0) + (selectable ? CHK : 0);
  const pinLeft = {}; let acc = lead, lastPin = null;
  cols.forEach((c) => { if (c.pin === 'left') { pinLeft[c.key] = acc; acc += widths[c.key] || 160; lastPin = c.key; } });
  const tpl = [rowNumbers && RN + 'px', selectable && CHK + 'px', ...cols.map((c) => (widths[c.key] || 160) + 'px')].filter(Boolean).join(' ');
  const pinCls = (c) => c.pin === 'left' && cx('vui-grid__pin', c.key === lastPin && 'vui-grid__pin--last');
  const pinSty = (c) => (c.pin === 'left' ? { left: pinLeft[c.key] } : undefined);
  const nFilters = query ? countActive(query) : 0;
  const nSel = rows.filter((r) => sel.has(r[rowKey])).length;
  const hasToolbar = searchable || filterFields || columnManager || onExport !== undefined || toolbarEnd || (selectable && bulkActions);
  const exportOn = onExport !== undefined;
  return (
    <div className={cx('vui-dgrid', className)}>
      {hasToolbar && (
        <div className="vui-dgrid__bar">
          {selectable && nSel > 0 ? (
            <div className="vui-dgrid__bulk">
              <span className="vui-dgrid__bulk-n"><b>{nSel}</b> selected</span>
              <Button size="sm" variant="ghost" onClick={() => setSel(new Set())}>Clear</Button>
              {bulkActions && bulkActions(rows.filter((r) => sel.has(r[rowKey])))}
            </div>
          ) : searchable && (
            <SearchInput size="sm" className="vui-dgrid__search" aria-label="Filter rows" placeholder={searchPlaceholder || 'Filter ' + rows.length + ' records…'} value={q} onValueChange={setQ} />
          )}
          <div className="vui-dgrid__tools">
            {filterFields && (
              <Popover className="vui-dgrid__pop vui-dgrid__pop--wide" align="end" title="Filters" trigger={<Button size="sm" variant="secondary" iconLeft="filter">Filters{nFilters > 0 && <Count value={nFilters} size="sm" className="vui-dgrid__count" />}</Button>}>
                <QueryBuilder fields={filterFields} value={query} onChange={setQuery} />
                {nFilters > 0 && <div className="vui-dgrid__popfoot"><Button size="sm" variant="ghost" onClick={() => setQuery(emptyQuery(filterFields))}>Reset filters</Button></div>}
              </Popover>
            )}
            {columnManager && (
              <Popover className="vui-dgrid__pop" align="end" trigger={<Button size="sm" variant="secondary" iconLeft="sliders">Columns</Button>}>
                <ColumnManager columns={columns.map((c) => ({ key: c.key, label: c.label, visible: !c.hidden, pin: c.pin, locked: c.locked }))} value={colState} onChange={setColState} />
              </Popover>
            )}
            {exportOn && <Button size="sm" variant="secondary" iconLeft="download" onClick={exportCsv}>Export</Button>}
            {toolbarEnd}
          </div>
        </div>
      )}
      <div ref={grid} role="grid" aria-rowcount={view.length + 1} aria-colcount={cols.length} aria-multiselectable={selectable || undefined}
        className={cx('vui-grid', scrolled && 'vui-grid--scrolled')} style={{ height, '--grid-tpl': tpl }} onKeyDown={onKey} onScroll={(e) => { const s = e.currentTarget.scrollLeft > 2; if (s !== scrolled) setScrolled(s); }}>
        <div role="row" className="vui-grid__row vui-grid__row--head">
          {rowNumbers && <div className="vui-grid__rn" aria-hidden="true">#</div>}
          {selectable && <div className="vui-grid__chk" style={{ left: rowNumbers ? RN : 0 }}><Checkbox aria-label="Select all rows" checked={allOn} indeterminate={someOn} onChange={toggleAll} /></div>}
          {cols.map((c) => (
            <div key={c.key} role="columnheader" aria-sort={sort && sort.key === c.key ? (sort.dir > 0 ? 'ascending' : 'descending') : undefined} className={cx('vui-grid__hd', c.type === 'number' && 'vui-grid__num', pinCls(c))} style={pinSty(c)}>
              <button type="button" tabIndex={-1} className="vui-grid__hbtn" onClick={() => setSort(!sort || sort.key !== c.key ? { key: c.key, dir: 1 } : sort.dir > 0 ? { key: c.key, dir: -1 } : null)}>{c.label}{sort && sort.key === c.key ? <Glyph name={'arrow-' + (sort.dir > 0 ? 'up' : 'down')} className="vui-grid__sort" /> : <Glyph name="chevrons-up-down" className="vui-grid__sort vui-grid__sort--idle" />}{c.editable && <Glyph name="pencil" className="vui-grid__edit-ic" />}</button>
              <ColumnResize label={'Resize ' + (typeof c.label === 'string' ? c.label : c.key)} width={widths[c.key]} onResize={(w) => setWidths((x) => ({ ...x, [c.key]: w }))} />
            </div>
          ))}
        </div>
        {view.length === 0 && <EmptyText className="vui-grid__empty">No rows match{q ? ' “' + q + '”' : ''}{nFilters ? ' and ' + nFilters + ' filter' + (nFilters > 1 ? 's' : '') : ''}.</EmptyText>}
        {view.map((row, r) => {
          const k = row[rowKey]; const isSel = sel.has(k); const isOpen = renderDetail && open.has(k);
          return (
            <React.Fragment key={k}>
              <div role="row" aria-rowindex={r + 2} aria-selected={selectable ? isSel : undefined} aria-expanded={renderDetail ? !!isOpen : undefined} className={cx('vui-grid__row', cell.r === r && 'vui-grid__row--cur', isSel && 'vui-grid__row--sel', isOpen && 'vui-grid__row--open')}>
                {rowNumbers && <div className="vui-grid__rn" aria-hidden="true">{r + 1}</div>}
                {selectable && <div className="vui-grid__chk" style={{ left: rowNumbers ? RN : 0 }}><Checkbox tabIndex={-1} aria-label={'Select row ' + (r + 1)} checked={isSel} onChange={() => toggleRow(k)} /></div>}
                {cols.map((c, ci) => {
                  const on = cell.r === r && cell.c === ci; const editing = edit && edit.r === r && edit.c === ci;
                  const v = row[c.key];
                  return (
                    <div key={c.key} role="gridcell" data-rc={r + '-' + ci} tabIndex={on && !editing ? 0 : -1} aria-readonly={!c.editable || undefined}
                      className={cx('vui-grid__cell', on && 'vui-grid__cell--on', editing && 'vui-grid__cell--edit', c.type === 'number' && 'vui-grid__num', c.editable && 'vui-grid__cell--editable', pinCls(c))} style={pinSty(c)}
                      onClick={() => setCell({ r, c: ci })} onDoubleClick={() => startEdit(r, ci)}>
                      {ci === 0 && renderDetail && !editing && <button type="button" tabIndex={-1} className="vui-grid__exp" aria-label={isOpen ? 'Collapse row' : 'Expand row'} onClick={(e) => { e.stopPropagation(); toggleOpen(k); }}><Glyph name="chevron-right" /></button>}
                      {editing ? (
                        c.options ? (
                          <select autoFocus className="vui-grid__input" value={draft} onChange={(e) => setDraft(e.target.value)} onBlur={() => commit()} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); commit('down'); } else if (e.key === 'Escape') { setEdit(null); focusCell(r, ci); } }}>{c.options.map((o) => <option key={o}>{o}</option>)}</select>
                        ) : (
                          <input autoFocus className="vui-grid__input" value={draft} onChange={(e) => setDraft(e.target.value)} onBlur={() => commit()} inputMode={c.type === 'number' ? 'decimal' : undefined}
                            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); commit('down'); } else if (e.key === 'Tab') { e.preventDefault(); commit('right'); } else if (e.key === 'Escape') { e.preventDefault(); setEdit(null); focusCell(r, ci); } }} />
                        )
                      ) : <span className={cx('vui-grid__val', c.render && 'vui-grid__val--custom')}>{c.render ? c.render(row) : c.format ? c.format(v) : v}</span>}
                    </div>
                  );
                })}
              </div>
              {isOpen && <div role="row" className="vui-grid__row vui-grid__row--detail"><div role="gridcell" className="vui-grid__detail"><div className="vui-grid__detail-in" style={{ paddingLeft: lead + 36 }}>{renderDetail(row)}</div></div></div>}
            </React.Fragment>
          );
        })}
      </div>
      {footer && (
        <div className="vui-dgrid__foot">
          <span aria-live="polite">Showing <b>{view.length}</b> of {rows.length}</span>
          {selectable && nSel > 0 && <span><b>{nSel}</b> selected</span>}
          {typeof footer !== 'boolean' && <span className="vui-dgrid__foot-end">{footer}</span>}
        </div>
      )}
    </div>
  );
}
