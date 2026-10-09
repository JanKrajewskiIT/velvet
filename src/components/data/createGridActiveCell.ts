import { type Accessor, createSignal, type Setter } from 'solid-js';

import type { CellPosition, EditMove, GridColumn, GridRowChange } from './dataGridTypes';
import { cellText, rowId, rowValue } from './rowData';

export interface GridActiveCellOptions<T extends object> {
  getGrid: () => HTMLElement;
  /** Visible columns in display order. */
  cols: Accessor<GridColumn<T>[]>;
  /** Rows after search, filters and sort. */
  view: Accessor<T[]>;
  rows: Accessor<T[]>;
  rowKey: Accessor<string>;
  onRowsChange: (rows: T[], change: GridRowChange) => void;
}

export interface GridActiveCell {
  cell: Accessor<CellPosition>;
  setCell: Setter<CellPosition>;
  edit: Accessor<CellPosition | null>;
  draft: Accessor<string>;
  setDraft: Setter<string>;
  focusCell: (row: number, col: number) => void;
  startEdit: (row: number, col: number, seed?: string) => void;
  commit: (move?: EditMove) => void;
  cancelEdit: (row: number, col: number) => void;
}

export const createGridActiveCell = <T extends object>(options: GridActiveCellOptions<T>): GridActiveCell => {
  const [cell, setCell] = createSignal<CellPosition>({ row: 0, col: 0 });
  const [edit, setEdit] = createSignal<CellPosition | null>(null);
  const [draft, setDraft] = createSignal('');

  const focusCell = (row: number, col: number) => {
    setCell({ row, col });
    requestAnimationFrame(() => options.getGrid().querySelector<HTMLElement>(`[data-rc="${row}-${col}"]`)?.focus());
  };

  const startEdit = (row: number, col: number, seed?: string) => {
    const column = options.cols()[col];
    const record = options.view()[row];
    if (!column?.editable || !record) return;
    setEdit({ row, col });
    setDraft(seed ?? cellText(rowValue(record, column.key)));
  };

  const commit = (move: EditMove = 'stay') => {
    const current = edit();
    if (!current) return;
    const column = options.cols()[current.col];
    const record = options.view()[current.row];
    setEdit(null);
    if (column && record) {
      const previous = rowValue(record, column.key);
      const parsed = parseFloat(draft().replace(',', '.'));
      const value = column.type === 'number' ? (Number.isNaN(parsed) ? previous : parsed) : draft();
      if (value !== previous) {
        const id = rowValue(record, options.rowKey());
        options.onRowsChange(
          options.rows().map((x) => (rowValue(x, options.rowKey()) === id ? { ...x, [column.key]: value } : x)),
          { row: rowId(record, options.rowKey(), current.row), key: column.key, value },
        );
      }
    }
    if (move === 'down') focusCell(Math.min(options.view().length - 1, current.row + 1), current.col);
    else if (move === 'right') focusCell(current.row, Math.min(options.cols().length - 1, current.col + 1));
    else focusCell(current.row, current.col);
  };

  const cancelEdit = (row: number, col: number) => {
    setEdit(null);
    focusCell(row, col);
  };

  return { cell, setCell, edit, draft, setDraft, focusCell, startEdit, commit, cancelEdit };
};
