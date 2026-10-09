import { children as resolveChildren, Show } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { Button } from '../actions/Button';
import type { TableController } from './tableController';

export interface TableToolbarProps<T extends object> {
  table: TableController<T>;
}

export const TableToolbar = <T extends object>(props: TableToolbarProps<T>) => {
  const translate = useTranslate();
  const title = resolveChildren(() => props.table.config.title);
  const toolbar = resolveChildren(() => props.table.config.toolbar);
  const count = resolveChildren(() => props.table.config.count);

  const countNode = () => (count() != null ? count() : title() ? props.table.config.rows.length : null);
  const showHead = () =>
    !!title() || !!toolbar() || count() != null || (props.table.config.resizable && props.table.widths.anyWidth());

  return (
    <Show when={showHead()}>
      <div class="vui-table__toolbar">
        <Show when={title()}>
          <span class="vui-table__title">{title()}</span>
        </Show>
        <Show when={countNode() != null}>
          <span class="vui-table__count">{countNode()}</span>
        </Show>
        <div class="vui-table__tools">
          <Show when={props.table.config.resizable && props.table.widths.anyWidth()}>
            <Button variant="secondary" size="sm" onClick={props.table.widths.resetWidths}>
              {translate('velvet.data.table.resetWidths')}
            </Button>
          </Show>
          {toolbar()}
        </div>
      </div>
    </Show>
  );
};
