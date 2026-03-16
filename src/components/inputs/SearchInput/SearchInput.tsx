import { IoClose, IoSearch } from 'solid-icons/io';
import { onCleanup, Show } from 'solid-js';

import type Props from '~/models/Props';

import IconButton from '../../buttons/IconButton/IconButton';
import AffixInput from '../AffixInput/AffixInput';
import type { InputSize } from '../Input/Input';
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

  const placeholderText = () => props.messages?.placeholder ?? props.placeholder ?? 'Search...';
  const clearButtonLabel = () => props.messages?.clearButtonLabel ?? props.clearLabel ?? 'Clear search';

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
    <AffixInput
      type="text"
      size={props.size}
      value={props.value}
      onInput={handleInput}
      onKeyDown={handleKeyDown}
      placeholder={placeholderText()}
      disabled={props.disabled}
      autofocus={props.autofocus}
      prefix={<IoSearch class={styles.icon} />}
      suffix={
        <Show when={props.value.length > 0}>
          <IconButton
            icon={<IoClose />}
            title={clearButtonLabel()}
            class={styles.clear}
            onClick={handleClear}
            size="sm"
            variant="subtle"
          />
        </Show>
      }
      class={props.class}
    />
  );
};

export default SearchInput;
