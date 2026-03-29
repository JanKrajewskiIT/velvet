import { IoCaretDown, IoCaretUp } from 'solid-icons/io';
import { type Accessor, For, type JSX, Show } from 'solid-js';

import Button from '~/components/buttons/Button/Button';
import Checkbox from '~/components/switchers/Checkbox/Checkbox';
import classNames from '~/utils/classNames';

import type { DataGridProColumn } from '../DataGridPro.types';
import styles from './DataGridProHeader.module.css';

interface DataGridProHeaderProps<T extends Record<string, unknown>> {
  headerHeight: Accessor<number>;
  selectable: Accessor<boolean>;
  allVisibleSelected: Accessor<boolean>;
  onToggleAllVisible: () => void;
  visibleColumns: Accessor<readonly DataGridProColumn<T>[]>;
  isColumnSortable: (column: DataGridProColumn<T>) => boolean;
  sortKey: Accessor<string | null>;
  sortDirection: Accessor<'asc' | 'desc'>;
  onSort: (column: DataGridProColumn<T>) => void;
  getAriaSort: (column: DataGridProColumn<T>) => 'none' | 'ascending' | 'descending';
  getColumnPin: (column: DataGridProColumn<T>) => 'left' | 'right' | null;
  getColumnStyle: (column: DataGridProColumn<T>) => JSX.CSSProperties;
  reorderable: Accessor<boolean>;
  draggingColumnKey: Accessor<string | null>;
  dragOverColumnKey: Accessor<string | null>;
  onHeaderDragStart: (key: string, event: DragEvent) => void;
  onHeaderDragOver: (key: string, event: DragEvent) => void;
  onHeaderDrop: (key: string, event: DragEvent) => void;
  onHeaderDragEnd: () => void;
  onResizeStart: (key: string, event: MouseEvent) => void;
  selectAllVisibleRowsLabel?: string;
  resizeColumnLabel?: (label: string) => string;
}

const DataGridProHeader = <T extends Record<string, unknown>>(props: DataGridProHeaderProps<T>) => {
  return (
    <div class={styles.header} role="row" style={{ height: `${props.headerHeight()}px` }}>
      <Show when={props.selectable()}>
        <div role="columnheader" class={classNames(styles.headerCell, styles.pinnedLeft, styles.selectionHeaderCell)}>
          <Checkbox
            class={styles.selectionCheckbox}
            checked={props.allVisibleSelected()}
            onChange={props.onToggleAllVisible}
            aria-label={props.selectAllVisibleRowsLabel}
          />
        </div>
      </Show>
      <For each={props.visibleColumns()}>
        {(column) => {
          const sortable = () => props.isColumnSortable(column);
          const key = () => column.key;
          const activeSort = () => props.sortKey() === key();
          const headerButtonClass = () =>
            classNames(styles.headerSortButton, activeSort() && styles.headerSortButtonActive);

          return (
            <div
              role="columnheader"
              tabIndex={props.reorderable() ? 0 : -1}
              aria-sort={props.getAriaSort(column)}
              class={classNames(
                styles.headerCell,
                sortable() && styles.headerSortable,
                props.draggingColumnKey() === key() && styles.headerDragging,
                props.dragOverColumnKey() === key() && styles.headerDragOver,
                props.getColumnPin(column) === 'left' && styles.pinnedLeft,
                props.getColumnPin(column) === 'right' && styles.pinnedRight
              )}
              style={props.getColumnStyle(column)}
              draggable={props.reorderable()}
              onDragStart={(e) => props.onHeaderDragStart(key(), e)}
              onDragOver={(e) => props.onHeaderDragOver(key(), e)}
              onDrop={(e) => props.onHeaderDrop(key(), e)}
              onDragEnd={props.onHeaderDragEnd}
            >
              <Button
                variant="ghost"
                size="sm"
                class={headerButtonClass()}
                disabled={!sortable()}
                onClick={() => props.onSort(column)}
              >
                <span class={styles.headerLabel}>{column.header}</span>
                <Show when={sortable()}>
                  <span class={classNames(styles.sortIcon, activeSort() && styles.sortActive)}>
                    <Show when={activeSort() && props.sortDirection() === 'desc'} fallback={<IoCaretUp />}>
                      <IoCaretDown />
                    </Show>
                  </span>
                </Show>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                iconOnly
                class={styles.resizeHandle}
                aria-label={props.resizeColumnLabel?.(column.header)}
                onMouseDown={(e) => props.onResizeStart(key(), e)}
                onClick={(e) => e.stopPropagation()}
              >
                <span class={styles.resizeHandleVisual} aria-hidden="true" />
              </Button>
            </div>
          );
        }}
      </For>
    </div>
  );
};

export default DataGridProHeader;
