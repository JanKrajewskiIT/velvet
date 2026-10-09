import { createEffect, createMemo } from 'solid-js';

import { type RowKey, rowValue } from './rowData';
import type { VirtualListConfig } from './virtualListTypes';

const identityOf = (item: unknown): RowKey | undefined => {
  if (typeof item !== 'object' || item === null) return undefined;
  const id = rowValue(item, 'id') ?? rowValue(item, 'key');
  return typeof id === 'string' || typeof id === 'number' ? id : undefined;
};

export const createVirtualSelection = <T>(p: VirtualListConfig<T>) => {
  const keyInfo = createMemo(() => {
    const seen = new Set<RowKey>();
    let duplicated = false;
    const keys = p.items.map((item, i) => {
      let key = p.getKey ? p.getKey(item, i) : (identityOf(item) ?? i);
      if (seen.has(key)) {
        duplicated = true;
        key = `${key}§${i}`;
      }
      seen.add(key);
      return key;
    });
    return { keys, duplicated };
  });
  createEffect(() => {
    if (keyInfo().duplicated)
      console.warn('VirtualList: duplicate item keys — fell back to key+index. Provide unique ids via getKey.');
  });

  const isSelected = (i: number) => {
    const key = keyInfo().keys[i];
    return Array.isArray(p.selected) ? p.selected.some((k) => k === key) : p.selected === key;
  };

  const select = (i: number, item: T) => {
    const key = keyInfo().keys[i];
    if (p.selectable && key !== undefined) p.onSelect?.(key, item);
  };

  const multiselectable = () => (p.selectable && Array.isArray(p.selected) ? true : undefined);

  return { isSelected, select, multiselectable } as const;
};
