import React from 'react';
import { cx } from '../primitives/cx.js';
export function VirtualTable({ columns = [], rows = [], rowHeight = 40, height = 400, overscan = 8, rowKey = 'id', onRowClick, className }) {
  const box = React.useRef(null);
  const [top, setTop] = React.useState(0);
  const [focus, setFocus] = React.useState(-1);
  const count = rows.length;
  const start = Math.max(0, Math.floor(top / rowHeight) - overscan);
  const end = Math.min(count, Math.ceil((top + height) / rowHeight) + overscan);
  const tpl = columns.map((c) => (c.width ? c.width + 'px' : 'minmax(0,' + (c.flex || 1) + 'fr)')).join(' ');
  const goRow = (i) => {
    const n = Math.max(0, Math.min(count - 1, i)); setFocus(n);
    const el = box.current; const y = n * rowHeight + rowHeight;
    if (y - rowHeight < el.scrollTop + rowHeight) el.scrollTop = y - rowHeight * 2; else if (y > el.scrollTop + height) el.scrollTop = y - height;
    requestAnimationFrame(() => { const r = el.querySelector('[data-vi="' + n + '"]'); r && r.focus({ preventScroll: true }); });
  };
  const onKey = (e) => {
    const page = Math.floor(height / rowHeight) - 1;
    const m = { ArrowDown: 1, ArrowUp: -1, PageDown: page, PageUp: -page }[e.key];
    if (m != null) { e.preventDefault(); goRow((focus < 0 ? 0 : focus) + m); }
    else if (e.key === 'Home') { e.preventDefault(); goRow(0); } else if (e.key === 'End') { e.preventDefault(); goRow(count - 1); }
    else if (e.key === 'Enter' && focus >= 0) onRowClick && onRowClick(rows[focus]);
  };
  return (
    <div className={cx('vui-vtable', className)} role="table" aria-rowcount={count + 1}>
      <div role="row" className="vui-vtable__row vui-vtable__row--head" style={{ gridTemplateColumns: tpl }}>
        {columns.map((c) => <div key={c.key} role="columnheader" className={cx('vui-vtable__cell', c.align === 'right' && 'vui-table__num')}>{c.label}</div>)}
      </div>
      <div ref={box} className="vui-vtable__body" style={{ height }} onScroll={(e) => setTop(e.currentTarget.scrollTop)} onKeyDown={onKey} tabIndex={focus < 0 ? 0 : -1} onFocus={(e) => { if (e.target === e.currentTarget && focus < 0) goRow(Math.floor(top / rowHeight)); }}>
        <div style={{ height: count * rowHeight, position: 'relative' }}>
          {rows.slice(start, end).map((r, k) => {
            const i = start + k;
            return (
              <div key={r[rowKey] ?? i} data-vi={i} role="row" aria-rowindex={i + 2} tabIndex={i === focus ? 0 : -1} className={cx('vui-vtable__row', i === focus && 'vui-vtable__row--focus', onRowClick && 'vui-vtable__row--click')}
                style={{ gridTemplateColumns: tpl, height: rowHeight, transform: 'translateY(' + i * rowHeight + 'px)' }} onClick={() => { setFocus(i); onRowClick && onRowClick(r); }}>
                {columns.map((c) => <div key={c.key} role="cell" className={cx('vui-vtable__cell', c.align === 'right' && 'vui-table__num')}>{c.render ? c.render(r, i) : r[c.key]}</div>)}
              </div>
            );
          })}
        </div>
      </div>
      <div className="vui-vtable__foot"><span>{count.toLocaleString()} rows</span><span>Rendering {Math.max(0, end - start)} · rows {count ? (Math.floor(top / rowHeight) + 1).toLocaleString() : 0}–{Math.min(count, Math.ceil((top + height) / rowHeight)).toLocaleString()}</span></div>
    </div>
  );
}
