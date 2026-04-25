import {
  batch,
  createEffect,
  createMemo,
  createSignal,
  createUniqueId,
  For,
  on,
  onCleanup,
  splitProps,
  untrack,
} from 'solid-js';

import useDropdownPanel from '~/hooks/useDropdownPanel';
import type Props from '~/models/Props';
import type { AriaFieldProps, ComponentSize, SelectCoreNativeProps } from '~/models/Props';
import { joinAriaIds, resolveAriaInvalid } from '~/utils/aria';
import classNames from '~/utils/classNames';

import DropdownChevronFieldTrigger from '../Dropdown/DropdownChevronFieldTrigger/DropdownChevronFieldTrigger';
import DropdownOption from '../Dropdown/DropdownOption/DropdownOption';
import DropdownSurface from '../Dropdown/DropdownSurface/DropdownSurface';
import styles from './Select.module.css';

interface SelectOwnProps extends SelectCoreNativeProps, AriaFieldProps {
  size?: ComponentSize;
  invalid?: boolean;
  readOnly?: boolean;
  options: readonly SelectOption[];
}

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

const Select = (props: Props<SelectOwnProps>) => {
  const [local, rest] = splitProps(props, [
    'class',
    'size',
    'options',
    'value',
    'id',
    'disabled',
    'invalid',
    'readOnly',
    'aria-labelledby',
    'aria-describedby',
    'aria-invalid',
    'aria-errormessage',
  ]);
  const [internalValue, setInternalValue] = createSignal('');
  const dropdownId = createUniqueId();
  const triggerLabelId = createUniqueId();

  let wrapperRef: HTMLDivElement | undefined;
  let nativeSelectRef: HTMLSelectElement | undefined;
  let triggerRef: HTMLButtonElement | undefined;
  let panelRef: HTMLDivElement | undefined;

  const isInteractive = () => !local.disabled && !local.readOnly;
  const dropdown = useDropdownPanel({
    rootRef: () => wrapperRef,
    panelRef: () => panelRef,
    triggerRef: () => triggerRef,
    isInteractive,
  });

  createEffect(
    on(
      () => [local.value, local.options] as const,
      ([value, options]) => {
        if (value !== undefined) {
          setInternalValue(String(value));
          return;
        }

        const current = untrack(internalValue);
        const hasCurrent = options.some((option) => option.value === current);
        if (!hasCurrent) {
          setInternalValue(options[0]?.value ?? '');
        }
      },
      { defer: true },
    ),
  );

  const currentValue = createMemo(() => {
    if (local.value !== undefined) return String(local.value);
    return internalValue();
  });
  const enabledOptions = createMemo(() => local.options.filter((option) => !option.disabled));
  const selectedOption = createMemo(() => local.options.find((option) => option.value === currentValue()));
  const isOpen = createMemo(() => dropdown.open());
  const describedBy = createMemo(() => local['aria-describedby']);
  const labelledBy = createMemo(() => joinAriaIds(local['aria-labelledby'], triggerLabelId));

  const selectedLabel = createMemo(() => {
    const selected = selectedOption();
    if (selected) return selected.label;
    return local.options[0]?.label ?? '';
  });

  let focusRafId: number | undefined;
  const focusSelectedOption = () => {
    if (focusRafId !== undefined) cancelAnimationFrame(focusRafId);
    focusRafId = requestAnimationFrame(() => {
      focusRafId = undefined;
      const panel = panelRef;
      if (!panel) return;
      const selected = panel.querySelector<HTMLButtonElement>('[aria-selected="true"]:not(:disabled)');
      if (selected) {
        selected.focus();
        return;
      }
      const first = panel.querySelector<HTMLButtonElement>('button:not(:disabled)');
      first?.focus();
    });
  };

  onCleanup(() => {
    if (focusRafId !== undefined) cancelAnimationFrame(focusRafId);
  });

  const selectValue = (value: string) => {
    if (local.readOnly || local.disabled) return;
    if (!nativeSelectRef) return;

    if (local.value === undefined) {
      setInternalValue(value);
    }

    if (nativeSelectRef.value !== value) {
      nativeSelectRef.value = value;
      nativeSelectRef.dispatchEvent(new Event('input', { bubbles: true }));
      nativeSelectRef.dispatchEvent(new Event('change', { bubbles: true }));
    }
    dropdown.close();
  };

  const moveSelection = (direction: 1 | -1) => {
    if (enabledOptions().length === 0) return;

    const currentIndex = enabledOptions().findIndex((option) => option.value === currentValue());
    const startIndex = currentIndex === -1 ? (direction === 1 ? -1 : 0) : currentIndex;
    const nextIndex = (startIndex + direction + enabledOptions().length) % enabledOptions().length;
    const next = enabledOptions()[nextIndex];
    if (next) selectValue(next.value);
  };

  const handleTriggerKeyDown = (e: KeyboardEvent) => {
    if (!isInteractive()) return;

    if (dropdown.openFromKeyboard(e, { ignoreWhenOpen: true })) return;

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

  const handleTriggerClick = () => {
    if (!isInteractive()) return;

    if (isOpen()) {
      dropdown.close();
      return;
    }

    batch(() => {
      dropdown.openDropdown();
      focusSelectedOption();
    });
  };

  return (
    <div ref={wrapperRef} class={classNames(styles.selectWrapper, local.class)}>
      <DropdownChevronFieldTrigger
        ref={triggerRef}
        id={local.id}
        label={selectedLabel()}
        labelId={triggerLabelId}
        open={isOpen()}
        size={local.size}
        disabled={local.disabled}
        invalid={local.invalid}
        readOnly={local.readOnly}
        class={classNames(styles.selectTrigger, isOpen() && styles.selectTriggerOpen)}
        onClick={handleTriggerClick}
        onKeyDown={handleTriggerKeyDown}
        aria-haspopup="listbox"
        aria-expanded={isOpen()}
        aria-controls={isOpen() ? dropdownId : undefined}
        aria-labelledby={labelledBy()}
        aria-describedby={describedBy()}
        aria-readonly={local.readOnly || undefined}
        aria-invalid={resolveAriaInvalid(local.invalid, props['aria-invalid'])}
        aria-errormessage={props['aria-errormessage']}
      />

      {isOpen() && (
        <DropdownSurface
          ref={panelRef}
          id={dropdownId}
          class={styles.selectDropdown}
          align="fullWidth"
          anchor={() => wrapperRef}
          origin="top"
          role="listbox"
          onKeyDown={dropdown.handlePanelKeyDown}
        >
          <For each={local.options}>
            {(option) => {
              const isSelected = createMemo(() => option.value === selectedOption()?.value);
              return (
                <DropdownOption
                  selected={isSelected()}
                  label={option.label}
                  role="option"
                  aria-selected={isSelected()}
                  disabled={option.disabled || !!local.readOnly}
                  onClick={() => selectValue(option.value)}
                />
              );
            }}
          </For>
        </DropdownSurface>
      )}

      <select
        {...rest}
        ref={nativeSelectRef}
        value={currentValue()}
        disabled={local.disabled}
        class={styles.selectNative}
        tabIndex={-1}
        aria-hidden="true"
      >
        <For each={local.options}>
          {(option) => (
            <option value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          )}
        </For>
      </select>
    </div>
  );
};

export type { SelectOwnProps as SelectProps };
export default Select;
