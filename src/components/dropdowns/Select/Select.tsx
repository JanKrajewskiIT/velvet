import { FiChevronDown } from 'solid-icons/fi';
import type { JSX } from 'solid-js';
import { createEffect, createMemo, createSignal, createUniqueId, For, onMount, splitProps } from 'solid-js';

import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import type { InputSize } from '../../inputs/Input/Input';
import InputButton from '../../inputs/InputButton/InputButton';
import DropdownOption from '../DropdownBase/DropdownOption';
import DropdownSurface from '../DropdownBase/DropdownSurface';
import useDropdownState from '../DropdownBase/useDropdownState';
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

  const isInteractive = () => !local.disabled && !local.readOnly;
  const dropdown = useDropdownState(() => wrapperRef, { isInteractive });

  const toggle = () => {
    dropdown.toggle();
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

    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggle();
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      moveSelection(1);
      return;
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      moveSelection(-1);
    }
  };

  return (
    <div ref={wrapperRef} class={classNames(styles.selectWrapper, local.class)}>
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

      <InputButton
        size={local.size}
        disabled={local.disabled}
        invalid={local.invalid}
        readOnly={local.readOnly}
        class={classNames(
          styles.selectTrigger,
          dropdown.open() && styles.selectTriggerOpen,
          local.readOnly && styles.selectTriggerReadonly
        )}
        onClick={toggle}
        onKeyDown={handleTriggerKeyDown}
        aria-haspopup="listbox"
        aria-expanded={dropdown.open()}
        aria-controls={dropdown.open() ? dropdownId : undefined}
        aria-readonly={local.readOnly || undefined}
      >
        <span class={classNames(styles.selectValue, currentValue() === '' && styles.selectPlaceholder)}>
          {selectedLabel()}
        </span>
        <FiChevronDown class={classNames(styles.selectChevron, dropdown.open() && styles.selectChevronOpen)} />
      </InputButton>

      {dropdown.open() && (
        <DropdownSurface id={dropdownId} class={styles.selectDropdown} role="listbox">
          <For each={options()}>
            {(option) => (
              <DropdownOption
                class={classNames(styles.selectOption, option.disabled && styles.selectOptionDisabled)}
                selected={option.value === currentValue()}
                role="option"
                aria-selected={option.value === currentValue()}
                disabled={option.disabled || !!local.readOnly}
                onClick={() => selectValue(option.value)}
              >
                {option.label}
              </DropdownOption>
            )}
          </For>
        </DropdownSurface>
      )}
    </div>
  );
};

export default Select;
