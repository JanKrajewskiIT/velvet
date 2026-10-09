import { createSignal, type JSX } from 'solid-js';

import type { TransferView } from './createTransferView';
import { hasTransferPayload, readTransferPayload, writeTransferPayload } from './transferDrag';
import type { TransferItem, TransferSide } from './transferItem';

type DropTarget = { before: string } | 'end' | null;

export type TransferDrag = ReturnType<typeof createTransferDrag>;

export interface TransferDragOptions {
  view: TransferView;
  props: {
    side: TransferSide;
    marked: ReadonlySet<string>;
    onDropIn: (from: TransferSide, values: string[], before?: string) => void;
  };
}

/** Drag source, drop target and drop-indicator state of one panel. */
export const createTransferDrag = (options: TransferDragOptions) => {
  const { view, props } = options;
  const [drop, setDrop] = createSignal<DropTarget>(null);

  const onDragStart = (e: DragEvent, item: TransferItem) => {
    if (item.disabled || !e.dataTransfer) {
      e.preventDefault();
      return;
    }
    writeTransferPayload(e.dataTransfer, {
      from: props.side,
      values: props.marked.has(item.value) ? view.checked().map((x) => x.value) : [item.value],
    });
  };
  const onDragOver = (e: DragEvent, target: DropTarget) => {
    if (!e.dataTransfer || !hasTransferPayload(e.dataTransfer)) return;
    e.preventDefault();
    setDrop(target);
  };
  const onDrop = (e: DragEvent, before?: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDrop(null);
    const payload = e.dataTransfer && readTransferPayload(e.dataTransfer);
    if (payload) props.onDropIn(payload.from, payload.values, before);
  };
  const onDragLeave: JSX.EventHandler<HTMLElement, DragEvent> = (e) => {
    if (!(e.relatedTarget instanceof Node) || !e.currentTarget.contains(e.relatedTarget)) setDrop(null);
  };
  const dropsBefore = (value: string) => {
    const target = drop();
    return typeof target === 'object' && target !== null && target.before === value;
  };

  return { drop, onDragStart, onDragOver, onDrop, onDragLeave, dropsBefore };
};
