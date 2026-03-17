import { createMemo, createSignal, createUniqueId, For, Show } from 'solid-js';

import EditableChip from '~/components/feedback/EditableChip/EditableChip';
import Input, { type InputSize } from '~/components/inputs/Input/Input';
import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import DropdownOption from '../DropdownOption/DropdownOption';
import DropdownSurface from '../DropdownSurface/DropdownSurface';
import styles from './Autocomplete.module.css';

interface AutocompleteProps {
  values: string[];
  options: string[];
  onChange: (values: string[]) => void;
  name?: string;
  disabled?: boolean;
  placeholder?: string;
  removeLabel?: string;
  size?: InputSize;
}

const Autocomplete = (props: Props<AutocompleteProps>) => {
  const [inputValue, setInputValue] = createSignal('');
  const [showDropdown, setShowDropdown] = createSignal(false);
  const [activeIndex, setActiveIndex] = createSignal(-1);
  const dropdownId = createUniqueId();
  let inputRef: HTMLInputElement | undefined;

  const filteredOptions = createMemo(() => {
    const query = inputValue().toLowerCase();
    const available = props.options.filter((r) => !props.values.includes(r));
    if (!query) return available;
    return available.filter((r) => r.toLowerCase().includes(query));
  });

  const addValue = (value: string) => {
    if (!props.values.includes(value)) {
      props.onChange([...props.values, value]);
    }

    setInputValue('');
    setShowDropdown(document.activeElement === inputRef);
    setActiveIndex(-1);
  };

  const removeValue = (value: string) => {
    props.onChange(props.values.filter((r) => r !== value));
  };

  const handleInput = (e: InputEvent & { currentTarget: HTMLInputElement }) => {
    if (props.disabled) return;
    setInputValue(e.currentTarget.value);
    setShowDropdown(true);
    setActiveIndex(0);
  };

  const handleBlur = () => {
    setTimeout(() => {
      setShowDropdown(false);
      setActiveIndex(-1);
    }, 200);
  };

  const activeOptionId = createMemo(() => {
    if (!showDropdown()) return undefined;
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
    if (props.disabled) return;

    if ((e.key === 'Enter' || e.key === ' ') && showDropdown()) {
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
      if (!showDropdown()) {
        setShowDropdown(true);
      }
      e.preventDefault();
      moveActiveIndex(1);
      return;
    }

    if (e.key === 'ArrowUp') {
      if (!showDropdown()) {
        setShowDropdown(true);
      }
      e.preventDefault();
      moveActiveIndex(-1);
      return;
    }

    if (e.key === 'Home' && showDropdown()) {
      e.preventDefault();
      setActiveIndex(0);
      return;
    }

    if (e.key === 'End' && showDropdown()) {
      e.preventDefault();
      setActiveIndex(filteredOptions().length - 1);
      return;
    }

    if (e.key === 'Escape') {
      setShowDropdown(false);
      setActiveIndex(-1);
    }
  };

  return (
    <div class={classNames(styles.wrapper, props.class)}>
      <div class={styles.selectedTags}>
        <For each={props.values}>
          {(value) => (
            <EditableChip
              label={value}
              removeLabel={props.removeLabel ? `${props.removeLabel} ${value}` : undefined}
              onRemove={() => removeValue(value)}
            />
          )}
        </For>
      </div>

      <div class={styles.inputWrapper}>
        <Input
          ref={inputRef}
          type="text"
          size={props.size}
          value={inputValue()}
          onInput={handleInput}
          onFocus={() => {
            setShowDropdown(true);
            if (filteredOptions().length > 0) setActiveIndex(0);
          }}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder={props.placeholder}
          disabled={props.disabled}
          role="combobox"
          aria-expanded={showDropdown() ? 'true' : 'false'}
          aria-controls={showDropdown() ? dropdownId : undefined}
          aria-autocomplete="list"
          aria-activedescendant={activeOptionId()}
          aria-haspopup="listbox"
        />

        <Show when={showDropdown() && filteredOptions().length > 0}>
          <DropdownSurface id={dropdownId} class={styles.dropdown} align="fullWidth" origin="top" role="listbox">
            <For each={filteredOptions()}>
              {(option, index) => (
                <DropdownOption
                  id={`${dropdownId}-option-${String(index())}`}
                  label={option}
                  role="option"
                  aria-selected={activeIndex() === index()}
                  selected={activeIndex() === index()}
                  onMouseEnter={() => setActiveIndex(index())}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => addValue(option)}
                />
              )}
            </For>
          </DropdownSurface>
        </Show>
      </div>

      <Show when={Boolean(props.name)}>
        <For each={props.values}>
          {(value) => <input type="hidden" name={props.name} value={value} disabled={props.disabled} />}
        </For>
      </Show>
    </div>
  );
};

export default Autocomplete;
