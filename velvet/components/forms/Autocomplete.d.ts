import * as React from 'react';
export interface AutocompleteOption { value: string; label: string; description?: string; icon?: string }
/** Type-to-filter single select (combobox). Local options or async loadOptions (debounced 250ms, skeleton + error/retry). Esc reverts the text, blur without a pick restores the selection unless allowCustom. */
export interface AutocompleteProps {
  label?: string;
  hint?: string;
  error?: string;
  optional?: boolean;
  options?: Array<string | AutocompleteOption>;
  value?: string | null;
  defaultValue?: string | null;
  onChange?: (value: string | null) => void;
  /** Preferred name — same callback as onChange (onChange stays as an alias). */
  onValueChange?: (value: string | null) => void;
  /** Server search — return options for the query */
  loadOptions?: (query: string) => Promise<Array<string | AutocompleteOption>>;
  placeholder?: string;
  emptyText?: string;
  /** Accept free text as the value ("Use “…”") */
  allowCustom?: boolean;
  /** @default 'search' */
  iconLeft?: string | null;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  id?: string;
  className?: string;
}
export declare function Autocomplete(props: AutocompleteProps): JSX.Element;
