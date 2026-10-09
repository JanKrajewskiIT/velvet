import { Show } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { Button } from '../actions/Button';
import { Popover } from '../feedback/Popover';
import { SearchInput } from '../forms/SearchInput';
import { emptyQuery, QueryBuilder } from '../patterns/QueryBuilder';
import { Count } from '../primitives/Count';
import { ColumnManager } from './ColumnManager';
import type { DataGridController } from './dataGridController';
import { exportGridRows } from './gridExport';
import { GridSelectedCount } from './GridSelectedCount';

export interface GridToolbarProps<T extends object> {
  grid: DataGridController<T>;
}

/** Search or bulk bar on the left; Filters, Columns, Export and `toolbarEnd` on the right. Renders nothing when no tool is enabled. */
export const GridToolbar = <T extends object>(props: GridToolbarProps<T>) => {
  const translate = useTranslate();
  const hasToolbar = () =>
    props.grid.config.searchable ||
    !!props.grid.config.filterFields ||
    props.grid.config.columnManager ||
    props.grid.config.onExport !== undefined ||
    !!props.grid.config.toolbarEnd ||
    (props.grid.config.selectable && !!props.grid.config.bulkActions);

  return (
    <Show when={hasToolbar()}>
      <div class="vui-dgrid__bar">
        <Show
          when={props.grid.config.selectable && props.grid.selection.selectedRows().length > 0}
          fallback={
            <Show when={props.grid.config.searchable}>
              <SearchInput
                size="sm"
                class="vui-dgrid__search"
                aria-label={translate('velvet.data.dataGrid.searchLabel')}
                placeholder={
                  props.grid.config.searchPlaceholder ??
                  translate('velvet.data.dataGrid.searchPlaceholder', { count: props.grid.config.rows.length })
                }
                value={props.grid.view.search()}
                onValueChange={props.grid.view.setSearch}
              />
            </Show>
          }
        >
          <div class="vui-dgrid__bulk">
            <span class="vui-dgrid__bulk-n">
              <GridSelectedCount count={props.grid.selection.selectedRows().length} />
            </span>
            <Button size="sm" variant="ghost" onClick={props.grid.selection.clear}>
              {translate('velvet.common.clear')}
            </Button>
            {props.grid.config.bulkActions?.(props.grid.selection.selectedRows())}
          </div>
        </Show>
        <div class="vui-dgrid__tools">
          <Show when={props.grid.config.filterFields}>
            {(fields) => (
              <Popover
                class="vui-dgrid__pop vui-dgrid__pop--wide"
                align="end"
                title={translate('velvet.data.dataGrid.filters')}
                trigger={
                  <Button size="sm" variant="secondary" iconLeft="filter">
                    {translate('velvet.data.dataGrid.filters')}
                    <Show when={props.grid.view.activeFilters() > 0}>
                      <Count value={props.grid.view.activeFilters()} size="sm" class="vui-dgrid__count" />
                    </Show>
                  </Button>
                }
              >
                <QueryBuilder
                  fields={fields()}
                  value={props.grid.view.query()}
                  onValueChange={props.grid.view.setQuery}
                />
                <Show when={props.grid.view.activeFilters() > 0}>
                  <div class="vui-dgrid__popfoot">
                    <Button size="sm" variant="ghost" onClick={() => props.grid.view.setQuery(emptyQuery(fields()))}>
                      {translate('velvet.data.dataGrid.resetFilters')}
                    </Button>
                  </div>
                </Show>
              </Popover>
            )}
          </Show>
          <Show when={props.grid.config.columnManager}>
            <Popover
              class="vui-dgrid__pop"
              align="end"
              trigger={
                <Button size="sm" variant="secondary" iconLeft="sliders">
                  {translate('velvet.data.dataGrid.columns')}
                </Button>
              }
            >
              <ColumnManager
                columns={props.grid.config.columns.map((c) => ({
                  key: c.key,
                  label: c.label,
                  visible: !c.hidden,
                  pin: c.pin,
                  locked: c.locked,
                }))}
                value={props.grid.view.columnState()}
                onValueChange={props.grid.view.setColumnState}
              />
            </Popover>
          </Show>
          <Show when={props.grid.config.onExport !== undefined}>
            <Button
              size="sm"
              variant="secondary"
              iconLeft="download"
              onClick={() => exportGridRows(props.grid.view.rows(), props.grid.view.cols(), props.grid.config.onExport)}
            >
              {translate('velvet.data.dataGrid.export')}
            </Button>
          </Show>
          {props.grid.config.toolbarEnd}
        </div>
      </div>
    </Show>
  );
};
