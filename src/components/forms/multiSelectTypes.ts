import type { JSX } from 'solid-js';

import type { LoadOptions } from './createAsyncOptions';
import type { FormControlProps } from './formControl';
import type { SelectOption } from './selectOption';

export interface MultiSelectProps extends FormControlProps {
  label?: JSX.Element;
  hint?: JSX.Element;
  error?: JSX.Element;
  optional?: boolean;
  options?: ReadonlyArray<string | SelectOption>;
  /** Controlled selection. */
  value?: string[];
  defaultValue?: string[];
  /** Same callback as `onValueChange`, kept as an alias. */
  onChange?: (value: string[]) => void;
  onValueChange?: (value: string[]) => void;
  /** Server search — return options for the query. Labels of picked items are kept across searches. */
  loadOptions?: LoadOptions;
  /** @default localized "Select…" */
  placeholder?: string;
  /** @default localized "No matches." */
  emptyText?: string;
  /** Shown in the empty list before the user types. @default localized "Type to search." */
  searchPrompt?: string;
  /** Shown when `loadOptions` rejects. @default localized "Couldn’t load options" */
  errorText?: string;
  /** @default localized "Retry" */
  retryLabel?: string;
  /** @default localized "Clear" */
  clearLabel?: string;
  /** Footer summary. @default localized "N selected" or "N selected of MAX" */
  selectedLabel?: (count: number, max: number | undefined) => string;
  /** Accessible name of each tag's remove button. @default localized "Remove LABEL" */
  removeLabel?: (label: string) => string;
  /** Cap on selections; unpicked rows disable at the cap. */
  max?: number;
  /** Offer a free entry when the query does not match an existing or selected value. */
  creatable?: boolean;
  /** Verb used by the create row. @default localized "Add" */
  createLabel?: string;
  /** @default 'md' */
  size?: 'sm' | 'md';
  disabled?: boolean;
  id?: string;
  /** Styles the field shell. */
  class?: string;
}
