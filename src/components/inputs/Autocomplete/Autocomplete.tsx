import { IoCloseOutline } from 'solid-icons/io';
import { createMemo, createSignal, For, Show } from 'solid-js';

import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import Input, { type InputSize } from '../Input/Input';
import DropdownOption from '../shared/DropdownOption';
import DropdownSurface from '../shared/DropdownSurface';
import styles from './Autocomplete.module.css';

interface AutocompleteProps {
  values: string[];
  options: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  removeLabel?: string;
  size?: InputSize;
}

const Autocomplete = (props: Props<AutocompleteProps>) => {
  const [inputValue, setInputValue] = createSignal('');
  const [showDropdown, setShowDropdown] = createSignal(false);
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
  };

  const removeValue = (value: string) => {
    props.onChange(props.values.filter((r) => r !== value));
  };

  const handleInput = (e: InputEvent & { currentTarget: HTMLInputElement }) => {
    setInputValue(e.currentTarget.value);
    setShowDropdown(true);
  };

  const handleBlur = () => {
    setTimeout(() => setShowDropdown(false), 200);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && inputValue().trim()) {
      e.preventDefault();
      addValue(inputValue().trim());
    }

    if (e.key === 'Escape') {
      setShowDropdown(false);
    }
  };

  return (
    <div class={`${styles.wrapper} ${props.class ?? ''}`}>
      <div class={styles.selectedTags}>
        <For each={props.values}>
          {(value) => (
            <span class={styles.tag}>
              {value}
              <button
                type="button"
                class={styles.removeTag}
                aria-label={props.removeLabel ? `${props.removeLabel} ${value}` : undefined}
                onClick={() => removeValue(value)}
              >
                <IoCloseOutline />
              </button>
            </span>
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
          onFocus={() => setShowDropdown(true)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder={props.placeholder}
        />

        <Show when={showDropdown() && filteredOptions().length > 0}>
          <DropdownSurface class={styles.dropdown} role="listbox">
            <For each={filteredOptions()}>
              {(option) => (
                <DropdownOption
                  class={classNames(styles.dropdownItem)}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => addValue(option)}
                >
                  {option}
                </DropdownOption>
              )}
            </For>
          </DropdownSurface>
        </Show>
      </div>
    </div>
  );
};

export default Autocomplete;
