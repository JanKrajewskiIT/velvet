import React from 'react';
import { Glyph } from '../primitives/Glyph.jsx';
import { Select } from '../forms/Select.jsx';
import { cx } from '../primitives/cx.js';
export function pageRange(page, count, sib = 1) {
  const total = sib * 2 + 5;
  if (count <= total) return Array.from({ length: count }, (_, i) => i + 1);
  const l = Math.max(page - sib, 1), r = Math.min(page + sib, count);
  const sl = l > 2, sr = r < count - 1;
  if (!sl && sr) return [...Array.from({ length: 3 + sib * 2 }, (_, i) => i + 1), '…', count];
  if (sl && !sr) return [1, '…', ...Array.from({ length: 3 + sib * 2 }, (_, i) => count - (3 + sib * 2) + i + 1)];
  return [1, '…', ...Array.from({ length: r - l + 1 }, (_, i) => l + i), '…', count];
}
export function Pagination({ page, defaultPage = 1, pageCount, onPageChange, siblingCount = 1, total, pageSize, pageSizeOptions, onPageSizeChange, variant = 'full', className }) {
  const [inner, setInner] = React.useState(defaultPage);
  const cur = page !== undefined ? page : inner;
  const count = Math.max(1, pageCount ?? (total && pageSize ? Math.ceil(total / pageSize) : 1));
  const go = (p) => { const n = Math.min(count, Math.max(1, p)); if (n === cur) return; if (page === undefined) setInner(n); onPageChange && onPageChange(n); };
  const from = total && pageSize ? (cur - 1) * pageSize + 1 : null;
  const to = total && pageSize ? Math.min(total, cur * pageSize) : null;
  return (
    <nav aria-label="Pagination" className={cx('vui-pager', 'vui-pager--' + variant, className)}>
      {total != null && pageSize && <span className="vui-pager__info">{from.toLocaleString()}–{to.toLocaleString()} of {total.toLocaleString()}</span>}
      {pageSizeOptions && onPageSizeChange && (
        <div className="vui-pager__size"><span>Rows</span>
          <Select size="sm" className="vui-pager__select" value={String(pageSize)} options={pageSizeOptions.map(String)} onValueChange={(v) => onPageSizeChange(+v)} />
        </div>
      )}
      <div className="vui-pager__pages">
        <button type="button" className="vui-pager__btn" aria-label="Previous page" disabled={cur <= 1} onClick={() => go(cur - 1)}><Glyph name="chevron-left" /></button>
        {variant === 'compact'
          ? <span className="vui-pager__compact" aria-live="polite">Page <b>{cur}</b> of {count}</span>
          : pageRange(cur, count, siblingCount).map((p, i) => p === '…'
            ? <span key={'e' + i} className="vui-pager__gap" aria-hidden="true">…</span>
            : <button key={p} type="button" className={cx('vui-pager__btn', p === cur && 'vui-pager__btn--on')} aria-current={p === cur ? 'page' : undefined} aria-label={'Page ' + p} onClick={() => go(p)}>{p}</button>)}
        <button type="button" className="vui-pager__btn" aria-label="Next page" disabled={cur >= count} onClick={() => go(cur + 1)}><Glyph name="chevron-right" /></button>
      </div>
    </nav>
  );
}
