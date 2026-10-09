import type { Accessor } from 'solid-js';

import type { RowKey } from './rowData';

export interface TableSelectionOptions<T extends object> {
  rows: Accessor<T[]>;
  sorted: Accessor<T[]>;
  selected: Accessor<RowKey[]>;
  onChange: (keys: RowKey[]) => void;
  keyOf: (row: T, index: number) => RowKey;
}

export interface TableSelection {
  isSelected: (key: RowKey) => boolean;
  allOn: () => boolean;
  someOn: () => boolean;
  allKeys: () => RowKey[];
  set: (keys: RowKey[]) => void;
  clear: () => void;
  toggle: (key: RowKey) => void;
  toggleAll: () => void;
  clickCheck: (e: MouseEvent, index: number, key: RowKey) => void;
}

export const createTableSelection = <T extends object>(options: TableSelectionOptions<T>): TableSelection => {
  let lastIndex: number | undefined;

  const isSelected = (key: RowKey) => options.selected().includes(key);
  const allKeys = () => options.rows().map((r, i) => options.keyOf(r, i));
  const allOn = () => options.rows().length > 0 && allKeys().every(isSelected);
  const someOn = () => !allOn() && allKeys().some(isSelected);
  const set = (keys: RowKey[]) => options.onChange(keys);
  const clear = () => set([]);
  const toggle = (key: RowKey) =>
    set(isSelected(key) ? options.selected().filter((x) => x !== key) : [...options.selected(), key]);
  const toggleAll = () => set(allOn() ? [] : allKeys());

  const clickCheck = (e: MouseEvent, index: number, key: RowKey) => {
    if (e.shiftKey && lastIndex !== undefined) {
      const from = Math.min(lastIndex, index);
      const to = Math.max(lastIndex, index);
      const rangeKeys = options
        .sorted()
        .slice(from, to + 1)
        .map((r, i) => options.keyOf(r, from + i));
      const turnOn = !isSelected(key);
      set(
        turnOn
          ? [...new Set([...options.selected(), ...rangeKeys])]
          : options.selected().filter((x) => !rangeKeys.includes(x)),
      );
    } else {
      toggle(key);
    }
    lastIndex = index;
  };

  return { isSelected, allOn, someOn, allKeys, set, clear, toggle, toggleAll, clickCheck };
};
