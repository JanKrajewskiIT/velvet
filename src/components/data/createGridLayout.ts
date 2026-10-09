import { type Accessor, createMemo, createSignal, type JSX, untrack } from 'solid-js';

import { cx } from '../../utils/cx';
import type { GridColumn } from './dataGridTypes';
import { CHECK_WIDTH, DEFAULT_COLUMN_WIDTH, ROW_NUMBER_WIDTH } from './gridColumns';

export interface GridLayoutOptions<T extends object> {
  columns: Accessor<GridColumn<T>[]>;
  /** Visible columns in display order. */
  cols: Accessor<GridColumn<T>[]>;
  rowNumbers: Accessor<boolean | undefined>;
  selectable: Accessor<boolean | undefined>;
}

export interface GridLayout<T extends object> {
  widths: Accessor<Record<string, number>>;
  setWidth: (key: string, width: number) => void;
  /** Width of the row-number and checkbox columns. */
  leadWidth: () => number;
  template: () => string;
  pinClass: (c: GridColumn<T>) => string | false;
  pinStyle: (c: GridColumn<T>) => JSX.CSSProperties | undefined;
  checkLeft: () => JSX.CSSProperties;
}

export const createGridLayout = <T extends object>(options: GridLayoutOptions<T>): GridLayout<T> => {
  const [widths, setWidths] = createSignal<Record<string, number>>(
    untrack(() => Object.fromEntries(options.columns().map((c) => [c.key, c.width ?? DEFAULT_COLUMN_WIDTH]))),
  );
  const setWidth = (key: string, width: number) => setWidths((x) => ({ ...x, [key]: width }));
  const columnWidth = (key: string) => widths()[key] ?? DEFAULT_COLUMN_WIDTH;

  const leadWidth = () => (options.rowNumbers() ? ROW_NUMBER_WIDTH : 0) + (options.selectable() ? CHECK_WIDTH : 0);
  const pinLeft = createMemo(() => {
    const offsets: Record<string, number> = {};
    let x = leadWidth();
    let last: string | undefined;
    options.cols().forEach((c) => {
      if (c.pin !== 'left') return;
      offsets[c.key] = x;
      x += columnWidth(c.key);
      last = c.key;
    });
    return { offsets, last };
  });
  const template = () =>
    [
      options.rowNumbers() && `${ROW_NUMBER_WIDTH}px`,
      options.selectable() && `${CHECK_WIDTH}px`,
      ...options.cols().map((c) => `${columnWidth(c.key)}px`),
    ]
      .filter(Boolean)
      .join(' ');
  const pinClass = (c: GridColumn<T>) =>
    c.pin === 'left' && cx('vui-grid__pin', c.key === pinLeft().last && 'vui-grid__pin--last');
  const pinStyle = (c: GridColumn<T>): JSX.CSSProperties | undefined =>
    c.pin === 'left' ? { left: `${pinLeft().offsets[c.key] ?? 0}px` } : undefined;
  const checkLeft = (): JSX.CSSProperties => ({ left: `${options.rowNumbers() ? ROW_NUMBER_WIDTH : 0}px` });

  return { widths, setWidth, leadWidth, template, pinClass, pinStyle, checkLeft };
};
