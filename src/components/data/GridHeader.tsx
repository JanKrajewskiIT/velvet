import { For, Show } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { Checkbox } from '../forms/Checkbox';
import { ColumnResize } from '../primitives/ColumnResize';
import { Glyph } from '../primitives/Glyph';
import type { DataGridController } from './dataGridController';
import { columnName } from './gridColumns';
import { nextSort } from './rowData';

export interface GridHeaderProps<T extends object> {
  grid: DataGridController<T>;
}

/** Header row: row-number and select-all cells, then one sortable, resizable cell per visible column. */
export const GridHeader = <T extends object>(props: GridHeaderProps<T>) => {
  const translate = useTranslate();
  return (
    <div role="row" class="vui-grid__row vui-grid__row--head">
      <Show when={props.grid.config.rowNumbers}>
        <div class="vui-grid__rn" aria-hidden="true">
          #
        </div>
      </Show>
      <Show when={props.grid.config.selectable}>
        <div class="vui-grid__chk" style={props.grid.layout.checkLeft()}>
          <Checkbox
            aria-label={translate('velvet.data.dataGrid.selectAllRows')}
            checked={props.grid.selection.allOn()}
            indeterminate={props.grid.selection.someOn()}
            onChange={props.grid.selection.toggleAll}
          />
        </div>
      </Show>
      <For each={props.grid.view.cols()}>
        {(c) => {
          const sorted = () => props.grid.view.sort()?.key === c.key;
          return (
            <div
              role="columnheader"
              aria-sort={sorted() ? (props.grid.view.sort()?.dir === 'asc' ? 'ascending' : 'descending') : undefined}
              class={cx('vui-grid__hd', c.type === 'number' && 'vui-grid__num', props.grid.layout.pinClass(c))}
              style={props.grid.layout.pinStyle(c)}
            >
              <button
                type="button"
                tabIndex={-1}
                class="vui-grid__hbtn"
                onClick={() => props.grid.view.setSort(nextSort(props.grid.view.sort(), c.key))}
              >
                {c.label}
                <Show
                  when={sorted()}
                  fallback={<Glyph name="chevrons-up-down" class="vui-grid__sort vui-grid__sort--idle" />}
                >
                  <Glyph
                    name={props.grid.view.sort()?.dir === 'asc' ? 'arrow-up' : 'arrow-down'}
                    class="vui-grid__sort"
                  />
                </Show>
                <Show when={c.editable}>
                  <Glyph name="pencil" class="vui-grid__edit-ic" />
                </Show>
              </button>
              <ColumnResize
                label={translate('velvet.data.dataGrid.resizeColumn', { name: columnName(c) })}
                width={props.grid.layout.widths()[c.key]}
                onResize={(w) => props.grid.layout.setWidth(c.key, w)}
              />
            </div>
          );
        }}
      </For>
    </div>
  );
};
