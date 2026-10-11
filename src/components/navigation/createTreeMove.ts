import { type Accessor, createEffect, createMemo, createSignal, on } from 'solid-js';

import type { TreeFocus } from './createTreeFocus';
import type { TreeModel } from './createTreeModel';
import type { ResolvedTreeViewLabels } from './createTreeViewLabels';
import { canNestIn, indexTree, isWithinTree, type TreeMovePosition } from './treeMoves';
import type { TreeViewConfig } from './treeViewTypes';

type MoveMode = 'pointer' | 'keyboard';

export interface TreeMoveController {
  enabled: Accessor<boolean>;
  sourceId: Accessor<string | null>;
  targetId: Accessor<string | null>;
  position: Accessor<TreeMovePosition>;
  keyboard: Accessor<boolean>;
  announcement: Accessor<string>;
  canDrop: (targetId: string, position?: TreeMovePosition, sourceId?: string) => boolean;
  start: (sourceId: string, mode: MoveMode) => void;
  setTarget: (targetId: string | null, position?: TreeMovePosition) => void;
  drop: (targetId: string, position?: TreeMovePosition) => void;
  keyboardMove: (sourceId: string, key: string) => void;
  cancel: () => void;
}

export const createTreeMove = (
  config: TreeViewConfig,
  labels: Accessor<ResolvedTreeViewLabels>,
  model: TreeModel,
  focus: TreeFocus,
): TreeMoveController => {
  const entries = createMemo(() => indexTree(config.data));
  const [sourceId, setSourceId] = createSignal<string | null>(null);
  const [targetId, setTargetId] = createSignal<string | null>(null);
  const [position, setPosition] = createSignal<TreeMovePosition>('inside');
  const [mode, setMode] = createSignal<MoveMode | null>(null);
  const [announcement, setAnnouncement] = createSignal('');
  const enabled = () => (config.draggable ?? !!config.onMovePosition) && !!(config.onMovePosition || config.onMove);
  const keyboard = () => mode() === 'keyboard';
  let pendingFocus: string | undefined;

  createEffect(
    on(
      () => config.data,
      () => {
        if (!pendingFocus) return;
        focus.focusRow(pendingFocus);
        pendingFocus = undefined;
      },
      { defer: true },
    ),
  );

  const canDrop = (target: string, nextPosition: TreeMovePosition = 'inside', source = sourceId() ?? ''): boolean => {
    const from = entries().get(source);
    const to = entries().get(target);
    if (!enabled() || !from || !to || source === target || isWithinTree(entries(), target, source)) return false;
    if (!config.onMovePosition && nextPosition !== 'inside') return false;
    if (config.onMovePosition && nextPosition === 'inside' && !canNestIn(to.node)) return false;
    return config.canDrop?.(from.node, to.node, nextPosition) !== false;
  };

  const clear = () => {
    setSourceId(null);
    setTargetId(null);
    setMode(null);
  };
  const start = (source: string, nextMode: MoveMode) => {
    if (!enabled() || !entries().has(source)) return;
    setSourceId(source);
    setTargetId(null);
    setPosition('inside');
    setMode(nextMode);
    setAnnouncement(labels().moveStarted);
  };
  const cancel = () => {
    const source = sourceId();
    const restoreFocus = keyboard();
    clear();
    setAnnouncement(labels().moveCancelled);
    if (restoreFocus && source) focus.focusRow(source);
  };
  const perform = (source: string, target: string, nextPosition: TreeMovePosition) => {
    if (!canDrop(target, nextPosition, source)) {
      setAnnouncement(labels().invalidMove);
      return;
    }
    const targetNode = entries().get(target)?.node;
    if (!targetNode) return;
    if (nextPosition === 'inside') model.setNodeOpen(targetNode, true, false);
    pendingFocus = source;
    if (config.onMovePosition) config.onMovePosition({ id: source, targetId: target, position: nextPosition });
    else config.onMove?.(source, target);
    clear();
    focus.focusRow(source);
    setAnnouncement(labels().moveCompleted);
  };
  const drop = (target: string, nextPosition: TreeMovePosition = 'inside') => {
    const source = sourceId();
    if (source) perform(source, target, nextPosition);
  };
  const keyboardMove = (source: string, key: string) => {
    const entry = entries().get(source);
    if (!entry) return;
    const previous = entry.siblings[entry.index - 1];
    const next = entry.siblings[entry.index + 1];
    const target = key === 'ArrowLeft' ? entry.parent : key === 'ArrowDown' ? next?.id : previous?.id;
    const nextPosition = key === 'ArrowRight' ? 'inside' : key === 'ArrowUp' ? 'before' : 'after';
    if (target) perform(source, target, nextPosition);
    else setAnnouncement(labels().invalidMove);
  };

  return {
    enabled,
    sourceId,
    targetId,
    position,
    keyboard,
    announcement,
    canDrop,
    start,
    setTarget: (target, nextPosition = 'inside') => {
      setTargetId(target && canDrop(target, nextPosition) ? target : null);
      setPosition(nextPosition);
    },
    drop,
    keyboardMove,
    cancel,
  };
};
