import * as React from 'react';
export interface SearchSuggestion { value: string; label: string; description?: string; icon?: string }
/** Search field with clear button and optional suggestions dropdown (match highlighted). ↑↓ move · Enter picks (or submits the query) · Esc closes, then clears. */
export interface SearchInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'onSelect'> {
  label?: string;
  /** @default 'Search…' */
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Enables the dropdown. Filtered client-side by label unless filter=false (server results). */
  suggestions?: Array<string | SearchSuggestion>;
  /** @default true */
  filter?: boolean;
  /** Suggestion picked, or Enter with free text */
  onSelect?: (item: SearchSuggestion) => void;
  /** @default 'No matches.' */
  emptyText?: string;
  /** Swaps the search icon for a spinner */
  loading?: boolean;
  size?: 'sm' | 'md' | 'lg';
  /** Ref to the native input — focus after create / clear in hosting dialogs */
  inputRef?: React.Ref<HTMLInputElement>;
}
export declare function SearchInput(props: SearchInputProps): JSX.Element;
