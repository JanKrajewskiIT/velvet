import { createEffect, createMemo, createSignal, createUniqueId, For, type JSX, mergeProps, Show } from 'solid-js';

import { createActiveOptionScroll } from '../../hooks/createActiveOptionScroll';
import { createControllable } from '../../hooks/createControllable';
import { createDismiss } from '../../hooks/createDismiss';
import { createFloating } from '../../hooks/createFloating';
import { useTranslate } from '../../i18n/useTranslate';
import { activeItemKey } from '../../utils/activeItem';
import { createTypeahead } from '../../utils/createTypeahead';
import { variantClass } from '../../utils/cssModule';
import { cx } from '../../utils/cx';
import { Chevron } from '../primitives/Chevron';
import { Field } from '../primitives/Field';
import { Glyph, renderIcon } from '../primitives/Glyph';
import { Text } from '../primitives/Text';
import { typographyClass } from '../primitives/typography';
import { ComboboxOption } from './ComboboxOption';
import { ComboboxOptionText } from './ComboboxOptionText';
import { createFormValidation } from './createFormValidation';
import type { FormControlProps } from './formControl';
import { FormValue } from './FormValue';
import styles from './Select.module.css';
import { normalizeOption, type SelectOption } from './selectOption';

const CONTROL_CLASSES = {
  sm: styles.controlVariantSm,
  lg: styles.controlVariantLg,
  invalid: styles.controlVariantInvalid,
  disabled: styles.controlVariantDisabled,
  readonly: styles.controlVariantReadonly,
  textarea: styles.controlVariantTextarea,
} as const;

const OPENING_KEYS = ['ArrowDown', 'ArrowUp', 'Enter', ' '];
const NO_OPTIONS: ReadonlyArray<string | SelectOption> = [];

export interface SelectChangeEvent {
  target: { value: string; name?: string };
}

export interface SelectProps extends FormControlProps {
  label?: JSX.Element;
  hint?: JSX.Element;
  error?: JSX.Element;
  optional?: boolean;
  /** Options as strings or `{ value, label, icon, description, disabled }`. */
  options?: ReadonlyArray<string | SelectOption>;
  /** Shown when nothing is selected. @default localized "Select…" */
  placeholder?: string;
  /** Glyph name or node. */
  iconLeft?: JSX.Element;
  /** @default 'md' */
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  id?: string;
  /** Controlled value. */
  value?: string;
  defaultValue?: string;
  /** Called with the new value. */
  onValueChange?: (value: string) => void;
  /** Native-like: receives `{ target: { value, name } }`. */
  onChange?: (event: SelectChangeEvent) => void;
  /** Styles the trigger. */
  class?: string;
}

/** Custom listbox select (WAI-ARIA select-only combobox). ↑ ↓ Home End Enter Space Esc and type-ahead; the list flips upward near the viewport bottom and is not clipped by scrolling ancestors. */
export const Select = (props: SelectProps) => {
  const p = mergeProps({ options: NO_OPTIONS, size: 'md', defaultValue: '' } satisfies SelectProps, props);
  const translate = useTranslate();
  const validation = createFormValidation();
  const autoId = createUniqueId();
  const id = () => p.id ?? autoId;
  const listId = () => `${id()}-list`;
  const optionId = (index: number) => `${listId()}-${index}`;

  const options = createMemo(() => p.options.map(normalizeOption));
  const [current, setCurrent] = createControllable({
    value: () => p.value,
    defaultValue: p.defaultValue,
    onChange: (value) => {
      p.onValueChange?.(value);
      p.onChange?.({ target: { value, name: p.name } });
    },
  });
  const selected = () => options().find((option) => option.value === current());

  const [open, setOpen] = createSignal(false);
  const [activeKey, setActiveKey] = createSignal<string>();
  const active = () => {
    const key = activeItemKey(
      options(),
      activeKey(),
      (option) => option.value,
      (option) => !option.disabled,
    );
    return options().findIndex((option) => option.value === key);
  };
  const setActive = (index: number) => setActiveKey(options()[index]?.value);
  const [root, setRoot] = createSignal<HTMLElement>();
  let trigger!: HTMLButtonElement;
  const search = createTypeahead();

  createDismiss(open, () => setOpen(false), root);
  const floating = createFloating(open, root, { matchWidth: true });
  createEffect(() => {
    if (p.disabled) setOpen(false);
  });

  const openList = () => {
    if (p.disabled) return;
    setActive(
      Math.max(
        0,
        options().findIndex((option) => option.value === current()),
      ),
    );
    setOpen(true);
  };
  const pick = (option: SelectOption | undefined) => {
    if (p.disabled || !open() || !option || option.disabled) return;
    setCurrent(option.value);
    setOpen(false);
    trigger.focus();
  };
  const move = (direction: 1 | -1) => {
    const list = options();
    let index = active();
    for (let tried = 0; tried < list.length; tried++) {
      index = (index + direction + list.length) % list.length;
      if (!list[index]?.disabled) break;
    }
    setActive(index);
  };
  const jumpTo = (edge: 'first' | 'last') => {
    const enabled = options().flatMap((option, index) => (option.disabled ? [] : [index]));
    setActive((edge === 'first' ? enabled[0] : enabled.at(-1)) ?? active());
  };
  const typeahead = (key: string) => {
    const enabled = options().flatMap((option, index) => (option.disabled ? [] : [{ option, index }]));
    const match = search(
      key,
      enabled.map((entry) => entry.option.label),
      enabled.findIndex((entry) => entry.index === active()),
    );
    if (match >= 0) setActive(enabled[match]?.index ?? active());
  };

  const onKeyDown: JSX.EventHandler<HTMLButtonElement, KeyboardEvent> = (e) => {
    if (p.disabled) return;
    if (!open()) {
      if (OPENING_KEYS.includes(e.key)) {
        e.preventDefault();
        openList();
      }
      return;
    }
    switch (e.key) {
      case 'ArrowDown':
      case 'ArrowUp':
        e.preventDefault();
        move(e.key === 'ArrowDown' ? 1 : -1);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        pick(options()[active()]);
        break;
      case 'Home':
      case 'End':
        e.preventDefault();
        jumpTo(e.key === 'Home' ? 'first' : 'last');
        break;
      case 'Tab':
        setOpen(false);
        break;
      default:
        if (e.key.length === 1 && !e.metaKey && !e.ctrlKey) typeahead(e.key);
    }
  };

  createActiveOptionScroll(open, () => (active() >= 0 ? optionId(active()) : undefined));

  return (
    <Field label={p.label} hint={p.hint} error={p.error} optional={p.optional} required={p.required} id={id()}>
      {(control) => (
        <div ref={setRoot} class={styles.select}>
          <button
            ref={(element) => {
              trigger = element;
            }}
            type="button"
            id={control.id}
            disabled={p.disabled}
            role="combobox"
            aria-label={p['aria-label']}
            aria-labelledby={p['aria-labelledby']}
            aria-required={p.required || undefined}
            aria-haspopup="listbox"
            aria-expanded={open()}
            aria-controls={listId()}
            aria-activedescendant={open() && active() >= 0 ? optionId(active()) : undefined}
            aria-describedby={validation.describedBy(control.describedBy)}
            aria-invalid={control.invalid || validation.invalid() || undefined}
            class={cx(
              typographyClass(p.size === 'sm' ? 'body-sm' : 'body'),
              styles.control,
              styles.selectPartTrigger,
              variantClass(CONTROL_CLASSES, p.size, 'md'),
              (control.invalid || validation.invalid()) && styles.controlVariantInvalid,
              p.disabled && styles.controlVariantDisabled,
              open() && styles.selectPartTriggerVariantOpen,
              p.class,
            )}
            onClick={() => (open() ? setOpen(false) : openList())}
            onKeyDown={onKeyDown}
          >
            <Show when={p.iconLeft}>
              <span class={styles.controlPartAdorn}>{renderIcon(p.iconLeft)}</span>
            </Show>
            <Text
              as="span"
              variant="body"
              tone="inherit"
              class={cx(styles.selectPartValue, !selected() && styles.selectPartValueVariantPlaceholder)}
            >
              {selected()?.label ?? p.placeholder ?? translate('velvet.forms.select.placeholder')}
            </Text>
            <Chevron class={styles.selectPartChevron} />
          </button>
          <FormValue
            validation={validation}
            name={p.name}
            form={p.form}
            required={p.required}
            disabled={p.disabled}
            value={current()}
            focusInvalid={() => trigger.focus()}
            onReset={() => {
              setCurrent(p.defaultValue);
              setOpen(false);
            }}
          />
          <Show when={open()}>
            <ul
              ref={floating.ref}
              id={listId()}
              role="listbox"
              aria-label={p['aria-label']}
              aria-labelledby={p['aria-labelledby'] ?? (p.label ? `${id()}-label` : control.id)}
              class={cx(styles.selectPartMenu, floating.side() === 'top' && styles.selectPartMenuVariantUp)}
              style={floating.style()}
            >
              <For each={options()}>
                {(option, index) => (
                  <ComboboxOption
                    id={optionId(index())}
                    selected={option.value === current()}
                    active={index() === active()}
                    disabled={option.disabled}
                    onHover={() => !option.disabled && setActive(index())}
                    onPick={() => pick(option)}
                  >
                    {renderIcon(option.icon)}
                    <ComboboxOptionText label={option.label} description={option.description} />
                    <Show when={option.value === current()}>
                      <Glyph name="check" class={styles.selectPartCheck} />
                    </Show>
                  </ComboboxOption>
                )}
              </For>
            </ul>
          </Show>
        </div>
      )}
    </Field>
  );
};
