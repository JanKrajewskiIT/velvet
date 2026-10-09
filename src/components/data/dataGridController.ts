import type { GridActiveCell } from './createGridActiveCell';
import type { GridExpansion } from './createGridExpansion';
import type { GridLayout } from './createGridLayout';
import type { GridSelection } from './createGridSelection';
import type { GridView } from './createGridView';
import type { DataGridProps } from './dataGridTypes';
import type { RowKey } from './rowData';

/** Everything the DataGrid parts share: resolved props plus the state owned by the grid hooks. */
export interface DataGridController<T extends object> {
  config: DataGridProps<T>;
  view: GridView<T>;
  selection: GridSelection<T>;
  layout: GridLayout<T>;
  active: GridActiveCell;
  expansion: GridExpansion;
  keyOf: (row: T, index: number) => RowKey;
}
