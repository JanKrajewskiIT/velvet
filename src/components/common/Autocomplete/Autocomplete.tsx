import { IoCloseOutline } from 'solid-icons/io';
import { createSignal, For, Show } from 'solid-js';

import type Props from '../../../models/Props';
import Input from '../Input/Input';
import styles from './Autocomplete.module.css';

interface AutocompleteProps {
  values: string[];
  options: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  removeLabel?: string;
}

const Autocomplete = (props: Props<AutocompleteProps>) => {
  const [inputValue, setInputValue] = createSignal('');
  const [showDropdown, setShowDropdown] = createSignal(false);

  const filteredOptions = () => {
    const query = inputValue().toLowerCase();
    const available = props.options.filter((r) => !props.values.includes(r));
    if (!query) return available;
    return available.filter((r) => r.toLowerCase().includes(query));
  };

  const addValue = (value: string) => {
    if (!props.values.includes(value)) {
      props.onChange([...props.values, value]);
    }
    setInputValue('');
    setShowDropdown(false);
  };

  const removeValue = (value: string) => {
    props.onChange(props.values.filter((r) => r !== value));
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
                aria-label={
                  props.removeLabel
                    ? `${props.removeLabel} ${value}`
                    : undefined
                }
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
          type="text"
          value={inputValue()}
          onInput={(e) => setInputValue(e.currentTarget.value)}
          onFocus={() => setShowDropdown(true)}
          onBlur={() => {
            setTimeout(() => setShowDropdown(false), 200);
          }}
          onKeyDown={handleKeyDown}
          placeholder={props.placeholder}
        />
        <Show when={showDropdown() && filteredOptions().length > 0}>
          <div class={styles.dropdown}>
            <For each={filteredOptions()}>
              {(option) => (
                <button
                  type="button"
                  class={styles.dropdownItem}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => addValue(option)}
                >
                  {option}
                </button>
              )}
            </For>
          </div>
        </Show>
      </div>
    </div>
  );
};

export default Autocomplete;
