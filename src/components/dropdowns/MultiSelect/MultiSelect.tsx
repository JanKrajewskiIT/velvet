import { IoCheckmark, IoChevronDown } from 'solid-icons/io';
import { createMemo, For, type JSX, Show, splitProps } from 'solid-js';

import EditableChip from '~/components/feedback/EditableChip/EditableChip';
import type { InputSize } from '~/components/inputs/Input/Input';
import InputButton from '~/components/inputs/InputButton/InputButton';
import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import DropdownOption from '../DropdownBase/DropdownOption';
import DropdownSurface from '../DropdownBase/DropdownSurface';
import useDropdownState from '../DropdownBase/useDropdownState';
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
  size?: InputSize;
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
    'size',
    'class',
  ]);
  let rootRef: HTMLDivElement | undefined;
  const dropdown = useDropdownState(() => rootRef, { isInteractive: () => !local.disabled });

  const labelsByValue = createMemo(() => {
    return new Map(local.options.map((option) => [option.value, option.label]));
  });

  const selectedOptions = createMemo(() => {
    return local.value.map((value) => ({
      value,
      label: labelsByValue().get(value) ?? value,
    }));
  });

  const selectedLabels = createMemo(() =>
    selectedOptions()
      .map((option) => option.label)
      .join(', ')
  );

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
    if (local.disabled) return;
    local.onChange(local.value.filter((entry) => entry !== value));
  };

  const toggleOpen = () => {
    dropdown.toggle();
  };

  return (
    <div {...rest} ref={rootRef} class={classNames(styles.wrapper, local.class)}>
      <InputButton
        class={classNames(styles.trigger, local.disabled && styles.disabled)}
        size={local.size}
        disabled={local.disabled}
        aria-haspopup="listbox"
        aria-expanded={dropdown.open() ? 'true' : 'false'}
        onClick={toggleOpen}
      >
        <span class={classNames(styles.triggerText, local.value.length === 0 && styles.placeholder)}>
          <Show when={local.value.length > 0} fallback={local.placeholder ?? 'Select options'}>
            {selectedLabels()}
          </Show>
        </span>
        <IoChevronDown class={classNames(styles.chevron, dropdown.open() && styles.chevronOpen)} />
      </InputButton>

      <Show when={dropdown.open()}>
        <DropdownSurface class={styles.dropdown} role="listbox" aria-multiselectable="true">
          <Show
            when={local.options.length > 0}
            fallback={<div class={styles.empty}>{local.emptyLabel ?? 'No options'}</div>}
          >
            <For each={local.options}>
              {(option) => {
                const selected = () => isSelected(option.value);

                return (
                  <DropdownOption
                    class={classNames(styles.option, option.disabled && styles.optionDisabled)}
                    selected={selected()}
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
                  </DropdownOption>
                );
              }}
            </For>
          </Show>
        </DropdownSurface>
      </Show>

      <Show when={selectedOptions().length > 0}>
        <div class={styles.selected}>
          <For each={selectedOptions()}>
            {(option) => (
              <EditableChip
                label={option.label}
                removeLabel={local.removeLabel ? `${local.removeLabel} ${option.label}` : undefined}
                disabled={local.disabled}
                onRemove={() => removeValue(option.value)}
              />
            )}
          </For>
        </div>
      </Show>
    </div>
  );
};

export default MultiSelect;
