import { createMemo, For, Show } from 'solid-js';

import { useI18n } from '~/i18n/I18nProvider';
import type Props from '~/models/Props';
import type { DivCoreNativeProps } from '~/models/Props';
import classNames from '~/utils/classNames';

import Button from '../../buttons/Button/Button';
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
  const selectedByKey = createMemo(() => {
    return new Map(props.value.map((entry) => [entry.key, entry.value]));
  });

  const hasSearch = createMemo(() => Boolean(props.search?.trim()));
  const hasActiveFilters = createMemo(() => props.value.length > 0);
  const hasClearAction = createMemo(() => hasSearch() || hasActiveFilters());

  const setFilterValue = (key: string, nextValue: string) => {
    const next = props.value.filter((entry) => entry.key !== key);
    if (!nextValue) {
      props.onChange(next);
      return;
    }

    props.onChange([...next, { key, value: nextValue }]);
  };

  const clearAll = () => {
    props.onChange([]);
    props.onSearchChange?.('');
  };

  const activeFilters = createMemo(() => {
    return props.value.map((entry) => {
      const filter = props.filters.find((candidate) => candidate.key === entry.key);
      const label = filter?.options.find((option) => option.value === entry.value)?.label ?? entry.value;

      return {
        key: entry.key,
        filterLabel: filter?.label ?? entry.key,
        valueLabel: label,
      };
    });
  });

  return (
    <div class={classNames(styles.root, props.disabled && styles.disabled, props.class)}>
      <div class={styles.controls}>
        <Show when={props.onSearchChange}>
          <SearchInput
            class={styles.search}
            value={props.search ?? ''}
            onInput={(next) => props.onSearchChange?.(next)}
            placeholder={props.searchPlaceholder}
            clearLabel={props.clearAllLabel}
            disabled={props.disabled}
          />
        </Show>

        <For each={props.filters}>
          {(filter) => {
            return (
              <Select
                class={styles.field}
                aria-label={filter.label}
                value={selectedByKey().get(filter.key) ?? ''}
                onChange={(event: Event & { currentTarget: HTMLSelectElement; target: HTMLSelectElement }) =>
                  setFilterValue(filter.key, event.currentTarget.value)
                }
                disabled={props.disabled}
              >
                <option value="">{filter.placeholder ?? props.allLabel ?? t('common.all')}</option>
                <For each={filter.options}>
                  {(option) => (
                    <option value={option.value} disabled={option.disabled}>
                      {option.label}
                    </option>
                  )}
                </For>
              </Select>
            );
          }}
        </For>

        <Show when={hasClearAction()}>
          <Button class={styles.clearButton} variant="ghost" size="md" onClick={clearAll} disabled={props.disabled}>
            {props.clearAllLabel ?? t('filterBar.clearAll')}
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
                removeLabel={props.removeFilterLabel ? `${props.removeFilterLabel} ${entry.filterLabel}` : undefined}
              />
            )}
          </For>
        </div>
      </Show>
    </div>
  );
};

export default FilterBar;
