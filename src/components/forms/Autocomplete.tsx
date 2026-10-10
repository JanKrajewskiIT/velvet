import { createSignal, For, type JSX, mergeProps, Show } from 'solid-js';

import { createControllable } from '../../hooks/createControllable';
import { createDismiss } from '../../hooks/createDismiss';
import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { Spinner } from '../feedback/Spinner';
import { CloseButton } from '../primitives/CloseButton';
import { Control } from '../primitives/Control';
import { Field } from '../primitives/Field';
import { Glyph, renderIcon } from '../primitives/Glyph';
import { highlightMatch } from '../primitives/Mark';
import { AutocompleteCustomOption } from './AutocompleteCustomOption';
import type { AutocompleteProps } from './autocompleteTypes';
import { callbackAlias } from './callbackAlias';
import { ComboboxOption } from './ComboboxOption';
import { ComboboxOptionText } from './ComboboxOptionText';
import { createComboboxOptions } from './createComboboxOptions';
import { createComboboxPopup } from './createComboboxPopup';
import { OptionListStatus } from './OptionListStatus';
import type { AutocompleteOption, SelectOption } from './selectOption';

export type { AutocompleteProps };

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
  const popup = createComboboxPopup(() => p.id);
  const { id, listId, optionId, open, setOpen, active, setActive, floating } = popup;

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

  const query = () => (typing() ? text() : '');
  const { local, remote, list } = createComboboxOptions(
    { options: () => p.options, loadOptions: () => p.loadOptions },
    query,
    open,
  );

  const selectedLabel = () => {
    const current = value();
    if (current === null) return '';
    const known =
      picked()[current] ?? local().find((o) => o.value === current) ?? remote.items().find((o) => o.value === current);
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
    popup.root,
  );

  const onKeyDown: JSX.EventHandler<HTMLInputElement, KeyboardEvent> = (e) => {
    if (popup.handleArrowKey(e, list().length)) return;
    switch (e.key) {
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
        if (!open() && typing()) {
          e.preventDefault();
          setTyping(false);
        }
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
        <div ref={popup.setRoot} class="vui-select">
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
              aria-activedescendant={popup.activeDescendant(list())}
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
                  <ComboboxOption
                    id={optionId(index())}
                    selected={value() === option.value}
                    active={index() === active()}
                    onHover={() => setActive(index())}
                    onPick={() => pick(option)}
                  >
                    <Show when={option.icon}>{(icon) => <Glyph name={icon()} />}</Show>
                    <ComboboxOptionText
                      label={highlightMatch(option.label, query())}
                      description={option.description}
                    />
                    <Show when={value() === option.value}>
                      <Glyph name="check" class="vui-select__check" />
                    </Show>
                  </ComboboxOption>
                )}
              </For>
              <Show when={showCustom()}>
                <AutocompleteCustomOption
                  label={customLabel(customText())}
                  onPick={() => {
                    commitText();
                    setOpen(false);
                  }}
                />
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
