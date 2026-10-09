import type { JSX } from 'solid-js';

import type { ControlProps } from '../primitives/Control';
import type { TreeSelectNode } from './treeSelectRows';

export interface TreeSelectBaseProps {
  label?: JSX.Element;
  hint?: JSX.Element;
  error?: JSX.Element;
  optional?: boolean;
  required?: boolean;
  data: TreeSelectNode[];
  /** @default localized "Select…" */
  placeholder?: string;
  /** @default true */
  searchable?: boolean;
  defaultExpanded?: string[];
  /** Tags shown before "+N" (multiple). @default 2 */
  maxTags?: number;
  size?: ControlProps['size'];
  disabled?: boolean;
  id?: string;
}

export interface TreeSelectSingleProps extends TreeSelectBaseProps {
  multiple?: false;
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
  /** Alias of `onValueChange`. */
  onChange?: (value: string | null) => void;
  /** Parents only expand, they cannot be picked. @default false */
  leavesOnly?: boolean;
}

export interface TreeSelectMultipleProps extends TreeSelectBaseProps {
  /** Tri-state checkboxes: a parent selects all its leaves; the value holds leaf ids. */
  multiple: true;
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  /** Alias of `onValueChange`. */
  onChange?: (value: string[]) => void;
}

export type TreeSelectProps = TreeSelectSingleProps | TreeSelectMultipleProps;

export type SelectionValue = string | string[] | null;

/** Both modes seen through one value type; the public union keeps each mode's callback precisely typed. */
export interface TreeSelectModelProps extends TreeSelectBaseProps {
  multiple?: boolean;
  leavesOnly?: boolean;
  value?: SelectionValue;
  defaultValue?: SelectionValue;
  onValueChange?: (value: SelectionValue) => void;
  onChange?: (value: SelectionValue) => void;
}
