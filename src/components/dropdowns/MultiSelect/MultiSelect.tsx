import { createMemo, createUniqueId, For, type JSX, Show, splitProps } from 'solid-js';

import ClosableChip from '~/components/feedback/ClosableChip/ClosableChip';
import type { InputSize } from '~/components/inputs/Input/Input';
import CheckboxIndicator from '~/components/switchers/CheckboxIndicator/CheckboxIndicator';
import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import DropdownChevronFieldTrigger from '../DropdownChevronFieldTrigger/DropdownChevronFieldTrigger';
import DropdownOption from '../DropdownOption/DropdownOption';
import DropdownSurface from '../DropdownSurface/DropdownSurface';
import {
  createDropdownSurfaceKeyDownHandler,
  focusDropdownItem,
  getDropdownOpenTarget,
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
    'id',
    'aria-labelledby',
    'aria-describedby',
    'aria-invalid',
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
      focusDropdownItem(panelRef, target);
    });
  };

  const handleTriggerKeyDown = (e: KeyboardEvent) => {
    if (local.disabled || dropdown.open()) return;

    const target = getDropdownOpenTarget(e);
    if (!target) return;
    openAndFocus(target);
  };

  const handleDropdownKeyDown = createDropdownSurfaceKeyDownHandler({
    getSurface: () => panelRef,
    closeDropdown: dropdown.close,
    focusTrigger: () => triggerRef?.focus(),
  });

  return (
    <div {...rest} ref={rootRef} class={classNames(styles.wrapper, local.class)}>
      <div class={styles.triggerArea}>
        <DropdownChevronFieldTrigger
          id={local.id}
          ref={triggerRef}
          label={local.value.length > 0 ? selectedLabels() : (local.placeholder ?? 'Select options')}
          open={dropdown.open()}
          class={classNames(styles.trigger, dropdown.open() && styles.triggerOpen)}
          size={local.size}
          disabled={local.disabled}
          aria-haspopup="listbox"
          aria-expanded={dropdown.open() ? 'true' : 'false'}
          aria-controls={dropdown.open() ? dropdownId : undefined}
          aria-labelledby={local['aria-labelledby']}
          aria-describedby={local['aria-describedby']}
          aria-invalid={local['aria-invalid']}
          onClick={toggleOpen}
          onKeyDown={handleTriggerKeyDown}
        />

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
                      class={styles.option}
                      selected={selected()}
                      label={option.label}
                      prefix={<CheckboxIndicator checked={selected()} class={styles.checkbox} />}
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
      </div>

      <Show when={selectedOptions().length > 0}>
        <div class={styles.selected}>
          <For each={selectedOptions()}>
            {(option) => (
              <ClosableChip
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
