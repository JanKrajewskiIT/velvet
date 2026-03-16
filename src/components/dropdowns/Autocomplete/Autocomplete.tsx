import { createMemo, createSignal, For, Show } from 'solid-js';

import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import EditableChip from '../../feedback/EditableChip/EditableChip';
import Input, { type InputSize } from '../../inputs/Input/Input';
import DropdownOption from '../DropdownBase/DropdownOption';
import DropdownSurface from '../DropdownBase/DropdownSurface';
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
      return;
    }

    if (e.key === 'Escape') {
      setShowDropdown(false);
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
          onFocus={() => setShowDropdown(true)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder={props.placeholder}
        />

        <Show when={showDropdown() && filteredOptions().length > 0}>
          <DropdownSurface class={styles.dropdown} role="listbox">
            <For each={filteredOptions()}>
              {(option) => (
                <DropdownOption onMouseDown={(e) => e.preventDefault()} onClick={() => addValue(option)}>
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
