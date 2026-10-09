import { For, Show } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { Checkbox } from '../forms/Checkbox';
import type { DataGridController } from './dataGridController';
import { GridCell } from './GridCell';

export interface GridRowProps<T extends object> {
  grid: DataGridController<T>;
  row: T;
  /** Zero-based position in the current view. */
  index: number;
}

/** One data row (number, checkbox, cells) plus its detail row while expanded. */
export const GridRow = <T extends object>(props: GridRowProps<T>) => {
  const translate = useTranslate();
  const key = () => props.grid.keyOf(props.row, props.index);
  const isSelected = () => props.grid.selection.selectedSet().has(key());
  const isOpen = () => !!props.grid.config.renderDetail && props.grid.expansion.open().has(key());
  return (
    <>
      <div
        role="row"
        aria-rowindex={props.index + 2}
        aria-selected={props.grid.config.selectable ? isSelected() : undefined}
        aria-expanded={props.grid.config.renderDetail ? isOpen() : undefined}
        class={cx(
          'vui-grid__row',
          props.grid.active.cell().row === props.index && 'vui-grid__row--cur',
          isSelected() && 'vui-grid__row--sel',
          isOpen() && 'vui-grid__row--open',
        )}
      >
        <Show when={props.grid.config.rowNumbers}>
          <div class="vui-grid__rn" aria-hidden="true">
            {props.index + 1}
          </div>
        </Show>
        <Show when={props.grid.config.selectable}>
          <div class="vui-grid__chk" style={props.grid.layout.checkLeft()}>
            <Checkbox
              tabIndex={-1}
              aria-label={translate('velvet.data.dataGrid.selectRow', { row: props.index + 1 })}
              checked={isSelected()}
              onChange={() => props.grid.selection.toggleRow(key())}
            />
          </div>
        </Show>
        <For each={props.grid.view.cols()}>
          {(c, ci) => (
            <GridCell
              grid={props.grid}
              column={c}
              row={props.row}
              rowKey={key()}
              rowIndex={props.index}
              colIndex={ci()}
              open={isOpen()}
            />
          )}
        </For>
      </div>
      <Show when={isOpen()}>
        <div role="row" class="vui-grid__row vui-grid__row--detail">
          <div role="gridcell" class="vui-grid__detail">
            <div class="vui-grid__detail-in" style={{ 'padding-left': `${props.grid.layout.leadWidth() + 36}px` }}>
              {props.grid.config.renderDetail?.(props.row)}
            </div>
          </div>
        </div>
      </Show>
    </>
  );
};
