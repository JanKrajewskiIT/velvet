import { children as resolveChildren, Show } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { Button } from '../actions/Button';
import type { TableController } from './tableController';

export interface TableBulkBarProps<T extends object> {
  table: TableController<T>;
}

export const TableBulkBar = <T extends object>(props: TableBulkBarProps<T>) => {
  const translate = useTranslate();
  const bulkActions = resolveChildren(() => props.table.config.bulkActions);

  return (
    <Show when={props.table.config.selectable && bulkActions() && props.table.config.selected.length > 0}>
      <div class="vui-table__bulk" role="region" aria-label={translate('velvet.data.table.bulkActionsLabel')}>
        <span>{translate('velvet.data.table.selected', { count: props.table.config.selected.length })}</span>
        <div class="vui-table__bulk-actions">{bulkActions()}</div>
        <Button variant="ghost" size="sm" onClick={props.table.selection.clear}>
          {translate('velvet.common.clear')}
        </Button>
      </div>
    </Show>
  );
};
