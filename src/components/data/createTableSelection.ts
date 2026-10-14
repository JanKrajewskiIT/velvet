import { type Accessor, createEffect, on } from 'solid-js';

import { toggleKey, toggleKeyScope } from '../../utils/keySelection';
import type { RowKey } from './rowData';

export interface TableSelectionOptions<T extends object> {
  rows: Accessor<T[]>;
  sorted: Accessor<T[]>;
  selected: Accessor<RowKey[]>;
  onChange: (keys: RowKey[]) => void;
  keyOf: (row: T, index: number) => RowKey;
  dataKey: Accessor<string | number | undefined>;
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
  let anchor: RowKey | undefined;
  createEffect(
    on(
      options.dataKey,
      () => {
        anchor = undefined;
        options.onChange([]);
      },
      { defer: true },
    ),
  );

  const isSelected = (key: RowKey) => options.selected().includes(key);
  const allKeys = () => options.rows().map((r, i) => options.keyOf(r, i));
  const allOn = () => options.rows().length > 0 && allKeys().every(isSelected);
  const someOn = () => !allOn() && allKeys().some(isSelected);
  const set = (keys: RowKey[]) => options.onChange(keys);
  const clear = () => set([]);
  const toggle = (key: RowKey) => set(toggleKey(options.selected(), key));
  const toggleAll = () => set(toggleKeyScope(options.selected(), allKeys()));

  const clickCheck = (e: MouseEvent, index: number, key: RowKey) => {
    const lastIndex =
      anchor === undefined ? -1 : options.sorted().findIndex((row, at) => options.keyOf(row, at) === anchor);
    if (e.shiftKey && lastIndex >= 0) {
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
    anchor = key;
  };

  return { isSelected, allOn, someOn, allKeys, set, clear, toggle, toggleAll, clickCheck };
};
