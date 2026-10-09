import { createMemo, createSignal, createUniqueId, For, type JSX, mergeProps, Show, splitProps } from 'solid-js';

import { createControllable } from '../../hooks/createControllable';
import { createDismiss } from '../../hooks/createDismiss';
import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { Spinner } from '../feedback/Spinner';
import { CloseButton } from '../primitives/CloseButton';
import { Control } from '../primitives/Control';
import { EmptyText } from '../primitives/EmptyText';
import { FieldLabel } from '../primitives/Field';
import { Glyph } from '../primitives/Glyph';
import { highlightMatch } from '../primitives/Mark';
import { callHandler } from './callHandler';
import { ComboboxOption } from './ComboboxOption';
import { ComboboxOptionText } from './ComboboxOptionText';
import { type AutocompleteOption, filterOptions, normalizeOption } from './selectOption';

export type SearchSuggestion = AutocompleteOption;

export interface SearchInputProps extends Omit<
  JSX.InputHTMLAttributes<HTMLInputElement>,
  'size' | 'onSelect' | 'value' | 'class' | 'type'
> {
  label?: JSX.Element;
  /** @default localized "Search…" */
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Enables the dropdown. Filtered client-side by label unless `filter` is false (server results). */
  suggestions?: ReadonlyArray<string | SearchSuggestion>;
  /** @default true */
  filter?: boolean;
  /** Suggestion picked, or Enter with free text. */
  onSelect?: (item: SearchSuggestion) => void;
  /** @default localized "No matches." */
  emptyText?: string;
  /** @default localized "Clear search" */
  clearLabel?: string;
  /** Swaps the search icon for a spinner. */
  loading?: boolean;
  /** @default 'md' */
  size?: 'sm' | 'md' | 'lg';
  /** Receives the native input — focus after create / clear in hosting dialogs. */
  inputRef?: (element: HTMLInputElement) => void;
  /** Styles the field wrapper. */
  class?: string;
}

/** Search field with clear button and optional suggestions dropdown (match highlighted). ↑↓ move · Enter picks (or submits the query) · Esc closes, then clears. */
export const SearchInput = (props: SearchInputProps) => {
  const merged = mergeProps(
    { filter: true, loading: false, size: 'md', defaultValue: '' } satisfies SearchInputProps,
    props,
  );
  const [local, rest] = splitProps(merged, [
    'label',
    'placeholder',
    'value',
    'defaultValue',
    'onValueChange',
    'suggestions',
    'filter',
    'onSelect',
    'emptyText',
    'clearLabel',
    'loading',
    'size',
    'inputRef',
    'disabled',
    'id',
    'class',
    'onInput',
    'onFocus',
    'onKeyDown',
  ]);
  const translate = useTranslate();
  const autoId = createUniqueId();
  const id = () => local.id ?? autoId;
  const listId = () => `${id()}-list`;
  const optionId = (index: number) => `${listId()}-${index}`;

  const [query, setQuery] = createControllable({
    value: () => local.value,
    defaultValue: local.defaultValue,
    onChange: (next) => local.onValueChange?.(next),
  });
  const [open, setOpen] = createSignal(false);
  const [active, setActive] = createSignal(0);
  const [root, setRoot] = createSignal<HTMLElement>();
  let input!: HTMLInputElement;

  const options = createMemo(() => {
    const all = (local.suggestions ?? []).map(normalizeOption);
    return local.filter ? filterOptions(all, query()) : all;
  });
  const showList = () => open() && !!local.suggestions && query().length > 0;
  const activeOption = () => options()[active()];

  const change = (next: string) => {
    setQuery(next);
    setActive(0);
  };
  const pick = (option: SearchSuggestion) => {
    change(option.label);
    local.onSelect?.(option);
    setOpen(false);
    input.focus();
  };

  createDismiss(showList, () => setOpen(false), root);

  const onKeyDown: JSX.EventHandler<HTMLInputElement, KeyboardEvent> = (e) => {
    callHandler(local.onKeyDown, e);
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setOpen(true);
      setActive((index) => Math.min(options().length - 1, index + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((index) => Math.max(0, index - 1));
    } else if (e.key === 'Enter') {
      const option = activeOption();
      if (showList() && option) {
        e.preventDefault();
        pick(option);
      } else {
        local.onSelect?.({ value: query(), label: query() });
      }
    } else if (e.key === 'Escape' && !showList() && query()) {
      change('');
    }
  };

  return (
    <div class={cx('vui-field', local.class)}>
      <Show when={local.label}>
        <FieldLabel htmlFor={id()}>{local.label}</FieldLabel>
      </Show>
      <div ref={setRoot} class="vui-select">
        <Control size={local.size} disabled={local.disabled}>
          <span class="vui-control__adorn">
            <Show when={local.loading} fallback={<Glyph name="search" />}>
              <Spinner size="inline" tone="current" />
            </Show>
          </span>
          <input
            {...rest}
            ref={(element) => {
              input = element;
              local.inputRef?.(element);
            }}
            id={id()}
            type="search"
            role={local.suggestions ? 'combobox' : undefined}
            aria-expanded={local.suggestions ? showList() : undefined}
            aria-controls={local.suggestions ? listId() : undefined}
            aria-autocomplete={local.suggestions ? 'list' : undefined}
            aria-activedescendant={showList() && activeOption() ? optionId(active()) : undefined}
            class="vui-control__input vui-control__input--search"
            placeholder={local.placeholder ?? translate('velvet.forms.searchInput.placeholder')}
            value={query()}
            disabled={local.disabled}
            autocomplete="off"
            onInput={(e) => {
              change(e.currentTarget.value);
              setOpen(true);
              callHandler(local.onInput, e);
            }}
            onFocus={(e) => {
              setOpen(true);
              callHandler(local.onFocus, e);
            }}
            onKeyDown={onKeyDown}
          />
          <Show when={query() && !local.disabled}>
            <CloseButton
              variant="field"
              label={local.clearLabel ?? translate('velvet.forms.searchInput.clearLabel')}
              onClick={() => {
                change('');
                input.focus();
              }}
            />
          </Show>
        </Control>
        <Show when={showList()}>
          <ul id={listId()} role="listbox" class="vui-select__menu">
            <For each={options()}>
              {(option, index) => (
                <ComboboxOption
                  id={optionId(index())}
                  selected={index() === active()}
                  active={index() === active()}
                  onHover={() => setActive(index())}
                  onPick={() => pick(option)}
                >
                  <Show when={option.icon}>{(icon) => <Glyph name={icon()} />}</Show>
                  <ComboboxOptionText label={highlightMatch(option.label, query())} description={option.description} />
                </ComboboxOption>
              )}
            </For>
            <Show when={options().length === 0}>
              <EmptyText as="li" align="start" class="vui-select__empty">
                {local.emptyText ?? translate('velvet.forms.searchInput.emptyText')}
              </EmptyText>
            </Show>
          </ul>
        </Show>
      </div>
    </div>
  );
};
