import { createEffect, createSignal, on, onCleanup } from 'solid-js';

import { createOperation } from '../../hooks/createOperation';
import { clamp } from '../../utils/math';
import { reportAsyncError } from '../../utils/reportAsyncError';
import type { KanbanCard, KanbanColumn, KanbanProps } from './kanbanTypes';

export const createKanbanMove = (
  props: KanbanProps,
  moved: (card: KanbanCard, column: KanbanColumn, index: number) => void,
) => {
  const operation = createOperation({ concurrency: 'single-flight' });
  const [failed, setFailed] = createSignal(false);
  let controller: AbortController | undefined;
  const invalidate = () => {
    controller?.abort();
    operation.invalidate();
    setFailed(false);
  };
  onCleanup(invalidate);
  createEffect(on(() => props.dataKey, invalidate, { defer: true }));
  createEffect(() => {
    if (props.disabled) invalidate();
  });
  const movable = () => !!props.onCardsChange && !props.disabled && !operation.busy();
  const save = async (id: KanbanCard['id'], columnId: string, index?: number) => {
    if (!movable()) return;
    const card = props.cards.find((entry) => entry.id === id);
    const column = props.columns.find((entry) => entry.id === columnId);
    if (!card || !column) return;
    const rest = props.cards.filter((entry) => entry.id !== id);
    const inColumn = rest.filter((entry) => entry.column === columnId);
    const at = clamp(index ?? inColumn.length, 0, inColumn.length);
    if (props.canMove && !props.canMove(card, column, at)) {
      setFailed(true);
      return;
    }
    if (
      props.enforceLimits &&
      card.column !== columnId &&
      column.limit !== undefined &&
      inColumn.length >= column.limit
    ) {
      setFailed(true);
      return;
    }
    if (
      card.column === columnId &&
      props.cards.filter((entry) => entry.column === columnId).findIndex((entry) => entry.id === id) === at
    )
      return;
    const before = inColumn[at];
    const insertAt = before ? rest.indexOf(before) : rest.length;
    const next = [...rest.slice(0, insertAt), { ...card, column: columnId }, ...rest.slice(insertAt)];
    const run = operation.begin();
    if (!run) return;
    const request = new AbortController();
    controller = request;
    setFailed(false);
    try {
      const accepted = await props.onCardsChange?.(
        next,
        { id, from: card.column, to: columnId, index: at },
        request.signal,
      );
      if (run.isCurrent()) {
        if (accepted === false) setFailed(true);
        else moved(card, column, at);
      }
    } catch (cause) {
      if (run.isCurrent()) {
        setFailed(true);
        if (props.onMoveError) props.onMoveError(cause);
        else reportAsyncError(cause);
      }
    } finally {
      if (controller === request) controller = undefined;
      run.finish();
    }
  };
  const move = (id: KanbanCard['id'], columnId: string, index?: number) => {
    void save(id, columnId, index).catch(reportAsyncError);
  };
  return { move, movable, pending: operation.busy, failed };
};
