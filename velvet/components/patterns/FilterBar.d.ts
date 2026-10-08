import * as React from 'react';
export interface FilterOption { value: string; label: React.ReactNode; /** Facet count shown right-aligned */ count?: number; /** Dot tone before the label (status filters) */ dot?: string; }
export interface FilterDef { key: string; label: string; icon?: string; options: FilterOption[]; /** @default true */ multiple?: boolean; }
/**
 * Search + faceted filter chips above a list or table. Each chip opens a checklist; a chip with one pick reads "Status: Active",
 * with several shows a count. "Clear all" appears once anything is active; the live result count sits on the right.
 * Value is { [filterKey]: string[] }. Use DualFilterBar for the two-axis segmented variant.
 */
export interface FilterBarProps {
  /** @default true */
  search?: boolean;
  searchPlaceholder?: string;
  query?: string;
  defaultQuery?: string;
  onQueryChange?: (q: string) => void;
  filters?: FilterDef[];
  value?: Record<string, string[]>;
  defaultValue?: Record<string, string[]>;
  onChange?: (value: Record<string, string[]>) => void;
  /** Preferred name — same callback as onChange (onChange stays as an alias). */
  onValueChange?: (value: Record<string, string[]>) => void;
  /** Announced politely when it changes */
  resultCount?: number;
  /** @default 'results' */
  resultLabel?: string;
  /** Right-side slot — ColumnManager trigger, view switch, export */
  actions?: React.ReactNode;
  className?: string;
}
export declare function FilterBar(props: FilterBarProps): JSX.Element;
