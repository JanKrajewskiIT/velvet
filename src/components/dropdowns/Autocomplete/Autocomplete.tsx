import { createMemo, createSignal, createUniqueId, For, Show, splitProps } from 'solid-js';

import ClosableChip from '~/components/feedback/ClosableChip/ClosableChip';
import useDropdownState from '~/hooks/useDropdownState';
import { useI18n } from '~/i18n/I18nProvider';
import type Props from '~/models/Props';
import type { AriaFieldProps, ComponentSize } from '~/models/Props';
import { resolveAriaInvalid } from '~/utils/aria';
import classNames from '~/utils/classNames';

import DropdownInputTrigger from '../Dropdown/DropdownInputTrigger/DropdownInputTrigger';
import DropdownOption from '../Dropdown/DropdownOption/DropdownOption';
import DropdownSurface from '../Dropdown/DropdownSurface/DropdownSurface';
import styles from './Autocomplete.module.css';

interface AutocompleteProps extends AriaFieldProps {
  values: string[];
  options: string[];
  onChange: (values: string[]) => void;
  id?: string;
  name?: string;
  disabled?: boolean;
  size?: ComponentSize;
}

const Autocomplete = (props: Props<AutocompleteProps>) => {
  const { ts } = useI18n();
  const [local, rest] = splitProps(props, [
    'values',
    'options',
    'onChange',
    'id',
    'name',
    'disabled',
    'size',
    'aria-labelledby',
    'aria-describedby',
    'aria-invalid',
    'class',
  ]);
  const [inputValue, setInputValue] = createSignal('');
  const [activeIndex, setActiveIndex] = createSignal(-1);
  const dropdownId = createUniqueId();
  let rootRef: HTMLDivElement | undefined;
  let inputRef: HTMLInputElement | undefined;

  const dropdown = useDropdownState(() => rootRef, { isInteractive: () => !local.disabled });

  const filteredOptions = createMemo(() => {
    const query = inputValue().toLowerCase();
    const available = local.options.filter((r) => !local.values.includes(r));
    if (!query) return available;
    return available.filter((r) => r.toLowerCase().includes(query));
  });
  const emptyLabel = createMemo(() => ts('common.noOptions'));

  const addValue = (value: string) => {
    if (!local.values.includes(value)) {
      local.onChange([...local.values, value]);
    }

    setInputValue('');
    setActiveIndex(-1);
    dropdown.setOpen(document.activeElement === inputRef);
  };

  const removeValue = (value: string) => {
    if (local.disabled) return;
    local.onChange(local.values.filter((r) => r !== value));
  };

  const handleInput = (e: InputEvent & { currentTarget: HTMLInputElement }) => {
    if (local.disabled) return;
    setInputValue(e.currentTarget.value);
    dropdown.openDropdown();
    setActiveIndex(0);
  };

  const handleBlur = () => {
    requestAnimationFrame(() => {
      const active = document.activeElement;
      if (active && rootRef?.contains(active)) return;
      dropdown.close();
      setActiveIndex(-1);
    });
  };

  const activeOptionId = createMemo(() => {
    if (!dropdown.open()) return undefined;
    const index = activeIndex();
    if (index < 0 || index >= filteredOptions().length) return undefined;
    return `${dropdownId}-option-${String(index)}`;
  });

  const moveActiveIndex = (direction: 1 | -1) => {
    const count = filteredOptions().length;
    if (count === 0) {
      setActiveIndex(-1);
      return;
    }

    const current = activeIndex();
    const start = current >= 0 ? current : direction === 1 ? -1 : 0;
    const next = (start + direction + count) % count;
    setActiveIndex(next);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (local.disabled) return;

    if (e.key === 'Backspace' && inputValue().length === 0) {
      const lastValue = local.values[local.values.length - 1];
      if (lastValue !== undefined) {
        e.preventDefault();
        removeValue(lastValue);
      }
      return;
    }

    if ((e.key === 'Enter' || e.key === ' ') && dropdown.open()) {
      const index = activeIndex();
      const activeOption = filteredOptions()[index];
      if (activeOption !== undefined) {
        e.preventDefault();
        addValue(activeOption);
        return;
      }
    }

    if (e.key === 'Enter' && inputValue().trim()) {
      e.preventDefault();
      addValue(inputValue().trim());
      return;
    }

    if (e.key === 'ArrowDown') {
      if (!dropdown.open()) {
        dropdown.openDropdown();
      }
      e.preventDefault();
      moveActiveIndex(1);
      return;
    }

    if (e.key === 'ArrowUp') {
      if (!dropdown.open()) {
        dropdown.openDropdown();
      }
      e.preventDefault();
      moveActiveIndex(-1);
      return;
    }

    if (e.key === 'Home' && dropdown.open()) {
      e.preventDefault();
      setActiveIndex(0);
      return;
    }

    if (e.key === 'End' && dropdown.open()) {
      e.preventDefault();
      setActiveIndex(filteredOptions().length - 1);
      return;
    }

    if (e.key === 'Escape') {
      dropdown.close();
      setActiveIndex(-1);
    }
  };

  return (
    <div {...rest} ref={rootRef} class={classNames(styles.wrapper, local.class)}>
      <div class={styles.selectedTags} aria-live="polite">
        <For each={local.values}>
          {(value) => <ClosableChip label={value} disabled={local.disabled} onRemove={() => removeValue(value)} />}
        </For>
      </div>

      <div class={styles.inputWrapper}>
        <DropdownInputTrigger
          id={local.id}
          ref={inputRef}
          type="text"
          size={local.size}
          value={inputValue()}
          onInput={handleInput}
          onFocus={() => {
            dropdown.openDropdown();
            if (filteredOptions().length > 0) setActiveIndex(0);
          }}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder={ts('common.searchEllipsis')}
          disabled={local.disabled}
          open={dropdown.open()}
          aria-expanded={dropdown.open() ? 'true' : 'false'}
          aria-controls={dropdown.open() ? dropdownId : undefined}
          aria-autocomplete="list"
          aria-activedescendant={activeOptionId()}
          aria-haspopup="listbox"
          role="combobox"
          aria-labelledby={local['aria-labelledby']}
          aria-describedby={local['aria-describedby']}
          aria-invalid={resolveAriaInvalid(undefined, props['aria-invalid'])}
          aria-errormessage={props['aria-errormessage']}
        />

        <Show when={dropdown.open()}>
          <DropdownSurface id={dropdownId} class={styles.dropdown} align="fullWidth" origin="top" role="listbox">
            <Show when={filteredOptions().length > 0} fallback={<div class={styles.empty}>{emptyLabel()}</div>}>
              <For each={filteredOptions()}>
                {(option, index) => (
                  <DropdownOption
                    id={`${dropdownId}-option-${String(index())}`}
                    label={option}
                    role="option"
                    aria-selected={activeIndex() === index()}
                    selected={activeIndex() === index()}
                    onMouseDown={(e) => {
                      setActiveIndex(index());
                      e.preventDefault();
                    }}
                    onMouseEnter={() => setActiveIndex(index())}
                    onClick={() => {
                      addValue(option);
                      inputRef?.focus();
                    }}
                  />
                )}
              </For>
            </Show>
          </DropdownSurface>
        </Show>
      </div>

      <Show when={Boolean(local.name)}>
        <For each={local.values}>
          {(value) => <input type="hidden" name={local.name} value={value} disabled={local.disabled} />}
        </For>
      </Show>
    </div>
  );
};

export default Autocomplete;
