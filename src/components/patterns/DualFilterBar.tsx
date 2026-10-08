import { createMemo, For, mergeProps, Show } from 'solid-js';

import { createControllable } from '../../hooks/createControllable';
import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { Button } from '../actions/Button';
import { Chip } from '../forms/Chip';
import { SearchInput } from '../forms/SearchInput';
import { Glyph } from '../primitives/Glyph';
import { SectionLabel } from '../primitives/SectionLabel';

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
        <div class={cx('vui-dfbar', p.class)}>
          <Show when={p.onSearchChange}>
            {(onSearchChange) => (
              <SearchInput
                size="sm"
                class="vui-dfbar__search"
                placeholder={translate('velvet.patterns.dualFilterBar.search')}
                value={p.search ?? ''}
                onValueChange={onSearchChange()}
                aria-label={translate('velvet.common.search')}
              />
            )}
          </Show>
          <div class="vui-dfbar__group" role="group" aria-label={filterLabel()}>
            <SectionLabel as="span" class="vui-dfbar__lbl" icon="filter">
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
          <span class="vui-dfbar__div" aria-hidden="true" />
          <div class="vui-dfbar__group" role="radiogroup" aria-label={sortLabel()}>
            <SectionLabel as="span" class="vui-dfbar__lbl" icon="sliders">
              {sortLabel()}
            </SectionLabel>
            <For each={sortOptions()}>
              {(option) => (
                <button
                  type="button"
                  role="radio"
                  aria-checked={sort() === option.value}
                  class={cx(
                    'vui-chip',
                    'vui-chip--sm',
                    'vui-dfbar__sort',
                    sort() === option.value && 'vui-dfbar__sort--on',
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
            <span class="vui-dfbar__count" aria-live="polite">
              {translate('velvet.patterns.dualFilterBar.resultCount', { count: p.count })}
            </span>
          </Show>
        </div>
      }
    >
      <div class={cx('vui-dfbar-s', p.class)}>
        <div class="vui-dfbar-s__group" role="group" aria-label={filterLabel()}>
          <For each={filterOptions()}>
            {(option) => (
              <button
                type="button"
                aria-pressed={filters().includes(option.value)}
                class={cx('vui-dfbar-s__chip', filters().includes(option.value) && 'vui-dfbar-s__chip--on')}
                onClick={() => toggle(option.value)}
              >
                {option.label}
              </button>
            )}
          </For>
        </div>
        <span class="vui-dfbar-s__div" aria-hidden="true" />
        <div class="vui-dfbar-s__group" role="radiogroup" aria-label={sortLabel()}>
          <For each={sortOptions()}>
            {(option) => (
              <button
                type="button"
                role="radio"
                aria-checked={sort() === option.value}
                class={cx('vui-dfbar-s__chip', sort() === option.value && 'vui-dfbar-s__chip--on')}
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
