import React from 'react';
import { ListItem } from '../primitives/ListItem.jsx';
import { EmptyText } from '../primitives/EmptyText.jsx';
import { cx } from '../primitives/cx.js';
export function List({ items = [], value, onValueChange, onItemClick, divided = true, size = 'md', empty = 'Nothing here yet.', label, className }) {
  const interactive = !!(onValueChange || onItemClick);
  if (!items.length) return <EmptyText className={cx('vui-list__empty', className)}>{empty}</EmptyText>;
  return (
    <ul className={cx('vui-list', 'vui-list--' + size, divided && 'vui-list--divided', className)} aria-label={label}>
      {items.map((it, i) => {
        const sel = value !== undefined && it.id === value;
        return (
          <li key={it.id ?? i} className="vui-list__li">
            <ListItem size={size} leading={it.leading} title={it.title} description={it.description} trailing={it.trailing} href={it.href} disabled={it.disabled} selected={sel}
              onClick={interactive && !it.href ? () => { if (it.disabled) return; onValueChange && onValueChange(it.id); onItemClick && onItemClick(it); } : it.href && onItemClick ? () => onItemClick(it) : undefined} />
          </li>
        );
      })}
    </ul>
  );
}
