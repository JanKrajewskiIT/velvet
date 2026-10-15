import { useI18n } from '@jankrajewskiit/i18n';
import { For, type JSX, mergeProps, Show } from 'solid-js';

import { createControllable } from '../../hooks/createControllable';
import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { Button } from '../actions/Button';
import { SearchInput } from '../forms/SearchInput';
import { Text } from '../primitives/Text';
import styles from './FilterBar.module.css';
import { FilterChip } from './FilterChip';
import type { FilterDef, FilterValue } from './filterDefs';

export interface FilterBarProps {
  /** @default true */
  search?: boolean;
  /** @default localized "Search…" */
  searchPlaceholder?: string;
  query?: string;
  /** @default '' */
  defaultQuery?: string;
  onQueryChange?: (query: string) => void;
  /** @default [] */
  filters?: FilterDef[];
  value?: FilterValue;
  /** @default {} */
  defaultValue?: FilterValue;
  onChange?: (value: FilterValue) => void;
  /** Preferred name — same callback as onChange (onChange stays as an alias). */
  onValueChange?: (value: FilterValue) => void;
  /** Announced politely when it changes */
  resultCount?: number;
  /** Replaces the localized "N results" count text; rendered as "N label". */
  resultLabel?: string;
  /** Right-side slot — ColumnManager trigger, view switch, export */
  actions?: JSX.Element;
  class?: string;
}

/**
 * Search + faceted filter chips above a list or table. Each chip opens a checklist; a chip with one pick reads "Status: Active",
 * with several shows a count. "Clear all" appears once anything is active; the live result count sits on the right.
 */
export const FilterBar = (props: FilterBarProps) => {
  const p = mergeProps(
    {
      search: true,
      defaultQuery: '',
      filters: [] as FilterDef[],
      defaultValue: {} as FilterValue,
    } satisfies FilterBarProps,
    props,
  );
  const i18n = useI18n();
  const translate = useTranslate();
  const searchPlaceholder = () => p.searchPlaceholder ?? translate('velvet.patterns.filterBar.searchPlaceholder');
  const resultText = (count: number) =>
    p.resultLabel === undefined
      ? translate('velvet.patterns.filterBar.resultCount', { count })
      : `${i18n.formatNumber(count)} ${p.resultLabel}`;
  const [query, setQuery] = createControllable<string>({
    value: () => p.query,
    defaultValue: p.defaultQuery,
    onChange: (next) => p.onQueryChange?.(next),
  });
  const [value, setValue] = createControllable<FilterValue>({
    value: () => p.value,
    defaultValue: p.defaultValue,
    onChange: (next) => (p.onChange ?? p.onValueChange)?.(next),
  });
  const active = () =>
    Object.values(value()).reduce((total, selected) => total + selected.length, 0) + (query() ? 1 : 0);
  const clearAll = () => {
    setValue({});
    setQuery('');
  };

  return (
    <div class={cx(styles.filterbar, p.class)} role="search">
      <Show when={p.search}>
        <SearchInput
          size="sm"
          class={styles.filterbarPartSearch}
          aria-label={searchPlaceholder().replace('…', '')}
          placeholder={searchPlaceholder()}
          value={query()}
          onValueChange={setQuery}
        />
      </Show>
      <For each={p.filters}>
        {(filter) => (
          <FilterChip
            filter={filter}
            selected={value()[filter.key] ?? []}
            onChange={(selected) => setValue({ ...value(), [filter.key]: selected })}
          />
        )}
      </For>
      <Show when={active() > 0}>
        <Button variant="ghost" size="sm" class="vui-filterbar__clear" onClick={clearAll}>
          {translate('velvet.patterns.filterBar.clearAll')}
        </Button>
      </Show>
      <div class={styles.filterbarPartEnd}>
        <Show when={p.resultCount != null}>
          <Text
            as="span"
            variant="caption"
            tone="tertiary"
            tabular
            class={styles.filterbarPartCount}
            aria-live="polite"
          >
            {resultText(p.resultCount ?? 0)}
          </Text>
        </Show>
        {p.actions}
      </div>
    </div>
  );
};
