import React from 'react';
import { Checkbox } from '../forms/Checkbox.jsx';
import { Skeleton } from '../feedback/Skeleton.jsx';
import { Button } from '../actions/Button.jsx';
import { Glyph } from '../primitives/Glyph.jsx';
import { cx } from '../primitives/cx.js';
import { ColumnResize } from '../primitives/ColumnResize.jsx';
export function Table({ columns = [], rows = [], rowKey = 'id', selectable = false, selected = [], onSelectedChange, bulkActions, sort, defaultSort, onSortChange, loading = false, loadingRows = 4, empty = 'Nothing here yet.', title, count, toolbar, resizable = false, renderExpanded, maxHeight, stickyHeader, className }) {
  const [innerSort, setInnerSort] = React.useState(defaultSort || null);
  const curSort = sort !== undefined ? sort : innerSort;
  const [widths, setWidths] = React.useState({});
  const [expanded, setExpanded] = React.useState([]);
  const lastIdx = React.useRef(null);
  const bodyRef = React.useRef(null);
  const theadRef = React.useRef(null);
  const scrollRef = React.useRef(null);
  const [pinOff, setPinOff] = React.useState({});
  const [scrolled, setScrolled] = React.useState({ l: false, r: false });
  const hasPins = columns.some((c) => c.pin);
  const pinSig = columns.map((c) => c.key + ':' + (c.pin || '')).join('|');
  React.useLayoutEffect(() => {
    if (!hasPins || !theadRef.current) { setPinOff({}); return; }
    const measure = () => {
      const ths = [...theadRef.current.querySelectorAll('th')];
      const lead = (selectable ? 1 : 0); const o = {}; let x = 0;
      if (selectable && ths[0]) { o.__check = 0; x += ths[0].getBoundingClientRect().width; }
      columns.forEach((c, i) => { if (c.pin === 'left') { o[c.key] = { side: 'left', v: x }; x += ths[i + lead].getBoundingClientRect().width; } });
      let y = renderExpanded && ths[ths.length - 1] ? ths[ths.length - 1].getBoundingClientRect().width : 0;
      for (let i = columns.length - 1; i >= 0; i--) { const c = columns[i]; if (c.pin === 'right') { o[c.key] = { side: 'right', v: y }; y += ths[i + lead].getBoundingClientRect().width; } }
      const lastL = [...columns].reverse().find((c) => c.pin === 'left'); const firstR = columns.find((c) => c.pin === 'right');
      if (lastL) o[lastL.key].edge = true; if (firstR) o[firstR.key].edge = true;
      setPinOff(o);
    };
    measure();
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(measure); ro.observe(theadRef.current); return () => ro.disconnect();
  }, [pinSig, selectable, widths, hasPins]);
  const onScroll = () => { const el = scrollRef.current; if (!el || !hasPins) return; const l = el.scrollLeft > 0, r = el.scrollLeft < el.scrollWidth - el.clientWidth - 1; if (l !== scrolled.l || r !== scrolled.r) setScrolled({ l, r }); };
  React.useEffect(onScroll, [pinSig, pinOff]);
  const pinStyle = (c, base) => { const p = pinOff[c.key]; return p ? { ...base, position: 'sticky', [p.side]: p.v } : base; };
  const pinCls = (c) => { const p = pinOff[c.key]; return p && cx('vui-table__pin', 'vui-table__pin--' + p.side, p.edge && 'vui-table__pin--edge'); };
  const checkPin = hasPins && columns.some((c) => c.pin === 'left') && selectable;
  const sorted = React.useMemo(() => {
    if (!curSort || onSortChange && sort !== undefined) return rows;
    const col = columns.find((c) => c.key === curSort.key); if (!col) return rows;
    const get = col.sortValue || ((r) => r[col.key]);
    const out = [...rows].sort((a, b) => { const x = get(a), y = get(b); return typeof x === 'number' && typeof y === 'number' ? x - y : String(x ?? '').localeCompare(String(y ?? ''), undefined, { numeric: true }); });
    return curSort.dir === 'desc' ? out.reverse() : out;
  }, [rows, columns, curSort, sort, onSortChange]);
  const allOn = rows.length > 0 && rows.every((r) => selected.includes(r[rowKey]));
  const someOn = !allOn && rows.some((r) => selected.includes(r[rowKey]));
  const setSel = (v) => onSelectedChange && onSelectedChange(v);
  const toggle = (k) => setSel(selected.includes(k) ? selected.filter((x) => x !== k) : [...selected, k]);
  const clickCheck = (e, i, k) => {
    if (e.shiftKey && lastIdx.current != null) {
      const [a, b] = [Math.min(lastIdx.current, i), Math.max(lastIdx.current, i)];
      const keys = sorted.slice(a, b + 1).map((r) => r[rowKey]);
      const on = !selected.includes(k);
      setSel(on ? Array.from(new Set([...selected, ...keys])) : selected.filter((x) => !keys.includes(x)));
    } else toggle(k);
    lastIdx.current = i;
  };
  const toggleAll = () => setSel(allOn ? [] : rows.map((r) => r[rowKey]));
  const toggleExp = (k) => setExpanded((x) => (x.includes(k) ? x.filter((y) => y !== k) : [...x, k]));
  const cycleSort = (key) => {
    const next = !curSort || curSort.key !== key ? { key, dir: 'asc' } : curSort.dir === 'asc' ? { key, dir: 'desc' } : null;
    if (sort === undefined) setInnerSort(next); onSortChange && onSortChange(next);
  };
  const onRowKey = (e, k) => {
    if (e.target !== e.currentTarget) return;
    const trs = [...bodyRef.current.querySelectorAll('tr[tabindex]')]; const i = trs.indexOf(e.currentTarget);
    if (e.key === 'ArrowDown' && trs[i + 1]) { e.preventDefault(); trs[i + 1].focus(); }
    else if (e.key === 'ArrowUp' && trs[i - 1]) { e.preventDefault(); trs[i - 1].focus(); }
    else if (renderExpanded && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) { e.preventDefault(); const open = expanded.includes(k); if ((e.key === 'ArrowRight') !== open) toggleExp(k); }
    else if (selectable && (e.key === ' ' || e.key === 'Enter')) { e.preventDefault(); toggle(k); }
    else if (selectable && e.key === 'a' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); setSel(rows.map((r) => r[rowKey])); }
    else if (selectable && e.key === 'Escape') setSel([]);
  };
  const cellCls = (c) => cx(c.align === 'right' && 'vui-table__num', c.hideOnMobile && 'vui-hide-sm', pinCls(c));
  const span = columns.length + (selectable ? 1 : 0) + (renderExpanded ? 1 : 0);
  const sticky = stickyHeader ?? !!maxHeight;
  const anyWidth = Object.keys(widths).length > 0;
  const showHead = title || toolbar || count != null || (resizable && anyWidth);
  return (
    <div className={cx('vui-table-wrap', className)}>
      {showHead && (
        <div className="vui-table__toolbar">
          {title && <span className="vui-table__title">{title}</span>}
          {(count ?? (title ? rows.length : null)) != null && <span className="vui-table__count">{count ?? rows.length}</span>}
          <div className="vui-table__tools">
            {resizable && anyWidth && <Button variant="secondary" size="sm" onClick={() =>setWidths({})}>Reset widths</Button>}
            {toolbar}
          </div>
        </div>
      )}
      {selectable && bulkActions && selected.length > 0 && (
        <div className="vui-table__bulk" role="region" aria-label="Bulk actions">
          <span>{selected.length} selected</span>
          <div className="vui-table__bulk-actions">{bulkActions}</div>
          <Button variant="ghost" size="sm" onClick={() =>setSel([])}>Clear</Button>
        </div>
      )}
      <div ref={scrollRef} onScroll={onScroll} className={cx('vui-table__scroll', scrolled.l && 'vui-table__scroll--l', scrolled.r && 'vui-table__scroll--r')} style={maxHeight ? { maxHeight, overflowY: 'auto' } : undefined}>
        <table className={cx('vui-table', sticky && 'vui-table--sticky', anyWidth && 'vui-table--fixed', hasPins && 'vui-table--pins')} aria-busy={loading || undefined}>
          <thead ref={theadRef}><tr>
            {selectable && <th className={cx('vui-table__check', checkPin && 'vui-table__pin vui-table__pin--left')} style={checkPin ? { position: 'sticky', left: 0 } : undefined}><Checkbox aria-label="Select all" checked={allOn} onChange={toggleAll} disabled={loading} indeterminate={someOn} /></th>}
            {columns.map((c) => {
              const on = curSort && curSort.key === c.key;
              const w = widths[c.key] ?? c.width;
              const handle = resizable && <ColumnResize label={'Resize ' + (typeof c.label === 'string' ? c.label : c.key)} width={widths[c.key]} onResize={(w) => setWidths((x) => ({ ...x, [c.key]: w }))} onReset={() => setWidths(({ [c.key]: _, ...rest }) => rest)} />;
              return c.sortable
                ? <th key={c.key} className={cx(cellCls(c), 'vui-table__sortable')} style={pinStyle(c, { width: w })} aria-sort={on ? (curSort.dir === 'asc' ? 'ascending' : 'descending') : undefined}>
                    <button type="button" className="vui-table__sort" onClick={() => cycleSort(c.key)}>{c.label}<Glyph name="arrow-up" /></button>{handle}
                  </th>
                : <th key={c.key} className={cellCls(c)} style={pinStyle(c, { width: w })}>{c.label}{handle}</th>;
            })}
            {renderExpanded && <th className="vui-table__exp" aria-label="Details" />}
          </tr></thead>
          <tbody ref={bodyRef}>
            {loading && Array.from({ length: loadingRows }).map((_, i) => (
              <tr key={'sk' + i}>{selectable && <td><Skeleton width={18} height={18} /></td>}{columns.map((c, j) => <td key={c.key} className={cellCls(c)}><Skeleton width={[72, 56, 40, 64][(i + j) % 4] + '%'} style={{ marginLeft: c.align === 'right' ? 'auto' : 0 }} /></td>)}{renderExpanded && <td />}</tr>
            ))}
            {!loading && sorted.map((r, i) => { const k = r[rowKey]; const on = selected.includes(k); const open = renderExpanded && expanded.includes(k); return (
              <React.Fragment key={k ?? i}>
                <tr tabIndex={0} aria-selected={selectable ? on : undefined} aria-expanded={renderExpanded ? !!open : undefined} className={cx(open && 'vui-table__row--open')} onKeyDown={(e) => onRowKey(e, k)}>
                  {selectable && <td className={checkPin ? 'vui-table__pin vui-table__pin--left' : undefined} style={checkPin ? { position: 'sticky', left: 0 } : undefined}><Checkbox tabIndex={-1} aria-label="Select row" checked={on} onClick={(e) => { e.preventDefault(); clickCheck(e, i, k); }} onChange={() => {}} /></td>}
                  {columns.map((c) => <td key={c.key} className={cellCls(c)} style={pinStyle(c)}>{c.render ? c.render(r) : r[c.key]}</td>)}
                  {renderExpanded && <td className="vui-table__exp"><button type="button" tabIndex={-1} className="vui-table__expbtn" aria-label={open ? 'Collapse row' : 'Expand row'} aria-expanded={!!open} onClick={() => toggleExp(k)}><Glyph name="chevron-down" /></button></td>}
                </tr>
                {open && <tr className="vui-table__detail"><td colSpan={span}><div className="vui-table__detail-in">{renderExpanded(r)}</div></td></tr>}
              </React.Fragment>
            ); })}
            {!loading && !rows.length && <tr><td className="vui-table__empty" colSpan={span}>{empty}</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
