import { createSignal, For, type JSX, mergeProps, Show } from 'solid-js';

import { cx } from '../../utils/cx';
import { createGridActiveCell } from './createGridActiveCell';
import { createGridExpansion } from './createGridExpansion';
import { createGridKeyboard } from './createGridKeyboard';
import { createGridLayout } from './createGridLayout';
import { createGridSelection } from './createGridSelection';
import { createGridView } from './createGridView';
import type { DataGridController } from './dataGridController';
import type { DataGridProps } from './dataGridTypes';
import { GridEmpty } from './GridEmpty';
import { GridFooter } from './GridFooter';
import { GridHeader } from './GridHeader';
import { GridRow } from './GridRow';
import { GridToolbar } from './GridToolbar';
import { rowId } from './rowData';

export type { DataGridProps, GridColumn, GridRowChange } from './dataGridTypes';

/**
 * Advanced data grid. Spreadsheet core: single active cell, arrows / Home / End / PageUp/Down, Enter / F2 / typing edits,
 * Enter commits ↓, Tab →, Esc cancels, ⌘C copies; sortable headers, resizable columns, sticky header.
 * Optional layers, each one prop: toolbar search (`searchable`), Filters popover with a QueryBuilder (`filterFields`),
 * Columns popover with ColumnManager (`columnManager`), Export (`onExport`; null = CSV download), row checkboxes with
 * select-all + bulk bar (`selectable`, `bulkActions`; Space toggles), expandable detail rows (`renderDetail`; Enter on a
 * read-only cell toggles), frozen columns with a shadow on horizontal scroll, "Showing X of Y" footer.
 * Use Table for simple read-only lists.
 */
export const DataGrid = <T extends object>(props: DataGridProps<T>): JSX.Element => {
  const p = mergeProps(
    {
      rowKey: 'id',
      height: 360,
      stickyFirst: true,
      rowNumbers: true,
      selectable: false,
      searchable: false,
      columnManager: false,
      footer: false,
    } satisfies Partial<DataGridProps<T>>,
    props,
  );
  const [scrolled, setScrolled] = createSignal(false);
  let gridElement!: HTMLDivElement;

  const keyOf = (row: T, index: number) => rowId(row, p.rowKey, index);
  const view = createGridView<T>({
    columns: () => p.columns,
    rows: () => p.rows,
    stickyFirst: () => p.stickyFirst,
    filterFields: () => p.filterFields,
  });
  const layout = createGridLayout<T>({
    columns: () => p.columns,
    cols: view.cols,
    rowNumbers: () => p.rowNumbers,
    selectable: () => p.selectable,
  });
  const selection = createGridSelection<T>({
    selected: () => p.selected,
    onChange: (keys) => p.onSelectionChange?.(keys),
    rows: () => p.rows,
    view: view.rows,
    keyOf,
  });
  const expansion = createGridExpansion();
  const active = createGridActiveCell<T>({
    getGrid: () => gridElement,
    cols: view.cols,
    view: view.rows,
    rows: () => p.rows,
    rowKey: () => p.rowKey,
    onRowsChange: (rows, change) => p.onRowsChange?.(rows, change),
  });
  const onKey = createGridKeyboard<T>({
    active,
    selection,
    expansion,
    cols: view.cols,
    view: view.rows,
    keyOf,
    selectable: () => p.selectable,
    hasDetail: () => !!p.renderDetail,
  });
  const grid: DataGridController<T> = { config: p, view, selection, layout, active, expansion, keyOf };

  return (
    <div class={cx('vui-dgrid', p.class)}>
      <GridToolbar grid={grid} />
      {/* eslint-disable-next-line jsx-a11y/interactive-supports-focus -- grid uses roving tabindex: the active gridcell holds the tab stop */}
      <div
        ref={gridElement}
        role="grid"
        aria-rowcount={view.rows().length + 1}
        aria-colcount={view.cols().length}
        aria-multiselectable={p.selectable || undefined}
        class={cx('vui-grid', scrolled() && 'vui-grid--scrolled')}
        style={{ height: `${p.height}px`, '--grid-tpl': layout.template() }}
        onKeyDown={onKey}
        onScroll={(e) => setScrolled(e.currentTarget.scrollLeft > 2)}
      >
        <GridHeader grid={grid} />
        <Show when={view.rows().length === 0}>
          <GridEmpty grid={grid} />
        </Show>
        <For each={view.rows()}>{(row, r) => <GridRow grid={grid} row={row} index={r()} />}</For>
      </div>
      <GridFooter grid={grid} />
    </div>
  );
};
