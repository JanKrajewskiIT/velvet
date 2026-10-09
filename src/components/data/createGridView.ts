import { type Accessor, createMemo, createSignal, type Setter, untrack } from 'solid-js';

import { emptyQuery, type QueryField, type QueryGroup } from '../patterns/QueryBuilder';
import { applyColumns } from './applyColumns';
import type { ColumnState } from './ColumnManager';
import type { GridColumn } from './dataGridTypes';
import { initialColumnState } from './gridColumns';
import { countActiveRules, matchesQuery } from './gridFilter';
import { cellText, type RowSort, rowValue, sortRows } from './rowData';

export interface GridViewOptions<T extends object> {
  columns: Accessor<GridColumn<T>[]>;
  rows: Accessor<T[]>;
  stickyFirst: Accessor<boolean>;
  filterFields: Accessor<QueryField[] | undefined>;
}

export interface GridView<T extends object> {
  /** Visible columns in display order. */
  cols: Accessor<GridColumn<T>[]>;
  /** Rows after search, filters and sort. */
  rows: Accessor<T[]>;
  search: Accessor<string>;
  setSearch: Setter<string>;
  query: Accessor<QueryGroup | undefined>;
  setQuery: Setter<QueryGroup | undefined>;
  columnState: Accessor<ColumnState[]>;
  setColumnState: Setter<ColumnState[]>;
  sort: Accessor<RowSort | null>;
  setSort: Setter<RowSort | null>;
  activeFilters: Accessor<number>;
}

export const createGridView = <T extends object>(options: GridViewOptions<T>): GridView<T> => {
  const [sort, setSort] = createSignal<RowSort | null>(null);
  const [search, setSearch] = createSignal('');
  const [query, setQuery] = createSignal<QueryGroup | undefined>(
    untrack(() => {
      const fields = options.filterFields();
      return fields ? emptyQuery(fields) : undefined;
    }),
  );
  const [columnState, setColumnState] = createSignal<ColumnState[]>(
    untrack(() => initialColumnState(options.columns(), options.stickyFirst())),
  );

  const cols = createMemo(() => applyColumns(options.columns(), columnState()));
  const activeFilters = () => {
    const q = query();
    return q ? countActiveRules(q) : 0;
  };

  const rows = createMemo(() => {
    let out = options.rows();
    const needle = search().trim().toLowerCase();
    if (needle)
      out = out.filter((r) => cols().some((c) => cellText(rowValue(r, c.key)).toLowerCase().includes(needle)));
    const q = query();
    if (q && activeFilters()) out = out.filter((r) => matchesQuery(q, r));
    const current = sort();
    if (current) out = sortRows(out, (r) => rowValue(r, current.key), current.dir);
    return out;
  });

  return { cols, rows, search, setSearch, query, setQuery, columnState, setColumnState, sort, setSort, activeFilters };
};
