import { type Accessor, createSignal } from 'solid-js';

import type { TreeFocus } from './createTreeFocus';
import type { TreeModel } from './createTreeModel';
import type { ResolvedTreeViewLabels } from './createTreeViewLabels';
import type { TreeNode } from './treeData';
import type { TreeViewConfig } from './treeViewTypes';

type MoveMode = 'pointer' | 'keyboard';

export interface TreeMove {
  enabled: Accessor<boolean>;
  sourceId: Accessor<string | null>;
  targetId: Accessor<string | null>;
  keyboard: Accessor<boolean>;
  announcement: Accessor<string>;
  canDrop: (targetId: string) => boolean;
  start: (sourceId: string, mode: MoveMode) => void;
  setTarget: (targetId: string | null) => void;
  drop: (targetId: string) => void;
  cancel: () => void;
}

const findNode = (nodes: readonly TreeNode[], id: string): TreeNode | undefined => {
  for (const node of nodes) {
    if (node.id === id) return node;
    const child = node.children && findNode(node.children, id);
    if (child) return child;
  }
};

const contains = (node: TreeNode, id: string): boolean =>
  !!node.children?.some((child) => child.id === id || contains(child, id));

export const createTreeMove = (
  config: TreeViewConfig,
  labels: Accessor<ResolvedTreeViewLabels>,
  model: TreeModel,
  focus: TreeFocus,
): TreeMove => {
  const [sourceId, setSourceId] = createSignal<string | null>(null);
  const [targetId, setTargetId] = createSignal<string | null>(null);
  const [mode, setMode] = createSignal<MoveMode | null>(null);
  const [announcement, setAnnouncement] = createSignal('');
  const enabled = () => !!config.draggable && !!config.onMove;
  const keyboard = () => mode() === 'keyboard';

  const canDrop = (target: string): boolean => {
    const source = sourceId();
    if (!enabled() || !source || target === source) return false;
    const sourceNode = findNode(config.data, source);
    const targetNode = findNode(config.data, target);
    return !!sourceNode && !!targetNode && !contains(sourceNode, target);
  };

  const start = (source: string, nextMode: MoveMode) => {
    if (!enabled() || !findNode(config.data, source)) return;
    setSourceId(source);
    setTargetId(null);
    setMode(nextMode);
    setAnnouncement(labels().moveStarted);
  };

  const cancel = () => {
    setSourceId(null);
    setTargetId(null);
    setMode(null);
    setAnnouncement(labels().moveCancelled);
  };

  const drop = (target: string) => {
    const source = sourceId();
    if (!source || !canDrop(target)) {
      if (keyboard()) setAnnouncement(labels().invalidMove);
      return;
    }
    const targetNode = findNode(config.data, target);
    if (!targetNode) return;
    config.onMove?.(source, target);
    model.setNodeOpen(targetNode, true, false);
    focus.focusRow(target);
    setSourceId(null);
    setTargetId(null);
    setMode(null);
    setAnnouncement(labels().moveCompleted);
  };

  return {
    enabled,
    sourceId,
    targetId,
    keyboard,
    announcement,
    canDrop,
    start,
    setTarget: (target) => setTargetId(target && canDrop(target) ? target : null),
    drop,
    cancel,
  };
};
