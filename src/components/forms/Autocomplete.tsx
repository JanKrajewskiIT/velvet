import { createEffect, createMemo, createSignal, type JSX, mergeProps, Show } from 'solid-js';

import { createControllable } from '../../hooks/createControllable';
import { createDismiss } from '../../hooks/createDismiss';
import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { Spinner } from '../feedback/Spinner';
import { CloseButton } from '../primitives/CloseButton';
import { Control } from '../primitives/Control';
import { ControlInput } from '../primitives/ControlInput';
import { Field } from '../primitives/Field';
import { Glyph, renderIcon } from '../primitives/Glyph';
import styles from './Autocomplete.module.css';
import { AutocompleteMenu } from './AutocompleteMenu';
import type { AutocompleteProps } from './autocompleteTypes';
import { callbackAlias } from './callbackAlias';
import { createComboboxOptions } from './createComboboxOptions';
import { createComboboxPopup } from './createComboboxPopup';
import { createFormValidation } from './createFormValidation';
import { FormValue } from './FormValue';
import type { OptionListStatusProps } from './OptionListStatus';
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
  const validation = createFormValidation();
  const customLabel = (text: string) =>
    p.customLabel?.(text) ?? translate('velvet.forms.autocomplete.customLabel', { text });
  const popup = createComboboxPopup(
    () => p.id,
    () => navigation(),
  );
  const { id, listId, open, setOpen, active, setActive } = popup;

  const [value, setValue] = createControllable<string | null>({
    value: () => p.value,
    defaultValue: p.defaultValue,
    onChange: callbackAlias(
      () => p.onValueChange,
      () => p.onChange,
    ),
  });
  const [picked, setPicked] = createSignal<SelectOption>();
  const [text, setText] = createSignal('');
  const [typing, setTyping] = createSignal(false);
  let input!: HTMLInputElement;

  const query = () => (typing() ? text() : '');
  const { local, remote, list } = createComboboxOptions(
    { options: () => p.options, loadOptions: () => p.loadOptions },
    query,
    open,
  );

  createEffect(() => {
    const current = value();
    const known =
      remote.items().find((option) => option.value === current) ?? local().find((option) => option.value === current);
    setPicked((previous) => known ?? (previous?.value === current ? previous : undefined));
  });

  const selectedLabel = () => {
    const current = value();
    if (current === null) return '';
    const known =
      remote.items().find((o) => o.value === current) ??
      local().find((o) => o.value === current) ??
      (picked()?.value === current ? picked() : undefined);
    return known?.label ?? current;
  };
  const shownText = () => (typing() ? text() : selectedLabel());
  const customText = () => text().trim();
  const showCustom = () =>
    p.allowCustom &&
    typing() &&
    !!customText() &&
    !list().some((option) => option.label.toLowerCase() === customText().toLowerCase());
  const navigation = createMemo(() => {
    const options = list().map((option) => ({ ...option, value: `option:${option.value}` }));
    if (showCustom()) options.push({ value: 'custom', label: customLabel(customText()) });
    return options;
  });
  const pickCustom = () => {
    if (p.disabled || !open() || !showCustom()) return;
    commitText();
    setOpen(false);
  };

  const pick = (option: SelectOption) => {
    if (p.disabled || option.disabled || !open()) return;
    setPicked(option);
    setValue(option.value);
    setTyping(false);
    setOpen(false);
  };
  /** Ends editing without a pick: free text becomes the value, an emptied field clears it, anything else reverts. */
  const commitText = () => {
    if (p.disabled || !typing()) return;
    if (p.allowCustom && customText()) setValue(customText());
    else if (!text()) setValue(null);
    setTyping(false);
  };
  const custom = createMemo(() =>
    showCustom() ? { label: customLabel(customText()), onPick: pickCustom } : undefined,
  );
  const status: OptionListStatusProps = {
    get loading() {
      return remote.loading();
    },
    get failed() {
      return remote.failed();
    },
    get empty() {
      return list().length === 0;
    },
    get emptyText() {
      return showCustom() ? undefined : (p.emptyText ?? translate('velvet.forms.autocomplete.emptyText'));
    },
    get errorText() {
      return p.errorText;
    },
    get retryLabel() {
      return p.retryLabel;
    },
    onRetry: remote.retry,
  };
  const edit = (next: string) => {
    if (p.disabled) return;
    setText(next);
    setTyping(true);
    setOpen(true);
    setActive(0);
  };
  createEffect(() => {
    if (!p.disabled) return;
    setOpen(false);
    setTyping(false);
  });

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
    if (p.disabled || e.isComposing) return;
    if (popup.handleArrowKey(e)) return;
    switch (e.key) {
      case 'Enter': {
        if (open() && showCustom() && active() === list().length) {
          e.preventDefault();
          pickCustom();
          break;
        }
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
        if (remote.failed() && !e.shiftKey) break;
        setOpen(false);
        commitText();
        break;
    }
  };

  return (
    <Field label={p.label} hint={p.hint} error={p.error} optional={p.optional} required={p.required} id={id()}>
      {(control) => (
        <div
          ref={popup.setRoot}
          class={styles.select}
          onFocusOut={(event) => {
            if (event.relatedTarget instanceof Node && event.currentTarget.contains(event.relatedTarget)) return;
            setOpen(false);
            commitText();
          }}
        >
          <Control
            size={p.size}
            invalid={control.invalid || validation.invalid()}
            disabled={p.disabled}
            class={p.class}
          >
            <Show when={p.iconLeft}>
              <span class={styles.controlPartAdorn}>
                <Show when={remote.loading()} fallback={renderIcon(p.iconLeft)}>
                  <Spinner size="inline" tone="current" />
                </Show>
              </span>
            </Show>
            <ControlInput
              ref={(element) => {
                input = element;
              }}
              id={control.id}
              role="combobox"
              aria-expanded={open()}
              aria-controls={listId()}
              aria-autocomplete="list"
              aria-activedescendant={popup.activeDescendant(navigation())}
              aria-label={p['aria-label']}
              aria-labelledby={p['aria-labelledby']}
              aria-required={p.required || undefined}
              aria-invalid={control.invalid || validation.invalid() || undefined}
              aria-describedby={validation.describedBy(control.describedBy)}
              value={shownText()}
              placeholder={p.placeholder ?? translate('velvet.forms.autocomplete.placeholder')}
              disabled={p.disabled}
              autocomplete="off"
              onInput={(e) => edit(e.currentTarget.value)}
              onFocus={() => !p.disabled && setOpen(true)}
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
            <span
              class={cx(styles.controlPartAdorn, styles.controlPartAdornVariantEnd)}
              style={{ 'pointer-events': 'none' }}
            >
              <Glyph name="chevron-down" />
            </span>
          </Control>
          <FormValue
            validation={validation}
            name={p.name}
            form={p.form}
            required={p.required}
            disabled={p.disabled}
            value={value() ?? ''}
            focusInvalid={() => input.focus()}
            onReset={() => {
              setValue(p.defaultValue);
              setTyping(false);
              setOpen(false);
              input.value = shownText();
            }}
          />
          <Show when={open()}>
            <AutocompleteMenu
              popup={popup}
              options={list()}
              value={value()}
              query={query()}
              label={p['aria-label']}
              labelledBy={p['aria-labelledby'] ?? (p.label ? `${id()}-label` : undefined)}
              custom={custom()}
              status={status}
              onPick={pick}
            />
          </Show>
        </div>
      )}
    </Field>
  );
};
