import { IoCaretDown, IoCaretUp } from 'solid-icons/io';
import type { JSX } from 'solid-js';
import { createEffect, createMemo, createSignal, For, Show } from 'solid-js';

import Card from '~/components/data-display/Card/Card';
import Table from '~/components/data-display/Table/Table';
import TableBody from '~/components/data-display/Table/TableBody';
import TableCell from '~/components/data-display/Table/TableCell';
import TableHead from '~/components/data-display/Table/TableHead';
import TableHeader from '~/components/data-display/Table/TableHeader';
import TableRow from '~/components/data-display/Table/TableRow';
import Input from '~/components/inputs/Input/Input';
import Pagination from '~/components/navigation/Pagination/Pagination';
import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './DataTable.module.css';

interface DataTableColumn<T> {
  key: keyof T & string;
  header: string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: T[keyof T], row: T) => JSX.Element;
  width?: string;
  sortAccessor?: (row: T) => string | number | boolean | Date | null | undefined;
  sortFn?: (a: T, b: T, direction: 'asc' | 'desc') => number;
  filterAccessor?: (row: T) => string | number | boolean | null | undefined;
  filterFn?: (row: T, query: string) => boolean;
}

interface DataTableProps<T> {
  data: T[];
  columns: DataTableColumn<T>[];
  pageSize?: number;
  sortable?: boolean;
  striped?: boolean;
  hoverable?: boolean;
  emptyMessage?: string;
  filterable?: boolean;
  filterQuery?: string;
  onFilterQueryChange?: (query: string) => void;
  filterPlaceholder?: string;
  filterFn?: (row: T, query: string) => boolean;
  showResultsCount?: boolean;
}

const DataTable = <T extends Record<string, unknown>>(props: Props<DataTableProps<T>>) => {
  const [sortKey, setSortKey] = createSignal<string | null>(null);
  const [sortDirection, setSortDirection] = createSignal<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = createSignal(1);
  const [internalFilterQuery, setInternalFilterQuery] = createSignal('');

  const pageSize = () => props.pageSize ?? 10;
  const filterQuery = () => props.filterQuery ?? internalFilterQuery();

  const filteredData = createMemo(() => {
    const query = filterQuery().trim().toLowerCase();
    if (!query) return props.data;

    const matchWithColumn = (row: T) => {
      return props.columns.some((column) => {
        if (column.filterable === false) return false;
        if (column.filterFn) return column.filterFn(row, query);

        const raw = column.filterAccessor ? column.filterAccessor(row) : row[column.key];
        const text = String(raw ?? '').toLowerCase();
        return text.includes(query);
      });
    };

    if (props.filterFn) {
      return props.data.filter((row) => props.filterFn?.(row, query));
    }

    return props.data.filter(matchWithColumn);
  });

  const sortedData = createMemo(() => {
    const key = sortKey();
    const data = [...filteredData()];
    if (!key) return data;

    const direction = sortDirection();

    const column = props.columns.find((col) => col.key === key);

    const sortFn = column?.sortFn;
    if (sortFn) {
      return data.sort((a, b) => sortFn(a, b, direction));
    }

    const getValue = (row: T) =>
      column?.sortAccessor
        ? column.sortAccessor(row)
        : (row[key] as string | number | boolean | Date | null | undefined);

    return data.sort((a, b) => {
      const aVal = getValue(a);
      const bVal = getValue(b);
      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      if (aVal < bVal) return direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  });

  const totalPages = createMemo(() => Math.max(1, Math.ceil(sortedData().length / pageSize())));

  const paginatedData = createMemo(() => {
    const start = (currentPage() - 1) * pageSize();
    return sortedData().slice(start, start + pageSize());
  });

  const handleSort = (column: DataTableColumn<T>) => {
    if (!column.sortable && !props.sortable) return;
    if (column.sortable === false) return;

    const key: string = column.key;
    if (sortKey() === key) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages()) return;
    setCurrentPage(page);
  };

  const isColumnSortable = (column: DataTableColumn<T>) => {
    if (column.sortable !== undefined) return column.sortable;
    return props.sortable ?? false;
  };

  const rowClass = (index: number) => {
    return classNames(
      props.striped && index % 2 === 1 && styles.stripedRow,
      props.hoverable ? styles.hoverableRow : styles.noHoverRow
    );
  };

  const handleFilterInput: JSX.EventHandler<HTMLInputElement, InputEvent> = (e) => {
    const next = e.currentTarget.value;
    setInternalFilterQuery(next);
    props.onFilterQueryChange?.(next);
  };

  createEffect(() => {
    filterQuery();
    setCurrentPage(1);
  });

  return (
    <Card class={classNames(styles.wrapper, props.class)}>
      <Show when={props.filterable}>
        <div class={styles.toolbar}>
          <Input
            type="search"
            value={filterQuery()}
            onInput={handleFilterInput}
            placeholder={props.filterPlaceholder ?? 'Filter rows...'}
            class={styles.filterInput}
          />
          <Show when={props.showResultsCount ?? true}>
            <span class={styles.resultsCount}>
              {sortedData().length} result{sortedData().length === 1 ? '' : 's'}
            </span>
          </Show>
        </div>
      </Show>
      <Table class={styles.dataTable} containerClass={styles.tableContainer}>
        <TableHead class={styles.dataTableHead}>
          <TableRow>
            <For each={props.columns}>
              {(column) => {
                const sortable = () => isColumnSortable(column);
                const active = () => sortKey() === column.key;

                return (
                  <TableHeader
                    class={classNames(styles.headerCell, sortable() && styles.sortable)}
                    style={column.width ? { width: column.width } : undefined}
                    onClick={() => sortable() && handleSort(column)}
                  >
                    {column.header}
                    <Show when={sortable()}>
                      <span class={`${styles.sortIcon} ${active() ? styles.sortActive : ''}`}>
                        <Show when={active() && sortDirection() === 'desc'} fallback={<IoCaretUp />}>
                          <IoCaretDown />
                        </Show>
                      </span>
                    </Show>
                  </TableHeader>
                );
              }}
            </For>
          </TableRow>
        </TableHead>
        <TableBody>
          <Show
            when={paginatedData().length > 0}
            fallback={
              <TableRow>
                <TableCell class={classNames(styles.dataCell, styles.empty)} colSpan={props.columns.length}>
                  {props.emptyMessage ?? 'No data'}
                </TableCell>
              </TableRow>
            }
          >
            <For each={paginatedData()}>
              {(row, index) => (
                <TableRow class={rowClass(index())}>
                  <For each={props.columns}>
                    {(column) => (
                      <TableCell class={styles.dataCell}>
                        {column.render ? column.render(row[column.key], row) : String(row[column.key] ?? '')}
                      </TableCell>
                    )}
                  </For>
                </TableRow>
              )}
            </For>
          </Show>
        </TableBody>
      </Table>
      <Show when={totalPages() > 1}>
        <div class={styles.pagination}>
          <span class={styles.pageInfo}>
            Page {currentPage()} of {totalPages()}
          </span>
          <Pagination
            page={currentPage()}
            totalPages={totalPages()}
            onChange={handlePageChange}
            previousLabel="Prev"
            nextLabel="Next"
            ariaLabel="Data table pages"
          />
        </div>
      </Show>
    </Card>
  );
};

export { DataTable };
export type { DataTableColumn, DataTableProps };
