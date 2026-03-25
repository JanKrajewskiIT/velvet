import type { JSX } from 'solid-js';
import { type Accessor, For, Show } from 'solid-js';

import Checkbox from '~/components/switchers/Checkbox/Checkbox';
import { useI18n } from '~/i18n/I18nProvider';
import classNames from '~/utils/classNames';

import styles from './DataGridPro.module.css';
import type { DataGridProColumn } from './DataGridPro.types';

interface VisibleRow<T extends Record<string, unknown>> {
  row: T;
  index: number;
  id: string;
}

interface DataGridProBodyProps<T extends Record<string, unknown>> {
  hasRows: Accessor<boolean>;
  emptyMessage: string | undefined;
  bodyHeight: Accessor<number>;
  totalRowsHeight: Accessor<number>;
  offsetY: Accessor<number>;
  visibleRows: Accessor<readonly VisibleRow<T>[]>;
  rowClass: (index: number) => string;
  rowHeight: Accessor<number>;
  selectable: Accessor<boolean>;
  selectedSet: Accessor<Set<string>>;
  onToggleRow: (id: string) => void;
  visibleColumns: Accessor<readonly DataGridProColumn<T>[]>;
  getColumnPin: (column: DataGridProColumn<T>) => 'left' | 'right' | null;
  getColumnStyle: (column: DataGridProColumn<T>) => JSX.CSSProperties;
}

const DataGridProBody = <T extends Record<string, unknown>>(props: DataGridProBodyProps<T>) => {
  const { t } = useI18n();
  const handleCheckboxClick = (event: MouseEvent & { currentTarget: HTMLInputElement }) => {
    event.stopPropagation();
  };

  return (
    <Show
      when={props.hasRows()}
      fallback={
        <div class={styles.empty} style={{ height: `${props.bodyHeight()}px` }}>
          {props.emptyMessage ?? t('table.noRows')}
        </div>
      }
    >
      <div class={styles.body} style={{ height: `${props.totalRowsHeight()}px` }}>
        <div class={styles.rows} style={{ transform: `translateY(${props.offsetY()}px)` }}>
          <For each={props.visibleRows()}>
            {(entry) => (
              <div class={props.rowClass(entry.index)} style={{ height: `${props.rowHeight()}px` }}>
                <Show when={props.selectable()}>
                  <div class={classNames(styles.cell, styles.pinnedLeft, styles.selectionCell)}>
                    <Checkbox
                      checked={props.selectedSet().has(entry.id)}
                      onClick={handleCheckboxClick}
                      onChange={() => props.onToggleRow(entry.id)}
                      aria-label={t('table.selectRow', { id: entry.id })}
                    />
                  </div>
                </Show>
                <For each={props.visibleColumns()}>
                  {(column) => (
                    <div
                      class={classNames(
                        styles.cell,
                        props.getColumnPin(column) === 'left' && styles.pinnedLeft,
                        props.getColumnPin(column) === 'right' && styles.pinnedRight
                      )}
                      style={props.getColumnStyle(column)}
                    >
                      {column.render
                        ? column.render(entry.row[column.key], entry.row)
                        : (() => {
                            const val = entry.row[column.key];
                            return val == null ? '' : typeof val === 'string' ? val : String(val);
                          })()}
                    </div>
                  )}
                </For>
              </div>
            )}
          </For>
        </div>
      </div>
    </Show>
  );
};

export default DataGridProBody;
