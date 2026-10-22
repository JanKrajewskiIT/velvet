import {
  createEffect,
  createMemo,
  createSignal,
  createUniqueId,
  For,
  type JSX,
  mergeProps,
  Show,
  splitProps,
} from 'solid-js';

import { createControllable } from '../../hooks/createControllable';
import { createDismiss } from '../../hooks/createDismiss';
import { createFloating } from '../../hooks/createFloating';
import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { Spinner } from '../feedback/Spinner';
import { CloseButton } from '../primitives/CloseButton';
import { Control } from '../primitives/Control';
import { ControlInput } from '../primitives/ControlInput';
import { EmptyText } from '../primitives/EmptyText';
import { FieldLabel } from '../primitives/FieldLabel';
import { Glyph } from '../primitives/Glyph';
import { highlightMatch } from '../primitives/Mark';
import { callHandler } from './callHandler';
import { ComboboxOption } from './ComboboxOption';
import { ComboboxOptionText } from './ComboboxOptionText';
import styles from './SearchInput.module.css';
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
    'readOnly',
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
  const [highlighted, setActive] = createSignal(0);
  const [root, setRoot] = createSignal<HTMLElement>();
  let input!: HTMLInputElement;
  const editable = () => !local.disabled && !local.readOnly;

  const options = createMemo(() => {
    const all = (local.suggestions ?? []).map(normalizeOption);
    return local.filter ? filterOptions(all, query()) : all;
  });
  const showList = () => editable() && open() && !!local.suggestions && query().length > 0;
  const active = () => (options().length ? Math.min(Math.max(0, highlighted()), options().length - 1) : -1);
  const floating = createFloating(showList, root, { matchWidth: true });
  const activeOption = () => options()[active()];

  const change = (next: string) => {
    if (!editable()) return;
    setQuery(next);
    setActive(0);
  };
  const pick = (option: SearchSuggestion) => {
    if (!showList()) return;
    change(option.label);
    local.onSelect?.(option);
    setOpen(false);
    input.focus();
  };

  createDismiss(showList, () => setOpen(false), root);
  createEffect(() => {
    if (!editable()) setOpen(false);
  });

  const onKeyDown: JSX.EventHandler<HTMLInputElement, KeyboardEvent> = (e) => {
    callHandler(local.onKeyDown, e);
    if (e.defaultPrevented || !editable() || e.isComposing) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const wasOpen = showList();
      setOpen(true);
      setActive(wasOpen ? Math.min(options().length - 1, active() + 1) : 0);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive(Math.max(0, active() - 1));
    } else if (e.key === 'Enter') {
      const option = activeOption();
      if (showList() && option) {
        e.preventDefault();
        pick(option);
      } else {
        local.onSelect?.({ value: query(), label: query() });
      }
    } else if (e.key === 'Escape' && !showList() && query()) {
      e.preventDefault();
      change('');
    }
  };

  return (
    <div class={cx(styles.field, local.class)}>
      <Show when={local.label}>
        <FieldLabel htmlFor={id()}>{local.label}</FieldLabel>
      </Show>
      <div ref={setRoot} class={styles.select}>
        <Control size={local.size} disabled={local.disabled} readOnly={local.readOnly}>
          <span class={styles.controlPartAdorn}>
            <Show when={local.loading} fallback={<Glyph name="search" />}>
              <Spinner size="inline" tone="current" />
            </Show>
          </span>
          <ControlInput
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
            class={styles.controlPartInputVariantSearch}
            placeholder={local.placeholder ?? translate('velvet.forms.searchInput.placeholder')}
            value={query()}
            disabled={local.disabled}
            readOnly={local.readOnly}
            autocomplete="off"
            onInput={(e) => {
              if (!editable()) return;
              change(e.currentTarget.value);
              setOpen(true);
              callHandler(local.onInput, e);
            }}
            onFocus={(e) => {
              if (local.disabled) return;
              if (editable()) setOpen(true);
              callHandler(local.onFocus, e);
            }}
            onKeyDown={onKeyDown}
          />
          <Show when={query() && editable()}>
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
          <ul ref={floating.ref} style={floating.style()} id={listId()} role="listbox" class={styles.selectPartMenu}>
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
              <EmptyText as="li" align="start" class={styles.selectPartEmpty}>
                {local.emptyText ?? translate('velvet.forms.searchInput.emptyText')}
              </EmptyText>
            </Show>
          </ul>
        </Show>
      </div>
    </div>
  );
};
