import * as React from 'react';
export interface TreeSelectNode { id: string; label: string; icon?: string; /** Right-aligned meta — count, code */ meta?: React.ReactNode; children?: TreeSelectNode[]; }
/**
 * Select over hierarchical options — departments, categories, locations. Expand with the chevron or →/←, search filters and
 * auto-expands matches. multiple: tri-state checkboxes (a parent selects all its leaves; value holds leaf ids) with tags in the field.
 * Built on Field + Control. Use Select for flat lists, HierarchyNavigator for drill-down browsing on small screens.
 */
export interface TreeSelectProps {
  label?: string;
  hint?: string;
  error?: string;
  optional?: boolean;
  required?: boolean;
  data: TreeSelectNode[];
  /** id (single) or leaf ids (multiple) */
  value?: string | string[] | null;
  defaultValue?: string | string[] | null;
  onChange?: (value: any) => void;
  /** Preferred name — same callback as onChange (onChange stays as an alias). */
  onValueChange?: (value: any) => void;
  multiple?: boolean;
  /** Single mode: parents only expand, can't be picked */
  leavesOnly?: boolean;
  placeholder?: string;
  /** @default true */
  searchable?: boolean;
  defaultExpanded?: string[];
  /** Tags shown before "+N". @default 2 */
  maxTags?: number;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  id?: string;
}
export declare function TreeSelect(props: TreeSelectProps): JSX.Element;
