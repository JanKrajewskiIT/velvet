import * as React from 'react';
export interface CascaderNode { id: string; label: React.ReactNode; icon?: string; meta?: React.ReactNode; disabled?: boolean; children?: CascaderNode[] }
/** Single-path hierarchical pick shown as side-by-side columns (region → country → city). Value is the id of the picked node; the trigger shows the full path. Use TreeSelect for multi-select or deep/uneven trees. Keys: ↑↓ in a column · → into child column · ← back · Enter pick · Esc close. */
export interface CascaderProps {
  label?: string;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  optional?: boolean;
  required?: boolean;
  data: CascaderNode[];
  value?: string | null;
  defaultValue?: string | null;
  /** id of the picked node + the full node path from the root */
  onChange?: (id: string, path: CascaderNode[]) => void;
  /** Preferred name — same callback as onChange (onChange stays as an alias). */
  onValueChange?: (id: string, path: CascaderNode[]) => void;
  placeholder?: string;
  /** Path separator in the trigger. @default '/' */
  separator?: string;
  /** Allow committing a parent (not only leaves). @default false */
  changeOnSelect?: boolean;
  /** Open child columns on hover instead of click. @default 'click' */
  expandTrigger?: 'click' | 'hover';
  /** Search across all leaf paths. @default false */
  searchable?: boolean;
  /** Show only the last label in the trigger. @default false */
  displayLast?: boolean;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  id?: string;
}
export declare function Cascader(props: CascaderProps): JSX.Element;
