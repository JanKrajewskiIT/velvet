import { IoCheckmark, IoChevronDown, IoCloseOutline } from 'solid-icons/io';
import { createMemo, createSignal, For, type JSX, Show, splitProps } from 'solid-js';

import useClickOutside from '~/hooks/useClickOutside';
import useEscapeKey from '~/hooks/useEscapeKey';
import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './MultiSelect.module.css';

export interface MultiSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface MultiSelectOwnProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value: string[];
  options: MultiSelectOption[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  emptyLabel?: string;
  removeLabel?: string;
  disabled?: boolean;
}

const MultiSelect = (props: Props<MultiSelectOwnProps>) => {
  const [local, rest] = splitProps(props, [
    'value',
    'options',
    'onChange',
    'placeholder',
    'emptyLabel',
    'removeLabel',
    'disabled',
    'class',
  ]);
  const [open, setOpen] = createSignal(false);
  let rootRef: HTMLDivElement | undefined;

  const labelsByValue = createMemo(() => {
    return new Map(local.options.map((option) => [option.value, option.label]));
  });

  const selectedOptions = createMemo(() => {
    return local.value.map((value) => ({
      value,
      label: labelsByValue().get(value) ?? value,
    }));
  });

  const isSelected = (value: string) => local.value.includes(value);

  const toggleOption = (option: MultiSelectOption) => {
    if (local.disabled || option.disabled) return;

    if (isSelected(option.value)) {
      local.onChange(local.value.filter((value) => value !== option.value));
      return;
    }

    local.onChange([...local.value, option.value]);
  };

  const removeValue = (value: string) => {
    local.onChange(local.value.filter((entry) => entry !== value));
  };

  const toggleOpen = () => {
    if (local.disabled) return;
    setOpen((prev) => !prev);
  };

  useClickOutside(
    () => rootRef,
    () => open(),
    () => setOpen(false)
  );
  useEscapeKey(
    () => open(),
    () => setOpen(false)
  );

  return (
    <div {...rest} ref={rootRef} class={classNames(styles.wrapper, local.class)}>
      <button
        type="button"
        class={classNames(styles.trigger, local.disabled && styles.disabled)}
        aria-haspopup="listbox"
        aria-expanded={open() ? 'true' : 'false'}
        onClick={toggleOpen}
        disabled={local.disabled}
      >
        <span class={classNames(styles.triggerText, local.value.length === 0 && styles.placeholder)}>
          <Show when={local.value.length > 0} fallback={local.placeholder ?? 'Select options'}>
            {selectedOptions()
              .map((option) => option.label)
              .join(', ')}
          </Show>
        </span>
        <IoChevronDown class={classNames(styles.chevron, open() && styles.chevronOpen)} />
      </button>

      <Show when={open()}>
        <div class={styles.dropdown} role="listbox" aria-multiselectable="true">
          <Show
            when={local.options.length > 0}
            fallback={<div class={styles.empty}>{local.emptyLabel ?? 'No options'}</div>}
          >
            <For each={local.options}>
              {(option) => {
                const selected = () => isSelected(option.value);

                return (
                  <button
                    type="button"
                    class={classNames(
                      styles.option,
                      selected() && styles.optionSelected,
                      option.disabled && styles.optionDisabled
                    )}
                    onClick={() => toggleOption(option)}
                    disabled={option.disabled}
                    role="option"
                    aria-selected={selected() ? 'true' : 'false'}
                  >
                    <span class={classNames(styles.checkbox, selected() && styles.checkboxChecked)}>
                      <Show when={selected()}>
                        <IoCheckmark size={14} />
                      </Show>
                    </span>
                    <span>{option.label}</span>
                  </button>
                );
              }}
            </For>
          </Show>
        </div>
      </Show>

      <Show when={selectedOptions().length > 0}>
        <div class={styles.selected}>
          <For each={selectedOptions()}>
            {(option) => (
              <span class={styles.tag}>
                {option.label}
                <button
                  type="button"
                  class={styles.removeTag}
                  aria-label={local.removeLabel ? `${local.removeLabel} ${option.label}` : undefined}
                  onClick={() => removeValue(option.value)}
                >
                  <IoCloseOutline />
                </button>
              </span>
            )}
          </For>
        </div>
      </Show>
    </div>
  );
};

export default MultiSelect;
