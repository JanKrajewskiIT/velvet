import { type Accessor, createEffect, createMemo, getOwner } from 'solid-js';

import type { RowKey } from '../components/data/rowData';

export const createRecordKeys = <T>(
  items: Accessor<readonly T[]>,
  getKey: (item: T, index: number) => RowKey,
  name: string,
) => {
  if (!getOwner()) throw new Error('createRecordKeys requires a Solid owner.');
  const data = createMemo(() => {
    const raw = items().map(getKey);
    if (raw.some((key) => typeof key !== 'string' && (typeof key !== 'number' || !Number.isFinite(key))))
      throw new RangeError('Record keys must be strings or finite numbers.');
    const reserved = new Set(raw);
    const indices = new Map<RowKey, number>();
    let duplicated = false;
    const keys = raw.map((original, index) => {
      let key = original;
      if (indices.has(key)) {
        duplicated = true;
        key = `${String(original)}§${index}`;
        while (reserved.has(key) || indices.has(key)) key += '§';
      }
      indices.set(key, index);
      return key;
    });
    return { keys, indices, duplicated };
  });
  createEffect(() => {
    if (data().duplicated) console.warn(`${name}: duplicate record keys; provide unique keys to preserve identity.`);
  });
  return { keys: (): readonly RowKey[] => data().keys, indexOf: (key: RowKey) => data().indices.get(key) ?? -1 };
};
