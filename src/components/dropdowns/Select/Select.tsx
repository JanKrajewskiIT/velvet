import type { JSX } from 'solid-js';
import { createEffect, createMemo, createSignal, createUniqueId, For, onMount, splitProps } from 'solid-js';

import type { InputSize } from '~/components/inputs/Input/Input';
import type Props from '~/models/Props';
import type { AriaFieldProps } from '~/models/Props';
import type { SelectCoreNativeProps } from '~/models/Props';
import { resolveAriaInvalid } from '~/utils/aria';
import classNames from '~/utils/classNames';

import DropdownChevronFieldTrigger from '../DropdownChevronFieldTrigger/DropdownChevronFieldTrigger';
import DropdownOption from '../DropdownOption/DropdownOption';
import dropdownOptionStyles from '../DropdownOption/DropdownOption.module.css';
import DropdownSurface from '../DropdownSurface/DropdownSurface';
import {
  createDropdownSurfaceKeyDownHandler,
  focusDropdownItem,
  getDropdownOpenTarget,
} from '../shared/dropdownKeyboard';
import useDropdownState from '../shared/useDropdownState';
import styles from './Select.module.css';

interface SelectOwnProps extends SelectCoreNativeProps, AriaFieldProps {
  size?: InputSize;
  invalid?: boolean;
  readOnly?: boolean;
  children?: JSX.Element;
}

const Select = (props: Props<SelectOwnProps>) => {
  const [local, rest] = splitProps(props, [
    'class',
    'size',
    'children',
    'value',
    'disabled',
    'invalid',
    'readOnly',
    'aria-invalid',
    'aria-errormessage',
  ]);
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
      focusDropdownItem(panelRef, target);
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

  const handleDropdownKeyDown = createDropdownSurfaceKeyDownHandler({
    getSurface: () => panelRef,
    closeDropdown: dropdown.close,
    focusTrigger: () => triggerRef?.focus(),
  });

  return (
    <div ref={wrapperRef} class={classNames(styles.selectWrapper, local.class)}>
      <DropdownChevronFieldTrigger
        ref={triggerRef}
        label={selectedLabel()}
        open={dropdown.open()}
        size={local.size}
        disabled={local.disabled}
        invalid={local.invalid}
        readOnly={local.readOnly}
        class={classNames(styles.selectTrigger, dropdown.open() && styles.selectTriggerOpen)}
        onClick={dropdown.toggle}
        onKeyDown={handleTriggerKeyDown}
        aria-haspopup="listbox"
        aria-expanded={dropdown.open()}
        aria-controls={dropdown.open() ? dropdownId : undefined}
        aria-readonly={local.readOnly || undefined}
        aria-invalid={resolveAriaInvalid(local.invalid, props['aria-invalid'])}
        aria-errormessage={props['aria-errormessage']}
      />

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
                class={classNames(dropdownOptionStyles.item, option.disabled && dropdownOptionStyles.itemDisabled)}
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
