import { type Accessor, createMemo } from 'solid-js';

import { createControllable } from '../../hooks/createControllable';
import { rowValue, sortRows } from './rowData';
import type { TableColumn, TableSort } from './tableTypes';

export interface TableSortOptions<T extends object> {
  columns: Accessor<TableColumn<T>[]>;
  rows: Accessor<T[]>;
  sort: Accessor<TableSort | null | undefined>;
  defaultSort: Accessor<TableSort | undefined>;
  onChange: (sort: TableSort | null) => void;
  serverSorted: Accessor<boolean>;
}

export interface TableSortState<T extends object> {
  sort: Accessor<TableSort | null>;
  setSort: (next: TableSort | null) => void;
  sorted: Accessor<T[]>;
}

export const createTableSort = <T extends object>(options: TableSortOptions<T>): TableSortState<T> => {
  const [sort, setSort] = createControllable<TableSort | null>({
    value: options.sort,
    defaultValue: options.defaultSort() ?? null,
    onChange: options.onChange,
  });
  const sorted = createMemo(() => {
    const current = sort();
    if (!current || options.serverSorted()) return options.rows();
    const col = options.columns().find((c) => c.key === current.key);
    if (!col) return options.rows();
    const sortValue = col.sortValue;
    return sortRows(options.rows(), sortValue ?? ((row) => rowValue(row, col.key)), current.dir);
  });
  return { sort, setSort, sorted };
};
