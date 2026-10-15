import { For, Show } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { Checkbox } from '../forms/Checkbox';
import { Glyph } from '../primitives/Glyph';
import { Text } from '../primitives/Text';
import { cellText, rowValue } from './rowData';
import type { TableController } from './tableController';
import styles from './TableRow.module.css';

export interface TableRowProps<T extends object> {
  table: TableController<T>;
  row: T;
  index: number;
}

export const TableRow = <T extends object>(props: TableRowProps<T>) => {
  const translate = useTranslate();
  const key = () => props.table.keyOf(props.row, props.index);
  const on = () => props.table.selection.isSelected(key());
  const open = () => !!props.table.config.renderExpanded && props.table.expansion.isOpen(key());
  return (
    <>
      <tr
        tabIndex={0}
        aria-selected={props.table.config.selectable ? on() : undefined}
        aria-expanded={props.table.config.renderExpanded ? open() : undefined}
        class={cx(styles.row, open() && styles.tablePartRowVariantOpen)}
        onKeyDown={(e) => props.table.onRowKey(e, key())}
      >
        <Show when={props.table.config.selectable}>
          <td
            class={props.table.pins.checkPinned() ? cx(styles.tablePartPin, styles.tablePartPinVariantLeft) : undefined}
            style={props.table.pins.checkPinned() ? { position: 'sticky', left: '0' } : undefined}
          >
            <Checkbox
              tabIndex={-1}
              aria-label={translate('velvet.data.table.selectRow')}
              checked={on()}
              onClick={(e) => props.table.selection.clickCheck(e, props.index, key())}
            />
          </td>
        </Show>
        <For each={props.table.config.columns}>
          {(c) => (
            <td class={props.table.pins.cellClass(c)} style={props.table.pins.pinStyle(c.key)}>
              {c.render ? (
                c.render(props.row)
              ) : (
                <Text as="span" variant="body" tone="inherit">
                  {cellText(rowValue(props.row, c.key))}
                </Text>
              )}
            </td>
          )}
        </For>
        <Show when={props.table.config.renderExpanded}>
          <td class={styles.tablePartExp}>
            <button
              type="button"
              tabIndex={-1}
              class={styles.tablePartExpbtn}
              aria-label={translate(open() ? 'velvet.data.table.collapseRow' : 'velvet.data.table.expandRow')}
              aria-expanded={open()}
              onClick={() => props.table.expansion.toggleExpanded(key())}
            >
              <Glyph name="chevron-down" />
            </button>
          </td>
        </Show>
      </tr>
      <Show when={open()}>
        <tr class={cx(styles.row, styles.tablePartDetail)}>
          <td colSpan={props.table.span()}>
            <div class={styles.tablePartDetailIn}>{props.table.config.renderExpanded?.(props.row)}</div>
          </td>
        </tr>
      </Show>
    </>
  );
};
