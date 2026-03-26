import type { JSX } from 'solid-js';
import { createEffect, createMemo, createSignal, createUniqueId, For, onMount, splitProps } from 'solid-js';

import useDropdownPanel from '~/hooks/useDropdownPanel';
import type Props from '~/models/Props';
import type { AriaFieldProps, ComponentSize, SelectCoreNativeProps } from '~/models/Props';
import { joinAriaIds, resolveAriaInvalid } from '~/utils/aria';
import classNames from '~/utils/classNames';

import DropdownChevronFieldTrigger from '../Dropdown/DropdownChevronFieldTrigger/DropdownChevronFieldTrigger';
import DropdownOption from '../Dropdown/DropdownOption/DropdownOption';
import dropdownOptionStyles from '../Dropdown/DropdownOption/DropdownOption.module.css';
import DropdownSurface from '../Dropdown/DropdownSurface/DropdownSurface';
import styles from './Select.module.css';

interface SelectOwnProps extends SelectCoreNativeProps, AriaFieldProps {
  size?: ComponentSize;
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
    'id',
    'disabled',
    'invalid',
    'readOnly',
    'aria-labelledby',
    'aria-describedby',
    'aria-invalid',
    'aria-errormessage',
  ]);
  const [options, setOptions] = createSignal<{ value: string; label: string; disabled: boolean }[]>([]);
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

  return (
    <div ref={wrapperRef} class={classNames(styles.selectWrapper, local.class)}>
      <DropdownChevronFieldTrigger
        ref={triggerRef}
        id={local.id}
        label={selectedLabel()}
        labelId={triggerLabelId}
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
        aria-labelledby={joinAriaIds(local['aria-labelledby'], triggerLabelId)}
        aria-describedby={local['aria-describedby']}
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
          onKeyDown={dropdown.handlePanelKeyDown}
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
