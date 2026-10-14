import { createEffect, createMemo, createSignal, For, type JSX, mergeProps, Show } from 'solid-js';

import { createControllable } from '../../hooks/createControllable';
import { createDismiss } from '../../hooks/createDismiss';
import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { Tag } from '../display/Tag';
import { Spinner } from '../feedback/Spinner';
import { Checkmark } from '../primitives/Checkmark';
import { Chevron } from '../primitives/Chevron';
import { Control } from '../primitives/Control';
import { Field } from '../primitives/Field';
import { Glyph } from '../primitives/Glyph';
import { callbackAlias } from './callbackAlias';
import { ComboboxOption } from './ComboboxOption';
import { ComboboxOptionText } from './ComboboxOptionText';
import { createComboboxOptions } from './createComboboxOptions';
import { createComboboxPopup } from './createComboboxPopup';
import { createFormValidation } from './createFormValidation';
import { FormValue } from './FormValue';
import { MultiSelectFooter } from './MultiSelectFooter';
import type { MultiSelectProps } from './multiSelectTypes';
import { OptionListStatus } from './OptionListStatus';
import type { AutocompleteOption, SelectOption } from './selectOption';

export type { MultiSelectProps };

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
  const validation = createFormValidation();
  const selectedLabel = (count: number, max: number | undefined) => {
    if (p.selectedLabel) return p.selectedLabel(count, max);
    return max != null
      ? translate('velvet.forms.multiSelect.selectedCountOfMax', { count, max })
      : translate('velvet.forms.multiSelect.selectedCount', { count });
  };
  const removeLabel = (label: string) =>
    p.removeLabel?.(label) ?? translate('velvet.forms.multiSelect.removeItem', { label });
  const popup = createComboboxPopup(
    () => p.id,
    () => available(),
  );
  const { id, listId, optionId, open, setOpen, active, setActive, floating } = popup;

  const [selected, setSelected] = createControllable<string[]>({
    value: () => p.value,
    defaultValue: p.defaultValue,
    onChange: callbackAlias(
      () => p.onValueChange,
      () => p.onChange,
    ),
  });
  const [query, setQuery] = createSignal('');
  const [pickedLabels, setPickedLabels] = createSignal<ReadonlyMap<string, string>>(new Map());
  createEffect(() => {
    const keys = new Set(selected());
    setPickedLabels((previous) =>
      [...previous.keys()].every((key) => keys.has(key))
        ? previous
        : new Map([...previous].filter(([key]) => keys.has(key))),
    );
  });
  let input!: HTMLInputElement;

  const { local, remote, list } = createComboboxOptions(
    { options: () => p.options, loadOptions: () => p.loadOptions },
    query,
    open,
  );
  const isFull = () => p.max != null && selected().length >= p.max;
  const available = createMemo(() =>
    list().map((option) => ({
      ...option,
      disabled: !!option.disabled || (!selected().includes(option.value) && isFull()),
    })),
  );
  const labelOf = (value: string) =>
    pickedLabels().get(value) ??
    local().find((o) => o.value === value)?.label ??
    remote.items().find((o) => o.value === value)?.label ??
    value;

  const close = () => {
    setOpen(false);
    setQuery('');
  };
  const toggle = (option: SelectOption | undefined) => {
    if (p.disabled || !open() || !option || option.disabled) return;
    if (selected().includes(option.value)) {
      setSelected(selected().filter((value) => value !== option.value));
    } else if (!isFull()) {
      setPickedLabels((previous) => new Map(previous).set(option.value, option.label));
      setSelected([...selected(), option.value]);
    }
  };
  const edit = (next: string) => {
    if (p.disabled) return;
    setQuery(next);
    setOpen(true);
    setActive(0);
  };

  createDismiss(open, close, popup.root);
  createEffect(() => {
    if (p.disabled) close();
  });

  const onKeyDown: JSX.EventHandler<HTMLInputElement, KeyboardEvent> = (e) => {
    if (p.disabled) return;
    if (popup.handleArrowKey(e)) return;
    switch (e.key) {
      case 'Enter':
        e.preventDefault();
        if (open()) toggle(list()[active()]);
        else setOpen(true);
        break;
      case 'Backspace':
        if (!query() && selected().length) setSelected(selected().slice(0, -1));
        break;
      case 'Tab':
        if (remote.failed() && !e.shiftKey) break;
        close();
        break;
    }
  };

  return (
    <Field label={p.label} hint={p.hint} error={p.error} optional={p.optional} required={p.required} id={id()}>
      {(control) => (
        <div ref={popup.setRoot} class="vui-select">
          <Control
            invalid={control.invalid || validation.invalid()}
            disabled={p.disabled}
            class={cx('vui-taginput', p.size === 'sm' && 'vui-taginput--sm', p.class)}
            onMouseDown={(e) => {
              if (p.disabled) return;
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
                  onRemove={() => !p.disabled && setSelected(selected().filter((item) => item !== value))}
                >
                  {labelOf(value)}
                </Tag>
              )}
            </For>
            <input
              ref={(element) => {
                input = element;
              }}
              id={control.id}
              role="combobox"
              aria-expanded={open()}
              aria-controls={listId()}
              aria-autocomplete="list"
              aria-activedescendant={popup.activeDescendant(list())}
              aria-label={p['aria-label']}
              aria-labelledby={p['aria-labelledby']}
              aria-required={p.required || undefined}
              aria-invalid={control.invalid || validation.invalid() || undefined}
              aria-describedby={validation.describedBy(control.describedBy)}
              class="vui-taginput__input"
              value={query()}
              placeholder={
                selected().length ? '' : (p.placeholder ?? translate('velvet.forms.multiSelect.placeholder'))
              }
              disabled={p.disabled}
              autocomplete="off"
              onInput={(e) => edit(e.currentTarget.value)}
              onFocus={() => !p.disabled && setOpen(true)}
              onKeyDown={onKeyDown}
            />
            <span class="vui-multi__caret" aria-hidden="true">
              <Show when={remote.loading()} fallback={<Chevron open={open()} />}>
                <Spinner size="inline" tone="current" />
              </Show>
            </span>
          </Control>
          <FormValue
            validation={validation}
            name={p.name}
            form={p.form}
            required={p.required}
            disabled={p.disabled}
            value={selected()}
            focusInvalid={() => input.focus()}
            onReset={() => {
              setSelected(p.defaultValue);
              close();
            }}
          />
          <Show when={open()}>
            <div
              ref={floating.ref}
              class={cx('vui-select__menu vui-multi__menu', floating.side() === 'top' && 'vui-select__menu--up')}
              style={floating.style()}
            >
              <ul
                id={listId()}
                role="listbox"
                aria-multiselectable="true"
                aria-busy={remote.loading() || undefined}
                aria-label={p['aria-label']}
                aria-labelledby={p['aria-labelledby'] ?? (p.label ? `${id()}-label` : undefined)}
                class="vui-multi__list"
              >
                <For each={list()}>
                  {(option, index) => {
                    const on = () => selected().includes(option.value);
                    const blocked = () => !!p.disabled || !!option.disabled || (!on() && isFull());
                    return (
                      <ComboboxOption
                        id={optionId(index())}
                        selected={on()}
                        active={index() === active()}
                        disabled={blocked()}
                        class="vui-multi__option"
                        onHover={() => !blocked() && setActive(index())}
                        onPick={() => !blocked() && toggle(option)}
                      >
                        <Checkmark size="sm" checked={on()} />
                        <Show when={option.icon}>{(icon) => <Glyph name={icon()} />}</Show>
                        <ComboboxOptionText label={option.label} description={option.description} />
                      </ComboboxOption>
                    );
                  }}
                </For>
              </ul>
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
              <MultiSelectFooter
                summary={selectedLabel(selected().length, p.max)}
                canClear={!p.disabled && selected().length > 0}
                clearLabel={p.clearLabel}
                onClear={() => !p.disabled && setSelected([])}
              />
            </div>
          </Show>
        </div>
      )}
    </Field>
  );
};
