import React from 'react';
import { EmptyText } from '../primitives/EmptyText.jsx';
import { cx } from '../primitives/cx.js';
export function VirtualList({ items = [], renderItem, itemHeight = 48, getItemHeight, height = 400, overscan = 6, gap = 0, getKey, selectable = false, selected, onSelect, onActivate, onEndReached, endThreshold = 200, loading = false, loadingLabel = 'Loading more…', empty = 'Nothing to show', label, divided = false, className }) {
  const box = React.useRef(null);
  const [top, setTop] = React.useState(0);
  const [focus, setFocus] = React.useState(-1);
  const ih = Number.isFinite(itemHeight) && itemHeight > 0 ? itemHeight : 48;
  const ov = Number.isFinite(overscan) && overscan >= 0 ? Math.floor(overscan) : 6;
  const g = Number.isFinite(gap) && gap >= 0 ? gap : 0;
  const n = items.length;
  const offs = React.useMemo(() => {
    const o = new Float64Array(n + 1);
    for (let i = 0; i < n; i++) { const h = getItemHeight ? +getItemHeight(items[i], i) : ih; o[i + 1] = o[i] + (Number.isFinite(h) && h > 0 ? h : ih) + g; }
    return o;
  }, [items, ih, g, getItemHeight]);
  const keys = React.useMemo(() => {
    const seen = new Set(); let dup = false;
    const k = items.map((it, i) => { let v = getKey ? getKey(it, i) : it && (it.id ?? it.key); if (v == null) v = i; if (seen.has(v)) { dup = true; v = v + '§' + i; } seen.add(v); return v; });
    if (dup && typeof console !== 'undefined') console.warn('VirtualList: duplicate item keys — fell back to key+index. Provide unique ids via getKey.');
    return k;
  }, [items, getKey]);
  const total = n ? offs[n] - g : 0;
  const find = (y) => { let lo = 0, hi = n; while (lo < hi) { const m = (lo + hi) >> 1; if (offs[m + 1] <= y) lo = m + 1; else hi = m; } return lo; };
  const first = n ? find(top) : 0;
  const last = n ? find(top + height) : -1;
  const start = Math.max(0, first - ov), end = Math.min(n, last + 1 + ov);
  const ended = React.useRef(false);
  React.useEffect(() => { ended.current = false; }, [n]);
  const onScroll = (e) => {
    const el = e.currentTarget; setTop(el.scrollTop);
    if (onEndReached && !loading && !ended.current && el.scrollHeight - el.scrollTop - el.clientHeight < endThreshold) { ended.current = true; onEndReached(); }
  };
  const go = (i) => {
    const k = Math.max(0, Math.min(n - 1, i)); setFocus(k); const el = box.current; if (!el) return;
    const y0 = offs[k], y1 = offs[k + 1] - g;
    if (y0 < el.scrollTop) el.scrollTop = y0; else if (y1 > el.scrollTop + el.clientHeight) el.scrollTop = y1 - el.clientHeight;
    requestAnimationFrame(() => { const r = el.querySelector('[data-vi="' + k + '"]'); r && r.focus({ preventScroll: true }); });
  };
  const isSel = (i) => (Array.isArray(selected) ? selected.includes(keys[i]) : selected === keys[i]);
  const onKey = (e) => {
    if (!n) return;
    const page = Math.max(1, last - first);
    const m = { ArrowDown: 1, ArrowUp: -1, PageDown: page, PageUp: -page }[e.key];
    if (m != null) { e.preventDefault(); go((focus < 0 ? first : focus) + m); }
    else if (e.key === 'Home') { e.preventDefault(); go(0); }
    else if (e.key === 'End') { e.preventDefault(); go(n - 1); }
    else if ((e.key === 'Enter' || e.key === ' ') && focus >= 0) { e.preventDefault(); selectable && onSelect && onSelect(keys[focus], items[focus]); e.key === 'Enter' && onActivate && onActivate(items[focus], focus); }
  };
  const role = selectable ? 'listbox' : 'list';
  return (
    <div className={cx('vui-vlist', divided && 'vui-vlist--divided', className)}>
      <div ref={box} className="vui-vlist__scroll" style={{ height }} role={role} aria-label={label} aria-multiselectable={selectable && Array.isArray(selected) ? true : undefined} aria-busy={loading || undefined}
        tabIndex={focus < 0 ? 0 : -1} onScroll={onScroll} onKeyDown={onKey} onFocus={(e) => { if (e.target === e.currentTarget && n) go(first); }}>
        {n === 0 && !loading ? <EmptyText className="vui-vlist__empty">{empty}</EmptyText> : (
          <div className="vui-vlist__inner" style={{ height: total + (loading ? 44 : 0) }}>
            {items.slice(start, end).map((it, k) => {
              const i = start + k, s = isSel(i);
              return (
                <div key={keys[i]} data-vi={i} role={selectable ? 'option' : 'listitem'} aria-selected={selectable ? s : undefined} aria-setsize={n} aria-posinset={i + 1} tabIndex={i === focus ? 0 : -1}
                  className={cx('vui-vlist__item', i === focus && 'vui-vlist__item--focus', s && 'vui-vlist__item--selected', (onSelect || onActivate) && 'vui-vlist__item--click')}
                  style={{ top: offs[i], height: offs[i + 1] - offs[i] - g }}
                  onClick={() => { setFocus(i); selectable && onSelect && onSelect(keys[i], it); onActivate && onActivate(it, i); }}>
                  {renderItem ? renderItem(it, i, { selected: s, focused: i === focus }) : String(it)}
                </div>
              );
            })}
            {loading && <div className="vui-vlist__loading" style={{ top: total }} role="status"><span className="vui-loader vui-loader--ring vui-loader--sm" aria-hidden="true" />{loadingLabel}</div>}
          </div>
        )}
      </div>
    </div>
  );
}
