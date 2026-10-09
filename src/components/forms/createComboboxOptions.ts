import { type Accessor, createMemo } from 'solid-js';

import { type AsyncOptions, createAsyncOptions, type LoadOptions } from './createAsyncOptions';
import { type AutocompleteOption, filterOptions, normalizeOption, type SelectOption } from './selectOption';

export interface ComboboxOptionsSource {
  options: Accessor<ReadonlyArray<string | AutocompleteOption>>;
  loadOptions: Accessor<LoadOptions | undefined>;
}

export interface ComboboxOptions {
  local: Accessor<SelectOption[]>;
  remote: AsyncOptions;
  list: Accessor<SelectOption[]>;
}

export const createComboboxOptions = (
  source: ComboboxOptionsSource,
  query: Accessor<string>,
  open: Accessor<boolean>,
): ComboboxOptions => {
  const local = createMemo(() => source.options().map(normalizeOption));
  const remote = createAsyncOptions(source.loadOptions, query, open);
  const list = createMemo(() => (source.loadOptions() ? remote.items() : filterOptions(local(), query())));
  return { local, remote, list };
};
