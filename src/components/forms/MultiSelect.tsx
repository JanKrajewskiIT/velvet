import { createMemo, createSignal, createUniqueId, For, type JSX, mergeProps, Show } from 'solid-js';

import { createControllable } from '../../hooks/createControllable';
import { createDismiss } from '../../hooks/createDismiss';
import { createFloating } from '../../hooks/createFloating';
import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { Button } from '../actions/Button';
import { Tag } from '../display/Tag';
import { Spinner } from '../feedback/Spinner';
import { Checkmark } from '../primitives/Checkmark';
import { Chevron } from '../primitives/Chevron';
import { Control } from '../primitives/Control';
import { Field } from '../primitives/Field';
import { Glyph } from '../primitives/Glyph';
import { callbackAlias } from './callbackAlias';
import { createAsyncOptions, type LoadOptions } from './createAsyncOptions';
import { OptionListStatus } from './OptionListStatus';
import { type AutocompleteOption, filterOptions, normalizeOption } from './selectOption';

export interface MultiSelectProps {
  label?: JSX.Element;
  hint?: JSX.Element;
  error?: JSX.Element;
  optional?: boolean;
  options?: ReadonlyArray<string | AutocompleteOption>;
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
  /** @default 'md' */
  size?: 'sm' | 'md';
  disabled?: boolean;
  id?: string;
  /** Styles the field shell. */
  class?: string;
}

const NO_OPTIONS: ReadonlyArray<string | AutocompleteOption> = [];

/** Pick many from a searchable list. Selected values show as removable tags in the field; checkbox rows in the menu; footer shows count + Clear. */
export const MultiSelect = (props: MultiSelectProps) => {
  const p = mergeProps(
    {
      options: NO_OPTIONS,
      defaultValue: [],
      size: 'md',
    } satisfies MultiSelectProps,
    props,
  );
  const translate = useTranslate();
  const selectedLabel = (count: number, max: number | undefined) => {
    if (p.selectedLabel) return p.selectedLabel(count, max);
    return max != null
      ? translate('velvet.forms.multiSelect.selectedCountOfMax', { count, max })
      : translate('velvet.forms.multiSelect.selectedCount', { count });
  };
  const removeLabel = (label: string) =>
    p.removeLabel?.(label) ?? translate('velvet.forms.multiSelect.removeItem', { label });
  const autoId = createUniqueId();
  const id = () => p.id ?? autoId;
  const listId = () => `${id()}-list`;
  const optionId = (index: number) => `${listId()}-${index}`;

  const [selected, setSelected] = createControllable<string[]>({
    value: () => p.value,
    defaultValue: p.defaultValue,
    onChange: callbackAlias(
      () => p.onValueChange,
      () => p.onChange,
    ),
  });
  const [query, setQuery] = createSignal('');
  const [open, setOpen] = createSignal(false);
  const [active, setActive] = createSignal(0);
  const [pickedLabels, setPickedLabels] = createSignal<Record<string, string>>({});
  const [root, setRoot] = createSignal<HTMLElement>();
  let input!: HTMLInputElement;

  const localOptions = createMemo(() => p.options.map(normalizeOption));
  const remote = createAsyncOptions(() => p.loadOptions, query, open);
  const list = createMemo(() => (p.loadOptions ? remote.items() : filterOptions(localOptions(), query())));
  const isFull = () => p.max != null && selected().length >= p.max;
  const labelOf = (value: string) =>
    pickedLabels()[value] ??
    localOptions().find((o) => o.value === value)?.label ??
    remote.items().find((o) => o.value === value)?.label ??
    value;

  const close = () => {
    setOpen(false);
    setQuery('');
  };
  const toggle = (option: AutocompleteOption | undefined) => {
    if (!option) return;
    if (selected().includes(option.value)) {
      setSelected(selected().filter((value) => value !== option.value));
    } else if (!isFull()) {
      setPickedLabels((previous) => ({ ...previous, [option.value]: option.label }));
      setSelected([...selected(), option.value]);
    }
  };
  const edit = (next: string) => {
    setQuery(next);
    setOpen(true);
    setActive(0);
  };

  createDismiss(open, close, root);
  const floating = createFloating(open, root, { matchWidth: true });

  const onKeyDown: JSX.EventHandler<HTMLInputElement, KeyboardEvent> = (e) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (open()) setActive((index) => Math.min(list().length - 1, index + 1));
        else setOpen(true);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActive((index) => Math.max(0, index - 1));
        break;
      case 'Enter':
        e.preventDefault();
        if (open()) toggle(list()[active()]);
        else setOpen(true);
        break;
      case 'Backspace':
        if (!query() && selected().length) setSelected(selected().slice(0, -1));
        break;
      case 'Tab':
        close();
        break;
    }
  };

  return (
    <Field label={p.label} hint={p.hint} error={p.error} optional={p.optional} id={id()}>
      {(control) => (
        <div ref={setRoot} class="vui-select">
          <Control
            invalid={control.invalid}
            disabled={p.disabled}
            class={cx('vui-taginput', p.size === 'sm' && 'vui-taginput--sm', p.class)}
            onMouseDown={(e) => {
              if (
                e.target === e.currentTarget ||
                (e.target instanceof Element && e.target.closest('.vui-multi__caret'))
              ) {
                e.preventDefault();
                input.focus();
                setOpen(true);
              }
            }}
          >
            <For each={selected()}>
              {(value) => (
                <Tag
                  size="sm"
                  class="vui-taginput__tag"
                  disabled={p.disabled}
                  removeLabel={removeLabel(labelOf(value))}
                  onRemove={() => setSelected(selected().filter((item) => item !== value))}
                >
                  {labelOf(value)}
                </Tag>
              )}
            </For>
            <input
              ref={input}
              id={control.id}
              role="combobox"
              aria-expanded={open()}
              aria-controls={listId()}
              aria-autocomplete="list"
              aria-activedescendant={open() && list()[active()] ? optionId(active()) : undefined}
              aria-invalid={control.invalid || undefined}
              aria-describedby={control.describedBy}
              class="vui-taginput__input"
              value={query()}
              placeholder={
                selected().length ? '' : (p.placeholder ?? translate('velvet.forms.multiSelect.placeholder'))
              }
              disabled={p.disabled}
              autocomplete="off"
              onInput={(e) => edit(e.currentTarget.value)}
              onFocus={() => setOpen(true)}
              onKeyDown={onKeyDown}
            />
            <span class="vui-multi__caret" aria-hidden="true">
              <Show when={remote.loading()} fallback={<Chevron open={open()} />}>
                <Spinner size="inline" tone="current" />
              </Show>
            </span>
          </Control>
          <Show when={open()}>
            <div
              ref={floating.ref}
              class={cx('vui-select__menu vui-multi__menu', floating.side() === 'top' && 'vui-select__menu--up')}
              style={floating.style()}
            >
              <ul id={listId()} role="listbox" aria-multiselectable="true" class="vui-multi__list">
                <For each={list()}>
                  {(option, index) => {
                    const on = () => selected().includes(option.value);
                    const blocked = () => !on() && isFull();
                    return (
                      // eslint-disable-next-line jsx-a11y/click-events-have-key-events -- keyboard handled by the combobox input via aria-activedescendant
                      <li
                        id={optionId(index())}
                        role="option"
                        aria-selected={on()}
                        aria-disabled={blocked() || undefined}
                        class={cx(
                          'vui-select__option',
                          'vui-multi__option',
                          index() === active() && 'vui-select__option--active',
                        )}
                        onMouseEnter={() => setActive(index())}
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => !blocked() && toggle(option)}
                      >
                        <Checkmark size="sm" checked={on()} />
                        <Show when={option.icon}>{(icon) => <Glyph name={icon()} />}</Show>
                        <span class="vui-select__label">
                          {option.label}
                          <Show when={option.description}>
                            <span class="vui-select__desc">{option.description}</span>
                          </Show>
                        </span>
                      </li>
                    );
                  }}
                </For>
                <OptionListStatus
                  loading={remote.loading()}
                  failed={remote.failed()}
                  empty={list().length === 0}
                  emptyText={
                    query()
                      ? (p.emptyText ?? translate('velvet.forms.multiSelect.emptyText'))
                      : (p.searchPrompt ?? translate('velvet.forms.multiSelect.searchPrompt'))
                  }
                  errorText={p.errorText}
                  retryLabel={p.retryLabel}
                  onRetry={remote.retry}
                />
              </ul>
              <div class="vui-multi__foot">
                <span>{selectedLabel(selected().length, p.max)}</span>
                <Show when={selected().length > 0}>
                  <Button
                    variant="link"
                    size="sm"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => setSelected([])}
                  >
                    {p.clearLabel ?? translate('velvet.common.clear')}
                  </Button>
                </Show>
              </div>
            </div>
          </Show>
        </div>
      )}
    </Field>
  );
};
