export type TabularSortDirection = 'asc' | 'desc';

type TabularPrimitive = string | number | boolean | Date | null | undefined;

export interface TabularFilterColumn<T> {
  key: keyof T & string;
  filterAccessor?: (row: T) => string | number | boolean | null | undefined;
  filterFn?: (row: T, query: string) => boolean;
}

export interface TabularSortColumn<T> {
  key: keyof T & string;
  sortAccessor?: (row: T) => TabularPrimitive;
  sortFn?: (a: T, b: T, direction: TabularSortDirection) => number;
}

interface FilterRowsOptions<T, TColumn extends TabularFilterColumn<T>> {
  rows: readonly T[];
  query: string;
  columns: readonly TColumn[];
  filterFn?: (row: T, query: string) => boolean;
  shouldUseColumn?: (column: TColumn) => boolean;
}

interface SortRowsOptions<T, TColumn extends TabularSortColumn<T>> {
  rows: readonly T[];
  sortKey: string | null;
  direction: TabularSortDirection;
  getColumnByKey: (key: string) => TColumn | undefined;
}

const normalizeQuery = (query: string) => query.trim().toLowerCase();

const compareValues = (aValue: TabularPrimitive, bValue: TabularPrimitive, direction: TabularSortDirection) => {
  if (aValue == null && bValue == null) return 0;
  if (aValue == null) return 1;
  if (bValue == null) return -1;
  if (aValue < bValue) return direction === 'asc' ? -1 : 1;
  if (aValue > bValue) return direction === 'asc' ? 1 : -1;
  return 0;
};

const toSearchText = (value: TabularPrimitive) => {
  if (value instanceof Date) return value.toISOString().toLowerCase();
  return String(value ?? '').toLowerCase();
};

const matchesColumnQuery = <T>(row: T, column: TabularFilterColumn<T>, query: string) => {
  if (column.filterFn) return column.filterFn(row, query);
  const raw = column.filterAccessor ? column.filterAccessor(row) : (row[column.key] as TabularPrimitive);
  return toSearchText(raw).includes(query);
};

const filterRows = <T, TColumn extends TabularFilterColumn<T>>(options: FilterRowsOptions<T, TColumn>) => {
  const query = normalizeQuery(options.query);
  if (!query) return [...options.rows];

  if (options.filterFn) {
    return options.rows.filter((row) => options.filterFn?.(row, query) ?? false);
  }

  return options.rows.filter((row) =>
    options.columns.some((column) => {
      if (options.shouldUseColumn && !options.shouldUseColumn(column)) return false;
      return matchesColumnQuery(row, column, query);
    }),
  );
};

const sortRows = <T, TColumn extends TabularSortColumn<T>>(options: SortRowsOptions<T, TColumn>) => {
  const rows = [...options.rows];
  if (!options.sortKey) return rows;

  const column = options.getColumnByKey(options.sortKey);
  if (!column) return rows;

  if (column.sortFn) {
    return rows.sort((a, b) => column.sortFn?.(a, b, options.direction) ?? 0);
  }

  const getValue = (row: T) =>
    column.sortAccessor ? column.sortAccessor(row) : (row[options.sortKey as keyof T] as TabularPrimitive);

  return rows.sort((a, b) => compareValues(getValue(a), getValue(b), options.direction));
};

export { filterRows, sortRows };
