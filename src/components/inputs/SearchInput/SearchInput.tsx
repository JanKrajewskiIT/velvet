import { IoClose, IoSearch } from 'solid-icons/io';
import { createSignal, onCleanup, Show } from 'solid-js';

import type Props from '~/models/Props';

import styles from './SearchInput.module.css';

interface SearchInputProps {
  value: string;
  onInput: (value: string) => void;
  onClear?: () => void;
  placeholder?: string;
  debounce?: number;
  disabled?: boolean;
  autofocus?: boolean;
}

const SearchInput = (props: Props<SearchInputProps>) => {
  const [focused, setFocused] = createSignal(false);
  let debounceTimer: ReturnType<typeof setTimeout> | undefined;

  const fireInput = (value: string) => {
    if (props.debounce && props.debounce > 0) {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => props.onInput(value), props.debounce);
    } else {
      props.onInput(value);
    }
  };

  const handleInput = (e: InputEvent) => {
    fireInput((e.currentTarget as HTMLInputElement).value);
  };

  const handleClear = () => {
    clearTimeout(debounceTimer);
    props.onInput('');
    props.onClear?.();
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleClear();
    }
  };

  onCleanup(() => clearTimeout(debounceTimer));

  return (
    <div
      class={`${styles.wrapper} ${focused() ? styles.focused : ''} ${props.disabled ? styles.disabled : ''} ${props.class ?? ''}`}
    >
      <IoSearch class={styles.icon} />
      <input
        class={styles.input}
        type="text"
        value={props.value}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={props.placeholder ?? 'Search\u2026'}
        disabled={props.disabled}
        autofocus={props.autofocus}
      />
      <Show when={props.value.length > 0}>
        <button type="button" class={styles.clear} onClick={handleClear}>
          <IoClose />
        </button>
      </Show>
    </div>
  );
};

export default SearchInput;
