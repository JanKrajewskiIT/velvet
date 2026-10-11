import { For, type JSX, mergeProps, Show } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { createTableExpansion } from './createTableExpansion';
import { createTableKeyboard } from './createTableKeyboard';
import { createTablePins } from './createTablePins';
import { createTableSelection } from './createTableSelection';
import { createTableSort } from './createTableSort';
import { createTableWidths } from './createTableWidths';
import { cssLength, rowId, type RowKey } from './rowData';
import { TableBulkBar } from './TableBulkBar';
import type { TableController } from './tableController';
import { TableHeaderRow } from './TableHeaderRow';
import { TableRow } from './TableRow';
import { TableSkeletonRows } from './TableSkeletonRows';
import { TableToolbar } from './TableToolbar';
import type { TableProps } from './tableTypes';

export type { TableColumn, TableProps, TableSort } from './tableTypes';

const NO_SELECTION: RowKey[] = [];

/** Data table: toolbar (title · count · actions), sort, row selection (Shift-click selects a range) with bulk-action bar, drag-to-resize columns, expandable detail rows, sticky header, keyboard (↑↓ move · Space select · →/← expand · ⌘A all · Esc clear), skeleton loading, empty state. Framed on its own; borderless inside `<Card padding="none">`. */
export const Table = <T extends object>(props: TableProps<T>): JSX.Element => {
  const p = mergeProps(
    {
      rowKey: 'id',
      selectable: false,
      selected: NO_SELECTION,
      loading: false,
      loadingRows: 4,
      resizable: false,
    } satisfies Partial<TableProps<T>>,
    props,
  );
  const translate = useTranslate();
  const empty = () => p.empty ?? translate('velvet.data.table.empty');
  let body!: HTMLTableSectionElement;
  let head!: HTMLTableSectionElement;
  let scroller!: HTMLDivElement;

  const widths = createTableWidths();
  const sort = createTableSort<T>({
    columns: () => p.columns,
    rows: () => p.rows,
    sort: () => p.sort,
    defaultSort: () => p.defaultSort,
    onChange: (next) => p.onSortChange?.(next),
    serverSorted: () => !!p.onSortChange && p.sort !== undefined,
  });
  const pins = createTablePins<T>({
    columns: () => p.columns,
    selectable: () => p.selectable,
    hasExpander: () => !!p.renderExpanded,
    widths: widths.widths,
    head: () => head,
    scroller: () => scroller,
  });
  const keyOf = (row: T, index: number) => rowId(row, p.rowKey, index);
  const selection = createTableSelection<T>({
    rows: () => p.rows,
    sorted: sort.sorted,
    selected: () => p.selected,
    onChange: (keys) => p.onSelectedChange?.(keys),
    keyOf,
  });
  const expansion = createTableExpansion();
  const onRowKey = createTableKeyboard({
    body: () => body,
    selectable: () => p.selectable,
    hasExpander: () => !!p.renderExpanded,
    selection,
    expansion,
  });
  const span = () => p.columns.length + (p.selectable ? 1 : 0) + (p.renderExpanded ? 1 : 0);
  const table: TableController<T> = { config: p, sort, widths, pins, selection, expansion, onRowKey, keyOf, span };

  const sticky = () => p.stickyHeader ?? !!p.maxHeight;
  const scrollStyle = (): JSX.CSSProperties | undefined =>
    p.maxHeight ? { 'max-height': cssLength(p.maxHeight), 'overflow-y': 'auto' } : undefined;

  return (
    <div class={cx('vui-table-wrap', p.class)}>
      <TableToolbar table={table} />
      <TableBulkBar table={table} />
      <div
        ref={(element) => {
          scroller = element;
        }}
        onScroll={pins.updateScrolled}
        class={cx(
          'vui-table__scroll',
          pins.scrolled().left && 'vui-table__scroll--l',
          pins.scrolled().right && 'vui-table__scroll--r',
        )}
        style={scrollStyle()}
      >
        <table
          class={cx(
            'vui-table',
            sticky() && 'vui-table--sticky',
            widths.anyWidth() && 'vui-table--fixed',
            p.layout === 'fixed' && 'vui-table--layout-fixed',
            pins.hasPins() && 'vui-table--pins',
          )}
          aria-busy={p.loading || undefined}
        >
          <thead
            ref={(element) => {
              head = element;
            }}
          >
            <TableHeaderRow table={table} />
          </thead>
          <tbody
            ref={(element) => {
              body = element;
            }}
          >
            <Show when={p.loading}>
              <TableSkeletonRows table={table} />
            </Show>
            <Show when={!p.loading}>
              <For each={sort.sorted()}>{(row, i) => <TableRow table={table} row={row} index={i()} />}</For>
              <Show when={p.rows.length === 0}>
                <tr>
                  <td class="vui-table__empty" colSpan={span()}>
                    {empty()}
                  </td>
                </tr>
              </Show>
              {p.addRow}
            </Show>
          </tbody>
        </table>
      </div>
    </div>
  );
};
