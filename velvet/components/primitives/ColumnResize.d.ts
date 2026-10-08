import * as React from 'react';
/** Atom. Column-width handle for a header cell's right edge: drag, ←/→ (keyboard), double-click to reset. Table and DataGrid use it. Place inside a position:relative header cell. */
export interface ColumnResizeProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'onResize'> {
  /** Accessible name, e.g. "Resize Name" */
  label: string;
  /** Current width in px (falls back to the measured cell) */
  width?: number;
  /** @default 64 */
  min?: number;
  /** Keyboard step in px. @default 16 */
  step?: number;
  onResize?: (width: number) => void;
  /** Double-click — usually clears the custom width */
  onReset?: () => void;
}
export declare function ColumnResize(props: ColumnResizeProps): JSX.Element;
