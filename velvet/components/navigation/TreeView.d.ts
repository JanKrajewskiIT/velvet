import * as React from 'react';
export interface TreeNode { id: string; label: React.ReactNode; icon?: string; /** Right-aligned count/size */ meta?: React.ReactNode; children?: TreeNode[]; /** Has children that load on first expand (via onLoadChildren) */ lazy?: boolean }
/** Hierarchical list (files, categories, org). WAI-ARIA tree keyboard: ↑↓ move · → expand / into child · ← collapse / to parent · Home/End · Enter select · * expand siblings. Indent guides per level. With checkable: tri-state checkboxes (parent = all / some / none of its leaves), Space or click toggles; value is the list of checked LEAF ids. With onMove: drag rows (top/bottom edge = before/after, middle of a folder = inside) or Alt+↑/↓ reorder among siblings · Alt+→ into the previous sibling · Alt+← out of the parent; moves into itself or its own descendants are rejected; result is announced. */
export interface TreeMove { id: string; targetId: string; position: 'before' | 'after' | 'inside' }
export interface TreeViewProps {
  data: TreeNode[];
  /** Tri-state checkbox per row (permissions, filters). Row icons only render when a node sets icon. */
  checkable?: boolean;
  /** Checked leaf ids (controlled) */
  checked?: string[];
  defaultChecked?: string[];
  onCheckedChange?: (leafIds: string[]) => void;
  selected?: string | null;
  defaultSelected?: string | null;
  onSelect?: (id: string, node: TreeNode) => void;
  expanded?: string[];
  defaultExpanded?: string[];
  onExpandedChange?: (ids: string[]) => void;
  /** Called when a lazy node without children expands. Resolve after you put the children into data; while pending a Loading… row shows, on reject an error row with Retry (Enter / Space on it retries). */
  onLoadChildren?: (node: TreeNode) => Promise<void>;
  /** Enables drag + keyboard moving. The tree never mutates data — apply the move (e.g. with moveTreeNode) and pass new data back. */
  onMove?: (move: TreeMove) => void;
  /** Veto a drop (return false). Self/descendant drops and "inside" on nodes without children/lazy are already rejected. */
  canDrop?: (node: TreeNode, target: TreeNode, position: TreeMove['position']) => boolean;
  /** Accessible name */
  label?: string;
  className?: string;
}
export declare function TreeView(props: TreeViewProps): JSX.Element;
/** Pure helper: returns a new tree with the move applied. */
export declare function moveTreeNode(data: TreeNode[], move: TreeMove): TreeNode[];
