import { type Accessor, createEffect, createMemo, createSignal, type JSX, onCleanup } from 'solid-js';

import { variantClass } from '../../utils/cssModule';
import { cx } from '../../utils/cx';
import styles from './createTablePins.module.css';
import type { TableColumn } from './tableTypes';

const TABLE_PART_PIN_CLASSES = {
  edge: styles.tablePartPinVariantEdge,
  left: styles.tablePartPinVariantLeft,
  right: styles.tablePartPinVariantRight,
} as const;

interface PinOffset {
  side: 'left' | 'right';
  offset: number;
  edge: boolean;
}

export interface TablePinsOptions<T extends object> {
  columns: Accessor<TableColumn<T>[]>;
  selectable: Accessor<boolean>;
  hasExpander: Accessor<boolean>;
  widths: Accessor<Record<string, number>>;
  head: () => HTMLElement;
  scroller: () => HTMLElement;
}

export interface TablePins<T extends object> {
  hasPins: () => boolean;
  checkPinned: () => boolean;
  scrolled: Accessor<{ left: boolean; right: boolean }>;
  updateScrolled: () => void;
  pinStyle: (key: string) => JSX.CSSProperties;
  cellClass: (c: TableColumn<T>) => string;
}

export const createTablePins = <T extends object>(options: TablePinsOptions<T>): TablePins<T> => {
  const [pinOffsets, setPinOffsets] = createSignal<Record<string, PinOffset>>({});
  const [scrolled, setScrolled] = createSignal({ left: false, right: false });

  const hasPins = createMemo(() => options.columns().some((c) => c.pin));
  const pinSignature = createMemo(() =>
    options
      .columns()
      .map((c) => `${c.key}:${c.pin ?? ''}`)
      .join('|'),
  );
  const hasLeftPin = () => options.columns().some((c) => c.pin === 'left');
  const checkPinned = () => hasPins() && hasLeftPin() && options.selectable();

  createEffect(() => {
    pinSignature();
    options.widths();
    const selectable = options.selectable();
    const hasExpander = options.hasExpander();
    if (!hasPins()) {
      setPinOffsets({});
      return;
    }
    const head = options.head();
    const measure = () => {
      const cells = [...head.querySelectorAll('th')];
      const lead = selectable ? 1 : 0;
      const widthAt = (i: number) => cells[i]?.getBoundingClientRect().width ?? 0;
      const next: Record<string, PinOffset> = {};
      let x = selectable ? widthAt(0) : 0;
      const columns = options.columns();
      columns.forEach((c, i) => {
        if (c.pin !== 'left') return;
        next[c.key] = { side: 'left', offset: x, edge: false };
        x += widthAt(i + lead);
      });
      let y = hasExpander ? widthAt(cells.length - 1) : 0;
      for (let i = columns.length - 1; i >= 0; i--) {
        const c = columns[i];
        if (c?.pin !== 'right') continue;
        next[c.key] = { side: 'right', offset: y, edge: false };
        y += widthAt(i + lead);
      }
      const lastLeft = [...columns].reverse().find((c) => c.pin === 'left');
      const firstRight = columns.find((c) => c.pin === 'right');
      [lastLeft, firstRight].forEach((c) => {
        const entry = c && next[c.key];
        if (entry) entry.edge = true;
      });
      setPinOffsets(next);
    };
    measure();
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(measure);
    observer.observe(head);
    onCleanup(() => observer.disconnect());
  });

  const updateScrolled = () => {
    if (!hasPins()) return;
    const scroller = options.scroller();
    const left = scroller.scrollLeft > 0;
    const right = scroller.scrollLeft < scroller.scrollWidth - scroller.clientWidth - 1;
    if (left !== scrolled().left || right !== scrolled().right) setScrolled({ left, right });
  };
  createEffect(() => {
    pinSignature();
    pinOffsets();
    updateScrolled();
  });

  const pinStyle = (key: string): JSX.CSSProperties => {
    const pin = pinOffsets()[key];
    if (!pin) return {};
    const offset = `${pin.offset}px`;
    return pin.side === 'left' ? { position: 'sticky', left: offset } : { position: 'sticky', right: offset };
  };
  const pinClass = (key: string) => {
    const pin = pinOffsets()[key];
    return (
      pin &&
      cx(
        styles.tablePartPin,
        variantClass(TABLE_PART_PIN_CLASSES, pin.side),
        pin.edge && styles.tablePartPinVariantEdge,
      )
    );
  };
  const cellClass = (c: TableColumn<T>) =>
    cx(c.align === 'right' && styles.tablePartNum, c.hideOnMobile && styles.hideSm, pinClass(c.key));

  return { hasPins, checkPinned, scrolled, updateScrolled, pinStyle, cellClass };
};
