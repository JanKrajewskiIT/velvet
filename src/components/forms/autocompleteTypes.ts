import type { JSX } from 'solid-js';

import type { LoadOptions } from './createAsyncOptions';
import type { AutocompleteOption } from './selectOption';

export interface AutocompleteProps {
  label?: JSX.Element;
  hint?: JSX.Element;
  error?: JSX.Element;
  optional?: boolean;
  options?: ReadonlyArray<string | AutocompleteOption>;
  /** Controlled value; `null` is a controlled empty selection. */
  value?: string | null;
  defaultValue?: string | null;
  /** Same callback as `onValueChange`, kept as an alias. */
  onChange?: (value: string | null) => void;
  onValueChange?: (value: string | null) => void;
  /** Server search — return options for the query. Debounced, and only the latest query's result is applied. */
  loadOptions?: LoadOptions;
  /** @default localized "Search…" */
  placeholder?: string;
  /** @default localized "No matches." */
  emptyText?: string;
  /** Shown when `loadOptions` rejects. @default localized "Couldn’t load options" */
  errorText?: string;
  /** @default localized "Retry" */
  retryLabel?: string;
  /** @default localized "Clear" */
  clearLabel?: string;
  /** Builds the label of the free-text row; used with `allowCustom`. @default localized `Use “text”` */
  customLabel?: (text: string) => string;
  /** Accept free text as the value. */
  allowCustom?: boolean;
  /** Glyph name or node; `null` hides it. @default 'search' */
  iconLeft?: JSX.Element | null;
  /** @default 'md' */
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  id?: string;
  /** Styles the field shell. */
  class?: string;
}
