import { type Accessor, createUniqueId, getOwner } from 'solid-js';

import { type RowKey, rowValue } from '../components/data/rowData';

export const createRowIdentity = <T extends object>(
  field: Accessor<string>,
  custom: Accessor<((row: T) => RowKey) | undefined>,
) => {
  if (!getOwner()) throw new Error('createRowIdentity requires a Solid owner.');
  const prefix = createUniqueId();
  const generated = new WeakMap<T, RowKey>();
  let sequence = 0;
  return (row: T): RowKey => {
    const explicit = custom()?.(row) ?? rowValue(row, field());
    if (typeof explicit === 'string' || (typeof explicit === 'number' && Number.isFinite(explicit))) return explicit;
    let key = generated.get(row);
    if (key === undefined) {
      key = `vui-row-${prefix}-${++sequence}`;
      generated.set(row, key);
    }
    return key;
  };
};
