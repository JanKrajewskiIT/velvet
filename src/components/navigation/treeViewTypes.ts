import type { TreeNode } from './treeData';

export interface TreeViewLabels {
  loading: string;
  loadFailed: string;
  retry: string;
}

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
  /** Receives the rejection of `onLoadChildren`; the row itself only shows a generic message. */
  onLoadError?: (node: TreeNode, error: unknown) => void;
  /** Accessible name */
  label?: string;
  labels?: Partial<TreeViewLabels>;
  class?: string;
}

/** Props after the defaults of `TreeView` are applied. */
export type TreeViewConfig = TreeViewProps &
  Required<Pick<TreeViewProps, 'checkable' | 'defaultExpanded' | 'defaultChecked'>>;
