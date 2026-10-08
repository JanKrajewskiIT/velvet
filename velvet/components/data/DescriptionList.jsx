import React from 'react';
import { cx } from '../primitives/cx.js';
export function DescriptionList({ items = [], layout = 'row', columns = 2, className }) {
  return (
    <dl className={cx('vui-dl', 'vui-dl--' + layout, className)} style={layout === 'grid' ? { '--dl-cols': columns } : undefined}>
      {items.map((it, i) => (
        <div key={i} className="vui-dl__row" style={it.span ? { gridColumn: 'span ' + it.span } : undefined}>
          <dt className="vui-dl__term">{it.term}{it.hint && <span className="vui-dl__hint">{it.hint}</span>}</dt>
          <dd className={cx('vui-dl__desc', it.mono && 'vui-dl__desc--mono')}>{it.description ?? <span className="vui-dl__empty">—</span>}</dd>
        </div>
      ))}
    </dl>
  );
}
