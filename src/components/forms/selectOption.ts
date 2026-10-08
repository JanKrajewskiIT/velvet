export interface AutocompleteOption {
  value: string;
  label: string;
  /** Secondary line under the label. */
  description?: string;
  /** Velvet icon name shown before the label. */
  icon?: string;
}

export interface SelectOption extends AutocompleteOption {
  disabled?: boolean;
}

export const normalizeOption = (option: string | SelectOption): SelectOption =>
  typeof option === 'string' ? { value: option, label: option } : option;

/** Options whose label contains `query`, case-insensitively; an empty query keeps every option. */
export const filterOptions = (options: readonly SelectOption[], query: string): SelectOption[] => {
  const needle = query.toLowerCase();
  return options.filter((option) => !needle || option.label.toLowerCase().includes(needle));
};
