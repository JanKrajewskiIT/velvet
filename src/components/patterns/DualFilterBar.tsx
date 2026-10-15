import { createMemo, For, mergeProps, Show } from 'solid-js';

import { createControllable } from '../../hooks/createControllable';
import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { Button } from '../actions/Button';
import { Chip } from '../forms/Chip';
import { SearchInput } from '../forms/SearchInput';
import { Glyph } from '../primitives/Glyph';
import { SectionLabel } from '../primitives/SectionLabel';
import { Text } from '../primitives/Text';
import { typographyClass } from '../primitives/typography';
import styles from './DualFilterBar.module.css';

export interface DualFilterOption {
  value: string;
  label: string;
  count?: number;
  icon?: string;
}

export interface DualFilterBarProps {
  filters: Array<string | DualFilterOption>;
  filterValue?: string[];
  defaultFilterValue?: string[];
  onFilterChange?: (values: string[]) => void;
  sorts: Array<string | DualFilterOption>;
  sortValue?: string;
  defaultSortValue?: string;
  onSortChange?: (value: string) => void;
  /** Shows a search field when onSearchChange is set */
  search?: string;
  onSearchChange?: (query: string) => void;
  /** Result count, right-aligned */
  count?: number;
  /** @default localized "Filter" */
  filterLabel?: string;
  /** @default localized "Sort" */
  sortLabel?: string;
  /** full = labelled groups + search + count · simple = one compact pill track with two chip groups and a divider (no search/count/labels). @default 'full' */
  variant?: 'full' | 'simple';
  class?: string;
}

const normalize = (option: string | DualFilterOption): DualFilterOption =>
  typeof option === 'string' ? { value: option, label: option } : option;

/** One toolbar, two independent chip groups: multi-select filters (with counts + Clear) | single-choice sort. Optional search and live result count. */
export const DualFilterBar = (props: DualFilterBarProps) => {
  const p = mergeProps({ variant: 'full' } satisfies Partial<DualFilterBarProps>, props);
  const translate = useTranslate();
  const filterLabel = () => p.filterLabel ?? translate('velvet.patterns.dualFilterBar.filterLabel');
  const sortLabel = () => p.sortLabel ?? translate('velvet.patterns.dualFilterBar.sortLabel');
  const filterOptions = createMemo(() => p.filters.map(normalize));
  const sortOptions = createMemo(() => p.sorts.map(normalize));
  const [filters, setFilters] = createControllable<string[]>({
    value: () => p.filterValue,
    defaultValue: p.defaultFilterValue ?? [],
    onChange: (next) => p.onFilterChange?.(next),
  });
  const [sort, setSort] = createControllable<string | undefined>({
    value: () => p.sortValue,
    defaultValue: p.defaultSortValue ?? sortOptions()[0]?.value,
    onChange: (next) => {
      if (next !== undefined) p.onSortChange?.(next);
    },
  });
  const toggle = (value: string) =>
    setFilters(filters().includes(value) ? filters().filter((x) => x !== value) : [...filters(), value]);

  return (
    <Show
      when={p.variant === 'simple'}
      fallback={
        <div class={cx(styles.dfbar, p.class)}>
          <Show when={p.onSearchChange}>
            {(onSearchChange) => (
              <SearchInput
                size="sm"
                class={styles.dfbarPartSearch}
                placeholder={translate('velvet.patterns.dualFilterBar.search')}
                value={p.search ?? ''}
                onValueChange={onSearchChange()}
                aria-label={translate('velvet.common.search')}
              />
            )}
          </Show>
          <div class={styles.dfbarPartGroup} role="group" aria-label={filterLabel()}>
            <SectionLabel as="span" class={styles.dfbarPartLbl} icon="filter">
              {filterLabel()}
            </SectionLabel>
            <For each={filterOptions()}>
              {(option) => (
                <Chip
                  size="sm"
                  selected={filters().includes(option.value)}
                  count={option.count}
                  onClick={() => toggle(option.value)}
                >
                  {option.label}
                </Chip>
              )}
            </For>
            <Show when={filters().length > 0}>
              <Button variant="link" size="sm" onClick={() => setFilters([])}>
                {translate('velvet.common.clear')}
              </Button>
            </Show>
          </div>
          <span class={styles.dfbarPartDiv} aria-hidden="true" />
          <div class={styles.dfbarPartGroup} role="radiogroup" aria-label={sortLabel()}>
            <SectionLabel as="span" class={styles.dfbarPartLbl} icon="sliders">
              {sortLabel()}
            </SectionLabel>
            <For each={sortOptions()}>
              {(option) => (
                <button
                  type="button"
                  role="radio"
                  aria-checked={sort() === option.value}
                  class={cx(
                    typographyClass('label-sm'),
                    styles.chip,
                    styles.chipVariantSm,
                    'vui-dfbar__sort',
                    sort() === option.value && styles.dfbarPartSortVariantOn,
                  )}
                  onClick={() => setSort(option.value)}
                >
                  <Show when={option.icon}>{(icon) => <Glyph name={icon()} />}</Show>
                  {option.label}
                </button>
              )}
            </For>
          </div>
          <Show when={p.count != null}>
            <Text as="span" variant="caption" tone="tertiary" tabular class={styles.dfbarPartCount} aria-live="polite">
              {translate('velvet.patterns.dualFilterBar.resultCount', { count: p.count })}
            </Text>
          </Show>
        </div>
      }
    >
      <div class={cx(styles.dfbarS, p.class)}>
        <div class={styles.dfbarSPartGroup} role="group" aria-label={filterLabel()}>
          <For each={filterOptions()}>
            {(option) => (
              <button
                type="button"
                aria-pressed={filters().includes(option.value)}
                class={cx(
                  typographyClass('button-sm'),
                  styles.dfbarSPartChip,
                  filters().includes(option.value) && styles.dfbarSPartChipVariantOn,
                )}
                onClick={() => toggle(option.value)}
              >
                {option.label}
              </button>
            )}
          </For>
        </div>
        <span class={styles.dfbarSPartDiv} aria-hidden="true" />
        <div class={styles.dfbarSPartGroup} role="radiogroup" aria-label={sortLabel()}>
          <For each={sortOptions()}>
            {(option) => (
              <button
                type="button"
                role="radio"
                aria-checked={sort() === option.value}
                class={cx(
                  typographyClass('button-sm'),
                  styles.dfbarSPartChip,
                  sort() === option.value && styles.dfbarSPartChipVariantOn,
                )}
                onClick={() => setSort(option.value)}
              >
                <Show when={option.icon}>{(icon) => <Glyph name={icon()} />}</Show>
                {option.label}
              </button>
            )}
          </For>
        </div>
      </div>
    </Show>
  );
};
