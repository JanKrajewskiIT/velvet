import * as React from 'react';
/** Pick many from a searchable list. Selected values show as removable tags in the field; checkbox rows in the menu; footer shows count + Clear. Async via loadOptions (debounced, skeleton, error/retry) — labels of picked items are cached across searches. */
export interface MultiSelectProps {
  label?: string;
  hint?: string;
  error?: string;
  optional?: boolean;
  options?: Array<string | { value: string; label: string; description?: string; icon?: string }>;
  value?: string[];
  defaultValue?: string[];
  onChange?: (value: string[]) => void;
  /** Preferred name — same callback as onChange (onChange stays as an alias). */
  onValueChange?: (value: string[]) => void;
  loadOptions?: (query: string) => Promise<Array<string | { value: string; label: string; description?: string; icon?: string }>>;
  placeholder?: string;
  emptyText?: string;
  /** Cap on selections; unpicked rows disable at the cap */
  max?: number;
  size?: 'sm' | 'md';
  disabled?: boolean;
  id?: string;
  className?: string;
}
export declare function MultiSelect(props: MultiSelectProps): JSX.Element;
