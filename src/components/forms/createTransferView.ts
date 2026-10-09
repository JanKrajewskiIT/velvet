import { createMemo } from 'solid-js';

import { normalizeSearch, searchTextOf, type TransferItem } from './transferItem';

export interface TransferViewOptions {
  items: () => readonly TransferItem[];
  query: () => string;
  marked: () => ReadonlySet<string>;
}

export type TransferView = ReturnType<typeof createTransferView>;

/** Items of one panel after search filtering, with the selectable and checked subsets. */
export const createTransferView = (options: TransferViewOptions) => {
  const visible = createMemo(() => {
    const needle = normalizeSearch(options.query());
    return needle
      ? options.items().filter((item) => normalizeSearch(searchTextOf(item)).includes(needle))
      : [...options.items()];
  });
  const enabled = createMemo(() => visible().filter((item) => !item.disabled));
  const checked = createMemo(() => enabled().filter((item) => options.marked().has(item.value)));
  const allChecked = () => checked().length > 0 && checked().length === enabled().length;
  const someChecked = () => checked().length > 0 && checked().length < enabled().length;

  return { visible, enabled, checked, allChecked, someChecked };
};
