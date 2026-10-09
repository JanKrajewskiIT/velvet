import type { TableExpansion } from './createTableExpansion';
import type { TablePins } from './createTablePins';
import type { TableSelection } from './createTableSelection';
import type { TableSortState } from './createTableSort';
import type { TableWidths } from './createTableWidths';
import type { RowKey } from './rowData';
import type { TableConfig } from './tableTypes';

export interface TableController<T extends object> {
  config: TableConfig<T>;
  sort: TableSortState<T>;
  widths: TableWidths;
  pins: TablePins<T>;
  selection: TableSelection;
  expansion: TableExpansion;
  onRowKey: (e: KeyboardEvent & { currentTarget: HTMLTableRowElement }, key: RowKey) => void;
  keyOf: (row: T, index: number) => RowKey;
  span: () => number;
}
