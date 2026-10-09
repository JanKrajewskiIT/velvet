import { createSignal } from 'solid-js';

const DRAG_IMAGE_OFFSET = { x: 16, y: 18 };

export type CollectionDrag = ReturnType<typeof createCollectionDrag>;

export const createCollectionDrag = (moveItem: (from: number, to: number) => void) => {
  const [dragIndex, setDragIndex] = createSignal<number>();
  const [overIndex, setOverIndex] = createSignal<number>();

  const endDrag = () => {
    setDragIndex(undefined);
    setOverIndex(undefined);
  };

  const onDragStart = (event: DragEvent & { currentTarget: HTMLElement }, index: number) => {
    setDragIndex(index);
    const transfer = event.dataTransfer;
    const row = event.currentTarget.closest('li');
    if (!transfer) return;
    transfer.effectAllowed = 'move';
    transfer.setData('text/plain', String(index));
    if (row) transfer.setDragImage(row, DRAG_IMAGE_OFFSET.x, DRAG_IMAGE_OFFSET.y);
  };

  const onRowDragOver = (event: DragEvent, index: number) => {
    if (dragIndex() === undefined) return;
    event.preventDefault();
    setOverIndex(index);
  };

  const onRowDrop = (event: DragEvent, index: number) => {
    const from = dragIndex();
    if (from === undefined) return;
    event.preventDefault();
    moveItem(from, index);
    endDrag();
  };

  return { dragIndex, overIndex, endDrag, onDragStart, onRowDragOver, onRowDrop };
};
