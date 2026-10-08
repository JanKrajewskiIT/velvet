import { createMemo, createSignal, createUniqueId, For, type JSX, mergeProps, Show } from 'solid-js';

import { createControllable } from '../../hooks/createControllable';
import { createDismiss } from '../../hooks/createDismiss';
import { createFloating } from '../../hooks/createFloating';
import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { Spinner } from '../feedback/Spinner';
import { CloseButton } from '../primitives/CloseButton';
import { Control } from '../primitives/Control';
import { Field } from '../primitives/Field';
import { Glyph, renderIcon } from '../primitives/Glyph';
import { highlightMatch } from '../primitives/Mark';
import { callbackAlias } from './callbackAlias';
import { createAsyncOptions, type LoadOptions } from './createAsyncOptions';
import { OptionListStatus } from './OptionListStatus';
import { type AutocompleteOption, filterOptions, normalizeOption, type SelectOption } from './selectOption';

export interface AutocompleteProps {
  label?: JSX.Element;
  hint?: JSX.Element;
  error?: JSX.Element;
  optional?: boolean;
  options?: ReadonlyArray<string | AutocompleteOption>;
  /** Controlled value; `null` is a controlled empty selection. */
  value?: string | null;
  defaultValue?: string | null;
  /** Same callback as `onValueChange`, kept as an alias. */
  onChange?: (value: string | null) => void;
  onValueChange?: (value: string | null) => void;
  /** Server search — return options for the query. Debounced, and only the latest query's result is applied. */
  loadOptions?: LoadOptions;
  /** @default localized "Search…" */
  placeholder?: string;
  /** @default localized "No matches." */
  emptyText?: string;
  /** Shown when `loadOptions` rejects. @default localized "Couldn’t load options" */
  errorText?: string;
  /** @default localized "Retry" */
  retryLabel?: string;
  /** @default localized "Clear" */
  clearLabel?: string;
  /** Builds the label of the free-text row; used with `allowCustom`. @default localized `Use “text”` */
  customLabel?: (text: string) => string;
  /** Accept free text as the value. */
  allowCustom?: boolean;
  /** Glyph name or node; `null` hides it. @default 'search' */
  iconLeft?: JSX.Element | null;
  /** @default 'md' */
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  id?: string;
  /** Styles the field shell. */
  class?: string;
}

const NO_OPTIONS: ReadonlyArray<string | AutocompleteOption> = [];

/** Type-to-filter single select (combobox). Esc reverts the text; blur without a pick restores the selection unless `allowCustom`. */
export const Autocomplete = (props: AutocompleteProps) => {
  const p = mergeProps(
    {
      defaultValue: null,
      options: NO_OPTIONS,
      allowCustom: false,
      iconLeft: 'search',
      size: 'md',
    } satisfies AutocompleteProps,
    props,
  );
  const translate = useTranslate();
  const customLabel = (text: string) =>
    p.customLabel?.(text) ?? translate('velvet.forms.autocomplete.customLabel', { text });
  const autoId = createUniqueId();
  const id = () => p.id ?? autoId;
  const listId = () => `${id()}-list`;
  const optionId = (index: number) => `${listId()}-${index}`;

  const [value, setValue] = createControllable<string | null>({
    value: () => p.value,
    defaultValue: p.defaultValue,
    onChange: callbackAlias(
      () => p.onValueChange,
      () => p.onChange,
    ),
  });
  const [picked, setPicked] = createSignal<Record<string, SelectOption>>({});
  const [text, setText] = createSignal('');
  const [typing, setTyping] = createSignal(false);
  const [open, setOpen] = createSignal(false);
  const [active, setActive] = createSignal(0);
  const [root, setRoot] = createSignal<HTMLElement>();

  const localOptions = createMemo(() => p.options.map(normalizeOption));
  const query = () => (typing() ? text() : '');
  const remote = createAsyncOptions(() => p.loadOptions, query, open);
  const list = createMemo(() => (p.loadOptions ? remote.items() : filterOptions(localOptions(), query())));

  const selectedLabel = () => {
    const current = value();
    if (current === null) return '';
    const known =
      picked()[current] ??
      localOptions().find((o) => o.value === current) ??
      remote.items().find((o) => o.value === current);
    return known?.label ?? current;
  };
  const shownText = () => (typing() ? text() : selectedLabel());
  const customText = () => text().trim();
  const showCustom = () =>
    p.allowCustom &&
    typing() &&
    !!customText() &&
    !list().some((option) => option.label.toLowerCase() === customText().toLowerCase());

  const pick = (option: SelectOption) => {
    setPicked((previous) => ({ ...previous, [option.value]: option }));
    setValue(option.value);
    setTyping(false);
    setOpen(false);
  };
  /** Ends editing without a pick: free text becomes the value, an emptied field clears it, anything else reverts. */
  const commitText = () => {
    if (!typing()) return;
    if (p.allowCustom && customText()) setValue(customText());
    else if (!text()) setValue(null);
    setTyping(false);
  };
  const edit = (next: string) => {
    setText(next);
    setTyping(true);
    setOpen(true);
    setActive(0);
  };

  createDismiss(
    open,
    (reason) => {
      setOpen(false);
      if (reason === 'outside') commitText();
      else setTyping(false);
    },
    root,
  );
  const floating = createFloating(open, root, { matchWidth: true });

  const onKeyDown: JSX.EventHandler<HTMLInputElement, KeyboardEvent> = (e) => {
    const lastIndex = list().length - 1;
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (open()) setActive((index) => Math.min(lastIndex, index + 1));
        else setOpen(true);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActive((index) => Math.max(0, index - 1));
        break;
      case 'Enter': {
        const option = list()[active()];
        if (open() && option) {
          e.preventDefault();
          pick(option);
        } else if (p.allowCustom) {
          e.preventDefault();
          commitText();
          setOpen(false);
        }
        break;
      }
      case 'Escape':
        if (!open()) setTyping(false);
        break;
      case 'Tab':
        setOpen(false);
        commitText();
        break;
    }
  };

  return (
    <Field label={p.label} hint={p.hint} error={p.error} optional={p.optional} id={id()}>
      {(control) => (
        <div ref={setRoot} class="vui-select">
          <Control size={p.size} invalid={control.invalid} disabled={p.disabled} class={p.class}>
            <Show when={p.iconLeft}>
              <span class="vui-control__adorn">
                <Show when={remote.loading()} fallback={renderIcon(p.iconLeft)}>
                  <Spinner size="inline" tone="current" />
                </Show>
              </span>
            </Show>
            <input
              id={control.id}
              role="combobox"
              aria-expanded={open()}
              aria-controls={listId()}
              aria-autocomplete="list"
              aria-activedescendant={open() && list()[active()] ? optionId(active()) : undefined}
              aria-invalid={control.invalid || undefined}
              aria-describedby={control.describedBy}
              class="vui-control__input"
              value={shownText()}
              placeholder={p.placeholder ?? translate('velvet.forms.autocomplete.placeholder')}
              disabled={p.disabled}
              autocomplete="off"
              onInput={(e) => edit(e.currentTarget.value)}
              onFocus={() => setOpen(true)}
              onKeyDown={onKeyDown}
            />
            <Show when={value() !== null && !p.disabled}>
              <CloseButton
                variant="field"
                label={p.clearLabel ?? translate('velvet.common.clear')}
                onClick={() => {
                  setValue(null);
                  setTyping(false);
                }}
              />
            </Show>
            <span class="vui-control__adorn vui-control__adorn--end" style={{ 'pointer-events': 'none' }}>
              <Glyph name="chevron-down" />
            </span>
          </Control>
          <Show when={open()}>
            <ul
              ref={floating.ref}
              id={listId()}
              role="listbox"
              class={cx('vui-select__menu', floating.side() === 'top' && 'vui-select__menu--up')}
              style={floating.style()}
            >
              <For each={list()}>
                {(option, index) => (
                  // eslint-disable-next-line jsx-a11y/click-events-have-key-events -- keyboard handled by the combobox input via aria-activedescendant
                  <li
                    id={optionId(index())}
                    role="option"
                    aria-selected={value() === option.value}
                    class={cx('vui-select__option', index() === active() && 'vui-select__option--active')}
                    onMouseEnter={() => setActive(index())}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => pick(option)}
                  >
                    <Show when={option.icon}>{(icon) => <Glyph name={icon()} />}</Show>
                    <span class="vui-select__label">
                      {highlightMatch(option.label, query())}
                      <Show when={option.description}>
                        <span class="vui-select__desc">{option.description}</span>
                      </Show>
                    </span>
                    <Show when={value() === option.value}>
                      <Glyph name="check" class="vui-select__check" />
                    </Show>
                  </li>
                )}
              </For>
              <Show when={showCustom()}>
                {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions -- keyboard handled by the combobox input; pointer-only shortcut for the custom entry */}
                <li
                  class="vui-select__option"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    commitText();
                    setOpen(false);
                  }}
                >
                  <Glyph name="plus" />
                  {customLabel(customText())}
                </li>
              </Show>
              <OptionListStatus
                loading={remote.loading()}
                failed={remote.failed()}
                empty={list().length === 0}
                emptyText={showCustom() ? undefined : (p.emptyText ?? translate('velvet.forms.autocomplete.emptyText'))}
                errorText={p.errorText}
                retryLabel={p.retryLabel}
                onRetry={remote.retry}
              />
            </ul>
          </Show>
        </div>
      )}
    </Field>
  );
};
