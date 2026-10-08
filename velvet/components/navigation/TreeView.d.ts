import * as React from 'react';
export interface TreeNode { id: string; label: React.ReactNode; icon?: string; /** Right-aligned count/size */ meta?: React.ReactNode; children?: TreeNode[]; /** Has children that load on first expand (via onLoadChildren) */ lazy?: boolean }
/** Hierarchical list (files, categories, org). WAI-ARIA tree keyboard: ↑↓ move · → expand / into child · ← collapse / to parent · Home/End · Enter select · * expand siblings. Indent guides per level. With checkable: tri-state checkboxes (parent = all / some / none of its leaves), Space or click toggles; value is the list of checked LEAF ids. */
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
  /** Accessible name */
  label?: string;
  className?: string;
}
export declare function TreeView(props: TreeViewProps): JSX.Element;
