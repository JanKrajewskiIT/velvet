import { IoCaretDown, IoCaretUp } from 'solid-icons/io';
import { type Accessor, For, type JSX, Show } from 'solid-js';

import Button from '~/components/buttons/Button/Button';
import Checkbox from '~/components/switchers/Checkbox/Checkbox';
import { useI18n } from '~/i18n/I18nProvider';
import classNames from '~/utils/classNames';

import styles from './DataGridPro.module.css';
import type { DataGridProColumn } from './DataGridPro.types';

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
}

const DataGridProHeader = <T extends Record<string, unknown>>(props: DataGridProHeaderProps<T>) => {
  const { t } = useI18n();
  return (
    <div class={styles.header} style={{ height: `${props.headerHeight()}px` }}>
      <Show when={props.selectable()}>
        <div class={classNames(styles.headerCell, styles.pinnedLeft, styles.selectionHeaderCell)}>
          <Checkbox
            checked={props.allVisibleSelected()}
            onChange={props.onToggleAllVisible}
            aria-label={t('table.selectAllVisibleRows')}
          />
        </div>
      </Show>
      <For each={props.visibleColumns()}>
        {(column) => {
          const sortable = () => props.isColumnSortable(column);
          const key = () => column.key;
          const activeSort = () => props.sortKey() === key();
          const headerButtonClass = () =>
            classNames(styles.headerSortButton, sortable() && styles.headerSortButtonActive);

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
                aria-label={t('table.resizeColumn', { label: column.header })}
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
