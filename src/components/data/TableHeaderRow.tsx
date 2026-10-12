import { For, Show } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { Checkbox } from '../forms/Checkbox';
import { ColumnResize } from '../primitives/ColumnResize';
import { Glyph } from '../primitives/Glyph';
import { columnName } from './columnName';
import { cssLength, nextSort } from './rowData';
import type { TableController } from './tableController';
import type { TableColumn, TableSort } from './tableTypes';

export interface TableHeaderRowProps<T extends object> {
  table: TableController<T>;
}

const ariaSort = (sort: TableSort | null, key: string): 'ascending' | 'descending' | undefined => {
  if (sort?.key !== key) return undefined;
  return sort.dir === 'asc' ? 'ascending' : 'descending';
};

export const TableHeaderRow = <T extends object>(props: TableHeaderRowProps<T>) => {
  const translate = useTranslate();
  const resizeHandle = (c: TableColumn<T>) => (
    <Show when={props.table.config.resizable}>
      <ColumnResize
        label={translate('velvet.data.table.resizeColumn', { name: columnName(c) })}
        width={props.table.widths.widths()[c.key]}
        onResize={(w) => props.table.widths.setWidth(c.key, w)}
        onReset={() => props.table.widths.resetWidth(c.key)}
      />
    </Show>
  );

  return (
    <tr>
      <Show when={props.table.config.selectable}>
        <th
          class={cx('vui-table__check', props.table.pins.checkPinned() && 'vui-table__pin vui-table__pin--left')}
          style={props.table.pins.checkPinned() ? { position: 'sticky', left: '0' } : undefined}
        >
          <Checkbox
            aria-label={translate('velvet.data.table.selectAll')}
            checked={props.table.selection.allOn()}
            onChange={props.table.selection.toggleAll}
            disabled={props.table.config.loading}
            indeterminate={props.table.selection.someOn()}
          />
        </th>
      </Show>
      <For each={props.table.config.columns}>
        {(c) => (
          <th
            class={cx(props.table.pins.cellClass(c), c.sortable && 'vui-table__sortable')}
            style={{
              width: cssLength(props.table.widths.widths()[c.key] ?? c.width),
              ...props.table.pins.pinStyle(c.key),
            }}
            aria-sort={c.sortable ? ariaSort(props.table.sort.sort(), c.key) : undefined}
          >
            <Show when={c.sortable} fallback={c.label}>
              <button
                type="button"
                class="vui-table__sort"
                onClick={() => props.table.sort.setSort(nextSort(props.table.sort.sort(), c.key))}
              >
                {c.label}
                <Glyph name="arrow-up" />
              </button>
            </Show>
            {resizeHandle(c)}
          </th>
        )}
      </For>
      <Show when={props.table.config.renderExpanded}>
        <th class="vui-table__exp" aria-label={translate('velvet.data.table.details')} />
      </Show>
    </tr>
  );
};
