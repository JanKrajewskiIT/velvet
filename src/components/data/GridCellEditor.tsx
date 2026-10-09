import { For, Show } from 'solid-js';

import type { DataGridController } from './dataGridController';
import type { GridColumn } from './dataGridTypes';

export interface GridCellEditorProps<T extends object> {
  grid: DataGridController<T>;
  column: GridColumn<T>;
  rowIndex: number;
  colIndex: number;
}

const focusOnMount = (el: HTMLElement) => queueMicrotask(() => el.focus());

/** In-cell editor: a select when the column has `options`, otherwise a text input. */
export const GridCellEditor = <T extends object>(props: GridCellEditorProps<T>) => (
  <Show
    when={props.column.options}
    fallback={
      <input
        ref={focusOnMount}
        class="vui-grid__input"
        value={props.grid.active.draft()}
        inputMode={props.column.type === 'number' ? 'decimal' : undefined}
        onInput={(e) => props.grid.active.setDraft(e.currentTarget.value)}
        onBlur={() => props.grid.active.commit()}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            props.grid.active.commit('down');
          } else if (e.key === 'Tab') {
            e.preventDefault();
            props.grid.active.commit('right');
          } else if (e.key === 'Escape') {
            e.preventDefault();
            props.grid.active.cancelEdit(props.rowIndex, props.colIndex);
          }
        }}
      />
    }
  >
    {(options) => (
      <select
        ref={focusOnMount}
        class="vui-grid__input"
        value={props.grid.active.draft()}
        onChange={(e) => props.grid.active.setDraft(e.currentTarget.value)}
        onBlur={() => props.grid.active.commit()}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            props.grid.active.commit('down');
          } else if (e.key === 'Escape') {
            props.grid.active.cancelEdit(props.rowIndex, props.colIndex);
          }
        }}
      >
        <For each={options()}>
          {(o) => (
            <option value={o} selected={o === props.grid.active.draft()}>
              {o}
            </option>
          )}
        </For>
      </select>
    )}
  </Show>
);
