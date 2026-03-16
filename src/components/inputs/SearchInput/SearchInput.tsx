import { IoClose, IoSearch } from 'solid-icons/io';
import { onCleanup, Show } from 'solid-js';

import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import IconButton from '../../buttons/IconButton/IconButton';
import type { InputSize } from '../Input/Input';
import InputBase from '../shared/InputBase';
import styles from './SearchInput.module.css';

interface SearchInputMessages {
  placeholder?: string;
  clearButtonLabel?: string;
}

interface SearchInputProps {
  value: string;
  onInput: (value: string) => void;
  onClear?: () => void;
  placeholder?: string;
  debounce?: number;
  disabled?: boolean;
  autofocus?: boolean;
  clearLabel?: string;
  size?: InputSize;
  messages?: SearchInputMessages;
}

const SearchInput = (props: Props<SearchInputProps>) => {
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
    <InputBase
      class={classNames(styles.wrapper, props.disabled && styles.disabled, props.class)}
      size={props.size}
      disabled={props.disabled}
      focusWithin
    >
      <IoSearch class={styles.icon} />
      <input
        class={styles.input}
        type="text"
        value={props.value}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        placeholder={props.messages?.placeholder ?? props.placeholder ?? 'Search\u2026'}
        disabled={props.disabled}
        autofocus={props.autofocus}
      />
      <Show when={props.value.length > 0}>
        <IconButton
          icon={<IoClose />}
          title={props.messages?.clearButtonLabel ?? props.clearLabel ?? 'Clear search'}
          class={styles.clear}
          onClick={handleClear}
          size="sm"
        />
      </Show>
    </InputBase>
  );
};

export default SearchInput;
