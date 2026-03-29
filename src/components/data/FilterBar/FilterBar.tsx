import { createMemo, For, Show, splitProps } from 'solid-js';

import { useI18n } from '~/i18n/I18nProvider';
import type Props from '~/models/Props';
import type { DivCoreNativeProps } from '~/models/Props';
import classNames from '~/utils/classNames';

import Button from '../../buttons/Button/Button';
import type { SelectOption } from '../../dropdowns/Select/Select';
import Select from '../../dropdowns/Select/Select';
import ClosableChip from '../../feedback/ClosableChip/ClosableChip';
import SearchInput from '../../inputs/SearchInput/SearchInput';
import styles from './FilterBar.module.css';

export interface FilterBarOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface FilterBarFilter {
  key: string;
  label: string;
  options: readonly FilterBarOption[];
  placeholder?: string;
}

export interface FilterBarValue {
  key: string;
  value: string;
}

interface FilterBarOwnProps extends Omit<DivCoreNativeProps, 'onChange'> {
  filters: readonly FilterBarFilter[];
  value: readonly FilterBarValue[];
  onChange: (next: FilterBarValue[]) => void;
  search?: string;
  onSearchChange?: (next: string) => void;
  searchPlaceholder?: string;
  clearAllLabel?: string;
  allLabel?: string;
  removeFilterLabel?: string;
  disabled?: boolean;
}

const FilterBar = (props: Props<FilterBarOwnProps>) => {
  const { t } = useI18n();
  const [local, rest] = splitProps(props, [
    'filters',
    'value',
    'onChange',
    'search',
    'onSearchChange',
    'searchPlaceholder',
    'clearAllLabel',
    'allLabel',
    'removeFilterLabel',
    'disabled',
    'class',
  ]);
  const selectedByKey = createMemo(() => {
    return new Map(local.value.map((entry) => [entry.key, entry.value]));
  });

  const hasSearch = createMemo(() => Boolean(local.search?.trim()));
  const hasActiveFilters = createMemo(() => local.value.length > 0);
  const hasClearAction = createMemo(() => hasSearch() || hasActiveFilters());
  const clearAllLabel = createMemo(() => local.clearAllLabel ?? t('filterBar.clearAll'));
  const allLabel = createMemo(() => local.allLabel ?? t('common.all'));

  const setFilterValue = (key: string, nextValue: string) => {
    const next = local.value.filter((entry) => entry.key !== key);
    if (!nextValue) {
      local.onChange(next);
      return;
    }

    local.onChange([...next, { key, value: nextValue }]);
  };

  const clearAll = () => {
    local.onChange([]);
    local.onSearchChange?.('');
  };

  const activeFilters = createMemo(() => {
    return local.value.map((entry) => {
      const filter = local.filters.find((candidate) => candidate.key === entry.key);
      const label = filter?.options.find((option) => option.value === entry.value)?.label ?? entry.value;

      return {
        key: entry.key,
        filterLabel: filter?.label ?? entry.key,
        valueLabel: label,
      };
    });
  });
  const getSelectOptions = (filter: FilterBarFilter): SelectOption[] => [
    { value: '', label: filter.placeholder ?? allLabel() },
    ...filter.options.map((option) => ({ value: option.value, label: option.label, disabled: option.disabled })),
  ];

  return (
    <div {...rest} class={classNames(styles.root, local.disabled && styles.disabled, local.class)}>
      <div class={styles.controls}>
        <Show when={local.onSearchChange}>
          <SearchInput
            class={styles.search}
            value={local.search ?? ''}
            onInput={(next) => local.onSearchChange?.(next)}
            placeholder={local.searchPlaceholder}
            clearLabel={clearAllLabel()}
            disabled={local.disabled}
          />
        </Show>

        <For each={local.filters}>
          {(filter) => {
            return (
              <Select
                class={styles.field}
                aria-label={filter.label}
                value={selectedByKey().get(filter.key) ?? ''}
                onChange={(event: Event & { currentTarget: HTMLSelectElement; target: HTMLSelectElement }) =>
                  setFilterValue(filter.key, event.currentTarget.value)
                }
                disabled={local.disabled}
                options={getSelectOptions(filter)}
              />
            );
          }}
        </For>

        <Show when={hasClearAction()}>
          <Button class={styles.clearButton} variant="ghost" size="md" onClick={clearAll} disabled={local.disabled}>
            {clearAllLabel()}
          </Button>
        </Show>
      </div>

      <Show when={activeFilters().length > 0}>
        <div class={styles.chips}>
          <For each={activeFilters()}>
            {(entry) => (
              <ClosableChip
                label={`${entry.filterLabel}: ${entry.valueLabel}`}
                onRemove={() => setFilterValue(entry.key, '')}
                removeLabel={local.removeFilterLabel ? `${local.removeFilterLabel} ${entry.filterLabel}` : undefined}
              />
            )}
          </For>
        </div>
      </Show>
    </div>
  );
};

export default FilterBar;
