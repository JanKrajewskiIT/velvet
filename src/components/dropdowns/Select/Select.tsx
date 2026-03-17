import type { JSX } from 'solid-js';
import { createEffect, createMemo, createSignal, createUniqueId, For, onMount, splitProps } from 'solid-js';

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
import styles from './Select.module.css';

interface SelectOwnProps extends JSX.SelectHTMLAttributes<HTMLSelectElement> {
  size?: InputSize;
  invalid?: boolean;
  readOnly?: boolean;
}

const Select = (props: Props<SelectOwnProps>) => {
  const [local, rest] = splitProps(props, ['class', 'size', 'children', 'value', 'disabled', 'invalid', 'readOnly']);
  const [options, setOptions] = createSignal<{ value: string; label: string; disabled: boolean }[]>([]);
  const dropdownId = createUniqueId();

  let wrapperRef: HTMLDivElement | undefined;
  let nativeSelectRef: HTMLSelectElement | undefined;
  let triggerRef: HTMLButtonElement | undefined;
  let panelRef: HTMLDivElement | undefined;

  const isInteractive = () => !local.disabled && !local.readOnly;
  const dropdown = useDropdownState(() => wrapperRef, { isInteractive });

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

  const syncOptions = () => {
    if (!nativeSelectRef) return;
    setOptions(
      Array.from(nativeSelectRef.options).map((option) => ({
        value: option.value,
        label: option.text,
        disabled: option.disabled,
      }))
    );
  };

  onMount(() => syncOptions());

  createEffect(() => {
    void local.children;
    void local.value;
    syncOptions();
  });

  const currentValue = createMemo(() => {
    if (local.value !== undefined) return String(local.value);
    return nativeSelectRef?.value ?? '';
  });

  const selectedLabel = createMemo(() => {
    const selected = options().find((option) => option.value === currentValue());
    if (selected) return selected.label;
    return options()[0]?.label ?? '';
  });

  const selectValue = (value: string) => {
    if (local.readOnly) return;
    if (!nativeSelectRef) return;
    if (nativeSelectRef.value !== value) {
      nativeSelectRef.value = value;
      nativeSelectRef.dispatchEvent(new Event('input', { bubbles: true }));
      nativeSelectRef.dispatchEvent(new Event('change', { bubbles: true }));
    }
    dropdown.close();
  };

  const moveSelection = (direction: 1 | -1) => {
    const enabledOptions = options().filter((option) => !option.disabled);
    if (enabledOptions.length === 0) return;

    const currentIndex = enabledOptions.findIndex((option) => option.value === currentValue());
    const startIndex = currentIndex === -1 ? (direction === 1 ? -1 : 0) : currentIndex;
    const nextIndex = (startIndex + direction + enabledOptions.length) % enabledOptions.length;
    const next = enabledOptions[nextIndex];
    if (next) selectValue(next.value);
  };

  const handleTriggerKeyDown = (e: KeyboardEvent) => {
    if (!isInteractive()) return;

    if (dropdown.open()) return;

    const target = getDropdownOpenTarget(e);
    if (target) {
      openAndFocus(target);
      return;
    }

    if (e.key === 'PageDown') {
      e.preventDefault();
      moveSelection(1);
      return;
    }

    if (e.key === 'PageUp') {
      e.preventDefault();
      moveSelection(-1);
    }
  };

  const handleDropdownKeyDown = (e: KeyboardEvent) => {
    if (!panelRef) return;
    const items = getFocusableDropdownItems(panelRef);
    const current = document.activeElement as HTMLElement;
    const currentIndex = items.indexOf(current as HTMLButtonElement);

    if (handleDropdownArrowNavigation(e, items, currentIndex)) return;

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
    <div ref={wrapperRef} class={classNames(styles.selectWrapper, local.class)}>
      <InputButton
        ref={triggerRef}
        size={local.size}
        disabled={local.disabled}
        invalid={local.invalid}
        readOnly={local.readOnly}
        class={classNames(
          styles.selectTrigger,
          dropdown.open() && styles.selectTriggerOpen,
          local.readOnly && styles.selectTriggerReadonly
        )}
        onClick={dropdown.toggle}
        onKeyDown={handleTriggerKeyDown}
        aria-haspopup="listbox"
        aria-expanded={dropdown.open()}
        aria-controls={dropdown.open() ? dropdownId : undefined}
        aria-readonly={local.readOnly || undefined}
      >
        <DropdownTriggerContent
          label={selectedLabel()}
          open={dropdown.open()}
          placeholder={currentValue() === ''}
          class={styles.selectTriggerContent}
        />
      </InputButton>

      {dropdown.open() && (
        <DropdownSurface
          ref={panelRef}
          id={dropdownId}
          class={styles.selectDropdown}
          align="fullWidth"
          origin="top"
          role="listbox"
          onKeyDown={handleDropdownKeyDown}
        >
          <For each={options()}>
            {(option) => (
              <DropdownOption
                class={classNames(styles.selectOption, option.disabled && styles.selectOptionDisabled)}
                selected={option.value === currentValue()}
                label={option.label}
                role="option"
                aria-selected={option.value === currentValue()}
                disabled={option.disabled || !!local.readOnly}
                onClick={() => selectValue(option.value)}
              />
            )}
          </For>
        </DropdownSurface>
      )}

      <select
        {...rest}
        ref={nativeSelectRef}
        value={local.value}
        disabled={local.disabled}
        class={styles.selectNative}
        tabIndex={-1}
        aria-hidden="true"
      >
        {local.children}
      </select>
    </div>
  );
};

export default Select;
