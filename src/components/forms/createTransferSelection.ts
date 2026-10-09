import { createEffect, createSignal } from 'solid-js';

import { clamp } from '../../utils/math';
import type { TransferView } from './createTransferView';
import type { TransferItem } from './transferItem';

const ARROW_STEP: Readonly<Record<string, 1 | -1>> = { ArrowDown: 1, ArrowUp: -1 };

export type TransferSelection = ReturnType<typeof createTransferSelection>;

export interface TransferSelectionOptions {
  view: TransferView;
  props: {
    marked: ReadonlySet<string>;
    onMarkedChange: (marked: ReadonlySet<string>) => void;
    onMove: (values: string[]) => void;
    onReorder?: (value: string, direction: 1 | -1) => void;
  };
  list: () => HTMLUListElement | undefined;
}

/** Roving focus, click and Shift-click range marking, select-all and the listbox keyboard map. */
export const createTransferSelection = (options: TransferSelectionOptions) => {
  const { view, props } = options;
  const [focus, setFocus] = createSignal(0);
  let anchor: number | undefined;

  createEffect(() => {
    if (focus() >= view.visible().length) setFocus(Math.max(0, view.visible().length - 1));
  });

  const mark = (values: Iterable<string>) => props.onMarkedChange(new Set(values));
  const toggle = (item: TransferItem, index: number, range: boolean) => {
    if (item.disabled) return;
    const next = new Set(props.marked);
    if (range && anchor !== undefined) {
      const [from = 0, to = 0] = [anchor, index].sort((a, b) => a - b);
      view
        .visible()
        .slice(from, to + 1)
        .forEach((x) => !x.disabled && next.add(x.value));
    } else {
      if (!next.delete(item.value)) next.add(item.value);
      anchor = index;
    }
    mark(next);
    setFocus(index);
  };
  const toggleAll = () => {
    const next = new Set(props.marked);
    view.enabled().forEach((item) => (view.allChecked() ? next.delete(item.value) : next.add(item.value)));
    mark(next);
  };
  const focusRow = (index: number) => {
    setFocus(index);
    options.list()?.querySelector<HTMLElement>(`[data-k="${index}"]`)?.focus();
  };
  const moveTargets = (fallback?: TransferItem): string[] => {
    if (view.checked().length) return view.checked().map((item) => item.value);
    return fallback && !fallback.disabled ? [fallback.value] : [];
  };

  const onKeyDown = (e: KeyboardEvent) => {
    const item = view.visible()[focus()];
    const step = ARROW_STEP[e.key];
    if (step !== undefined) {
      e.preventDefault();
      if (e.altKey && item && props.onReorder) {
        props.onReorder(item.value, step);
        focusRow(focus() + step);
        return;
      }
      const index = clamp(focus() + step, 0, view.visible().length - 1);
      focusRow(index);
      const target = view.visible()[index];
      if (e.shiftKey && target && !target.disabled) mark([...props.marked, target.value]);
    } else if (e.key === 'Home' || e.key === 'End') {
      e.preventDefault();
      focusRow(e.key === 'Home' ? 0 : view.visible().length - 1);
    } else if (e.key === ' ') {
      e.preventDefault();
      if (item) toggle(item, focus(), false);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      props.onMove(moveTargets(item));
    } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'a') {
      e.preventDefault();
      toggleAll();
    }
  };

  return { focus, setFocus, mark, toggle, toggleAll, focusRow, onKeyDown };
};
