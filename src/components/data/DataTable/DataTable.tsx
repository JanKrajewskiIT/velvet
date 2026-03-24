import { IoCaretDown, IoCaretUp } from 'solid-icons/io';
import type { JSX } from 'solid-js';
import { createEffect, createMemo, createSignal, For, Show } from 'solid-js';

import Table from '~/components/data/Table/Table';
import TableBody from '~/components/data/Table/TableBody';
import TableCell from '~/components/data/Table/TableCell';
import TableHead from '~/components/data/Table/TableHead';
import TableHeader from '~/components/data/Table/TableHeader';
import TableRow from '~/components/data/Table/TableRow';
import Input from '~/components/inputs/Input/Input';
import Pagination from '~/components/navigation/Pagination/Pagination';
import type Props from '~/models/Props';
import classNames from '~/utils/classNames';
import { filterRows, sortRows, type TabularSortDirection } from '~/utils/tabularData';

import styles from './DataTable.module.css';

interface DataTableColumn<T> {
  key: keyof T & string;
  header: string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: T[keyof T], row: T) => JSX.Element;
  width?: string;
  sortAccessor?: (row: T) => string | number | boolean | Date | null | undefined;
  sortFn?: (a: T, b: T, direction: TabularSortDirection) => number;
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
  const [sortDirection, setSortDirection] = createSignal<TabularSortDirection>('asc');
  const [currentPage, setCurrentPage] = createSignal(1);
  const [internalFilterQuery, setInternalFilterQuery] = createSignal('');

  const pageSize = () => props.pageSize ?? 10;
  const filterQuery = () => props.filterQuery ?? internalFilterQuery();

  const filteredData = createMemo(() => {
    return filterRows({
      rows: props.data,
      query: filterQuery(),
      columns: props.columns,
      filterFn: props.filterFn,
      shouldUseColumn: (column) => column.filterable !== false,
    });
  });

  const sortedData = createMemo(() => {
    return sortRows({
      rows: filteredData(),
      sortKey: sortKey(),
      direction: sortDirection(),
      getColumnByKey: (key) => props.columns.find((col) => col.key === key),
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
    <div class={classNames(styles.wrapper, props.class)}>
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
      <Table containerClass={classNames(totalPages() > 1 && styles.tableContainerWithPagination)}>
        <TableHead>
          <TableRow>
            <For each={props.columns}>
              {(column) => {
                const sortable = () => isColumnSortable(column);
                const active = () => sortKey() === column.key;

                return (
                  <TableHeader
                    class={classNames(sortable() && styles.sortable)}
                    style={column.width ? { width: column.width } : undefined}
                    onClick={() => sortable() && handleSort(column)}
                  >
                    {column.header}
                    <Show when={sortable()}>
                      <span class={classNames(styles.sortIcon, active() && styles.sortActive)}>
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
                <TableCell class={styles.empty} colSpan={props.columns.length}>
                  {props.emptyMessage ?? 'No data'}
                </TableCell>
              </TableRow>
            }
          >
            <For each={paginatedData()}>
              {(row) => (
                <TableRow>
                  <For each={props.columns}>
                    {(column) => (
                      <TableCell>
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
    </div>
  );
};

export { DataTable };
export type { DataTableColumn, DataTableProps };
