import { IoCaretDown, IoCaretUp } from 'solid-icons/io';
import type { JSX } from 'solid-js';
import { createMemo, createSignal, For, Show } from 'solid-js';

import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './DataTable.module.css';

interface DataTableColumn<T> {
  key: keyof T & string;
  header: string;
  sortable?: boolean;
  render?: (value: T[keyof T], row: T) => JSX.Element;
  width?: string;
  sortAccessor?: (row: T) => string | number | boolean | Date | null | undefined;
  sortFn?: (a: T, b: T, direction: 'asc' | 'desc') => number;
}

interface DataTableProps<T> {
  data: T[];
  columns: DataTableColumn<T>[];
  pageSize?: number;
  sortable?: boolean;
  striped?: boolean;
  hoverable?: boolean;
  emptyMessage?: string;
}

const DataTable = <T extends Record<string, unknown>>(props: Props<DataTableProps<T>>) => {
  const [sortKey, setSortKey] = createSignal<string | null>(null);
  const [sortDirection, setSortDirection] = createSignal<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = createSignal(1);

  const pageSize = () => props.pageSize ?? 10;

  const sortedData = createMemo(() => {
    const key = sortKey();
    const data = [...props.data];
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

  const pageNumbers = createMemo(() => Array.from({ length: totalPages() }, (_, i) => i + 1));

  const paginationSlots = createMemo(() => {
    const total = totalPages();
    const current = currentPage();
    if (total <= 7) return pageNumbers();
    const slots: (number | 'ellipsis')[] = [];
    const windowSize = 2;
    const left = Math.max(2, current - windowSize);
    const right = Math.min(total - 1, current + windowSize);
    slots.push(1);
    if (left > 2) slots.push('ellipsis');
    for (let p = left; p <= right; p++) {
      if (p !== 1 && p !== total) slots.push(p);
    }
    if (right < total - 1) slots.push('ellipsis');
    if (total > 1) slots.push(total);
    return slots;
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
    return classNames(props.striped && index % 2 === 1 && styles.stripedRow, props.hoverable && styles.hoverableRow);
  };

  return (
    <div class={classNames(styles.wrapper, props.class)}>
      <table class={styles.table}>
        <thead>
          <tr>
            <For each={props.columns}>
              {(column) => {
                const sortable = () => isColumnSortable(column);
                const active = () => sortKey() === column.key;

                return (
                  <th
                    class={`${styles.th} ${sortable() ? styles.sortable : ''}`}
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
                  </th>
                );
              }}
            </For>
          </tr>
        </thead>
        <tbody>
          <Show
            when={paginatedData().length > 0}
            fallback={
              <tr>
                <td class={styles.empty} colSpan={props.columns.length}>
                  {props.emptyMessage ?? 'No data'}
                </td>
              </tr>
            }
          >
            <For each={paginatedData()}>
              {(row, index) => (
                <tr class={rowClass(index())}>
                  <For each={props.columns}>
                    {(column) => (
                      <td class={styles.td}>
                        {column.render ? column.render(row[column.key], row) : String(row[column.key] ?? '')}
                      </td>
                    )}
                  </For>
                </tr>
              )}
            </For>
          </Show>
        </tbody>
      </table>
      <Show when={totalPages() > 1}>
        <div class={styles.pagination}>
          <span class={styles.pageInfo}>
            Page {currentPage()} of {totalPages()}
          </span>
          <div class={styles.pageButtons}>
            <button
              type="button"
              class={`${styles.pageBtn} ${currentPage() <= 1 ? styles.pageBtnDisabled : ''}`}
              onClick={() => handlePageChange(currentPage() - 1)}
              aria-label="Previous page"
            >
              Prev
            </button>
            <For each={paginationSlots()}>
              {(slot) =>
                slot === 'ellipsis' ? (
                  <span class={styles.pageEllipsis} aria-hidden="true">
                    …
                  </span>
                ) : (
                  <button
                    type="button"
                    class={classNames(styles.pageBtn, slot === currentPage() && styles.pageBtnActive)}
                    onClick={() => handlePageChange(slot)}
                    aria-label={`Page ${slot}`}
                    aria-current={slot === currentPage() ? 'page' : undefined}
                  >
                    {slot}
                  </button>
                )
              }
            </For>
            <button
              type="button"
              class={classNames(styles.pageBtn, currentPage() >= totalPages() && styles.pageBtnDisabled)}
              onClick={() => handlePageChange(currentPage() + 1)}
              aria-label="Next page"
            >
              Next
            </button>
          </div>
        </div>
      </Show>
    </div>
  );
};

export { DataTable };
export type { DataTableColumn, DataTableProps };
