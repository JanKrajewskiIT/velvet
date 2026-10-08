import * as React from 'react';
type Opt = string | { value: string; label: string; count?: number; icon?: string };
/** One toolbar, two independent chip groups: multi-select filters (with counts + Clear) | single-choice sort. Optional search and live result count. Wraps on narrow screens. */
export interface DualFilterBarProps {
  filters: Opt[];
  filterValue?: string[];
  defaultFilterValue?: string[];
  onFilterChange?: (values: string[]) => void;
  sorts: Opt[];
  sortValue?: string;
  defaultSortValue?: string;
  onSortChange?: (value: string) => void;
  /** Shows a search field when onSearchChange is set */
  search?: string;
  onSearchChange?: (q: string) => void;
  /** Result count, right-aligned */
  count?: number;
  filterLabel?: string;
  sortLabel?: string;
  /** full = labelled groups + search + count · simple = one compact pill track with two chip groups and a divider (no search/count/labels). @default 'full' */
  variant?: 'full' | 'simple';
  className?: string;
}
export declare function DualFilterBar(props: DualFilterBarProps): JSX.Element;
