import * as React from 'react';
export interface HierarchyNode { id: string; label: React.ReactNode; description?: React.ReactNode; icon?: string; children?: HierarchyNode[] }
/** Drill-down picker for deep taxonomies (category → subcategory → item) in a narrow space — one level at a time, path crumbs on top, → / ← (or Backspace) drill in / out. Leaves select. Use TreeView when users need to see several levels at once. */
export interface HierarchyNavigatorProps {
  data: HierarchyNode[];
  /** Selected leaf id */
  value?: string | null;
  onSelect?: (id: string, node: HierarchyNode, path: HierarchyNode[]) => void;
  /** @default 'All' */
  rootLabel?: string;
  className?: string;
}
export declare function HierarchyNavigator(props: HierarchyNavigatorProps): JSX.Element;
