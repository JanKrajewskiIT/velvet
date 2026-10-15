import { children as resolveChildren, Show } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { Button } from '../actions/Button';
import { Text } from '../primitives/Text';
import { typographyClass } from '../primitives/typography';
import styles from './TableBulkBar.module.css';
import type { TableController } from './tableController';

export interface TableBulkBarProps<T extends object> {
  table: TableController<T>;
}

export const TableBulkBar = <T extends object>(props: TableBulkBarProps<T>) => {
  const translate = useTranslate();
  const bulkActions = resolveChildren(() => props.table.config.bulkActions);

  return (
    <Show when={props.table.config.selectable && bulkActions() && props.table.config.selected.length > 0}>
      <div
        class={cx(styles.tablePartBulk, typographyClass('body-sm'))}
        role="region"
        aria-label={translate('velvet.data.table.bulkActionsLabel')}
      >
        <Text as="span" variant="label" tone="inherit">
          {translate('velvet.data.table.selected', { count: props.table.config.selected.length })}
        </Text>
        <div class={styles.tablePartBulkActions}>{bulkActions()}</div>
        <Button variant="ghost" size="sm" onClick={props.table.selection.clear}>
          {translate('velvet.common.clear')}
        </Button>
      </div>
    </Show>
  );
};
