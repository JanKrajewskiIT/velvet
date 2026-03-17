import { IoCheckmark } from 'solid-icons/io';
import { createMemo, createUniqueId, For, type JSX, Show, splitProps } from 'solid-js';

import EditableChip from '~/components/feedback/EditableChip/EditableChip';
import type { InputSize } from '~/components/inputs/Input/Input';
import InputButton from '~/components/inputs/InputButton/InputButton';
import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import DropdownOption from '../DropdownOption/DropdownOption';
import DropdownSurface from '../DropdownSurface/DropdownSurface';
import DropdownTriggerContent from '../DropdownTriggerContent/DropdownTriggerContent';
import {
  focusFirstDropdownItem,
  focusLastDropdownItem,
  getDropdownOpenTarget,
  getFocusableDropdownItems,
  handleDropdownArrowNavigation,
} from '../shared/dropdownKeyboard';
import useDropdownState from '../shared/useDropdownState';
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
  name?: string;
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
    'name',
    'placeholder',
    'emptyLabel',
    'removeLabel',
    'disabled',
    'size',
    'class',
  ]);
  let rootRef: HTMLDivElement | undefined;
  let triggerRef: HTMLButtonElement | undefined;
  let panelRef: HTMLDivElement | undefined;
  const dropdownId = createUniqueId();
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

  const openAndFocus = (target: 'first' | 'last') => {
    dropdown.openDropdown();
    requestAnimationFrame(() => {
      if (!panelRef) return;
      if (target === 'last') {
        focusLastDropdownItem(panelRef);
        return;
      }
      focusFirstDropdownItem(panelRef);
    });
  };

  const handleTriggerKeyDown = (e: KeyboardEvent) => {
    if (local.disabled || dropdown.open()) return;

    const target = getDropdownOpenTarget(e);
    if (!target) return;
    openAndFocus(target);
  };

  const handleDropdownKeyDown = (e: KeyboardEvent) => {
    if (!panelRef) return;
    const items = getFocusableDropdownItems(panelRef);
    const current = document.activeElement as HTMLElement;
    const index = items.indexOf(current as HTMLButtonElement);

    if (handleDropdownArrowNavigation(e, items, index)) return;

    if (e.key === 'Escape') {
      e.preventDefault();
      dropdown.close();
      triggerRef?.focus();
      return;
    }

    if (e.key === 'Tab') {
      dropdown.close();
    }
  };

  return (
    <div {...rest} ref={rootRef} class={classNames(styles.wrapper, local.class)}>
      <InputButton
        ref={triggerRef}
        class={classNames(styles.trigger, local.disabled && styles.disabled)}
        size={local.size}
        disabled={local.disabled}
        aria-haspopup="listbox"
        aria-expanded={dropdown.open() ? 'true' : 'false'}
        aria-controls={dropdown.open() ? dropdownId : undefined}
        onClick={toggleOpen}
        onKeyDown={handleTriggerKeyDown}
      >
        <DropdownTriggerContent
          label={local.value.length > 0 ? selectedLabels() : (local.placeholder ?? 'Select options')}
          open={dropdown.open()}
          placeholder={local.value.length === 0}
          class={styles.triggerContent}
        />
      </InputButton>

      <Show when={dropdown.open()}>
        <DropdownSurface
          ref={panelRef}
          id={dropdownId}
          class={styles.dropdown}
          align="fullWidth"
          origin="top"
          role="listbox"
          aria-multiselectable="true"
          onKeyDown={handleDropdownKeyDown}
        >
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
                    label={option.label}
                    prefix={
                      <span class={classNames(styles.checkbox, selected() && styles.checkboxChecked)}>
                        <Show when={selected()}>
                          <IoCheckmark size={14} />
                        </Show>
                      </span>
                    }
                    onClick={() => toggleOption(option)}
                    disabled={option.disabled}
                    role="option"
                    aria-selected={selected() ? 'true' : 'false'}
                  />
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

      <Show when={Boolean(local.name)}>
        <For each={local.value}>
          {(value) => <input type="hidden" name={local.name} value={value} disabled={local.disabled} />}
        </For>
      </Show>
    </div>
  );
};

export default MultiSelect;
