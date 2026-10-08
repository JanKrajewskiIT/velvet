import type { JSX } from 'solid-js';

import type { Tone } from '../../utils/tone';

export interface FilterOption {
  value: string;
  label: JSX.Element;
  /** Facet count shown right-aligned */
  count?: number;
  /** Dot tone before the label (status filters) */
  dot?: Tone;
}

export interface FilterDef {
  key: string;
  label: string;
  icon?: string;
  options: FilterOption[];
  /** @default true */
  multiple?: boolean;
}

/** `{ [filterKey]: selected option values }` */
export type FilterValue = Record<string, string[]>;
