import { createEffect, createSignal, For, type JSX, mergeProps, Show } from 'solid-js';

import { createControllable } from '../../hooks/createControllable';
import { createDismiss } from '../../hooks/createDismiss';
import { useTranslate } from '../../i18n/useTranslate';
import { classSelector } from '../../utils/cssModule';
import { cx } from '../../utils/cx';
import { Tag } from '../display/Tag';
import { Spinner } from '../feedback/Spinner';
import { Chevron } from '../primitives/Chevron';
import { Control } from '../primitives/Control';
import { Field } from '../primitives/Field';
import { typographyClass } from '../primitives/typography';
import { callbackAlias } from './callbackAlias';
import { createComboboxOptions } from './createComboboxOptions';
import { createComboboxPopup } from './createComboboxPopup';
import { createFormValidation } from './createFormValidation';
import { createMultiSelectEntries, type MultiSelectEntry } from './createMultiSelectEntries';
import { FormValue } from './FormValue';
import styles from './MultiSelect.module.css';
import { MultiSelectFooter } from './MultiSelectFooter';
import { MultiSelectOptions } from './MultiSelectOptions';
import type { MultiSelectProps } from './multiSelectTypes';
import { OptionListStatus } from './OptionListStatus';
import type { AutocompleteOption } from './selectOption';

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
  const { id, listId, open, setOpen, active, setActive, floating } = popup;

  const [selected, setSelected] = createControllable<string[]>({
    value: () => p.value,
    defaultValue: p.defaultValue,
    onChange: callbackAlias(
      () => p.onValueChange,
      () => p.onChange,
    ),
  });
  const [query, setQuery] = createSignal('');
  let input!: HTMLInputElement;

  const options = createComboboxOptions({ options: () => p.options, loadOptions: () => p.loadOptions }, query, open);
  const { remote } = options;
  const { available, isFull, labelOf, remember } = createMultiSelectEntries(p, options, selected, query);

  const close = () => {
    setOpen(false);
    setQuery('');
  };
  const toggle = (option: MultiSelectEntry | undefined) => {
    if (p.disabled || !open() || !option || option.disabled) return;
    if (selected().includes(option.value)) {
      setSelected(selected().filter((value) => value !== option.value));
    } else if (!isFull()) {
      remember(option);
      setSelected([...selected(), option.value]);
    }
    if (option.create) setQuery('');
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
    if (p.disabled || e.isComposing) return;
    if (popup.handleArrowKey(e)) return;
    switch (e.key) {
      case 'Enter':
        e.preventDefault();
        if (open()) toggle(available()[active()]);
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
        <div ref={popup.setRoot} class={styles.select}>
          <Control
            invalid={control.invalid || validation.invalid()}
            disabled={p.disabled}
            class={cx(styles.taginput, p.size === 'sm' && styles.taginputVariantSm, p.class)}
            onMouseDown={(e) => {
              if (p.disabled) return;
              if (
                e.target === e.currentTarget ||
                (e.target instanceof Element && e.target.closest(classSelector(styles.multiPartCaret)))
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
                  class={styles.taginputPartTag}
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
              aria-activedescendant={popup.activeDescendant(available())}
              aria-label={p['aria-label']}
              aria-labelledby={p['aria-labelledby']}
              aria-required={p.required || undefined}
              aria-invalid={control.invalid || validation.invalid() || undefined}
              aria-describedby={validation.describedBy(control.describedBy)}
              class={cx(styles.taginputPartInput, typographyClass('body'))}
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
            <span class={styles.multiPartCaret} aria-hidden="true">
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
              class={cx(
                styles.selectPartMenu,
                styles.multiPartMenu,
                floating.side() === 'top' && styles.selectPartMenuVariantUp,
              )}
              style={floating.style()}
            >
              <ul
                id={listId()}
                role="listbox"
                aria-multiselectable="true"
                aria-busy={remote.loading() || undefined}
                aria-label={p['aria-label']}
                aria-labelledby={p['aria-labelledby'] ?? (p.label ? `${id()}-label` : undefined)}
                class={styles.multiPartList}
              >
                <MultiSelectOptions
                  options={available()}
                  selected={selected()}
                  popup={popup}
                  createLabel={p.createLabel}
                  onToggle={toggle}
                />
              </ul>
              <OptionListStatus
                loading={remote.loading()}
                failed={remote.failed()}
                empty={available().length === 0}
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
