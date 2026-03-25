import { IoClose, IoSearch } from 'solid-icons/io';
import { type JSX, onCleanup, Show, splitProps } from 'solid-js';

import { useI18n } from '~/i18n/I18nProvider';
import type Props from '~/models/Props';
import type { InputCoreNativeProps } from '~/models/Props';

import IconButton from '../../buttons/IconButton/IconButton';
import AffixInput from '../AffixInput/AffixInput';
import type { InputSize } from '../Input/Input';
import styles from './SearchInput.module.css';

interface SearchInputMessages {
  searchPlaceholder?: string;
  placeholder?: string;
  clearButtonLabel?: string;
}

interface SearchInputProps extends Omit<InputCoreNativeProps, 'value' | 'onInput'> {
  value: string;
  onInput: (value: string) => void;
  onClear?: () => void;
  debounce?: number;
  clearLabel?: string;
  size?: InputSize;
  inputAriaLabel?: string;
  messages?: SearchInputMessages;
}

const SearchInput = (props: Props<SearchInputProps>) => {
  const { t } = useI18n();
  const [local, rest] = splitProps(props, [
    'value',
    'onInput',
    'onClear',
    'placeholder',
    'debounce',
    'disabled',
    'autofocus',
    'clearLabel',
    'size',
    'inputAriaLabel',
    'messages',
    'onKeyDown',
    'class',
  ]);
  let debounceTimer: ReturnType<typeof setTimeout> | undefined;

  const placeholderText = () =>
    local.messages?.searchPlaceholder ?? local.messages?.placeholder ?? local.placeholder ?? t('common.searchEllipsis');
  const clearButtonLabel = () => local.messages?.clearButtonLabel ?? local.clearLabel ?? t('search.clear');

  const fireInput = (value: string) => {
    if (local.debounce && local.debounce > 0) {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => local.onInput(value), local.debounce);
    } else {
      local.onInput(value);
    }
  };

  const handleInput: JSX.EventHandler<HTMLInputElement, InputEvent> = (e) => {
    fireInput(e.currentTarget.value);
  };

  const handleClear = () => {
    clearTimeout(debounceTimer);
    local.onInput('');
    local.onClear?.();
  };

  const handleKeyDown: JSX.EventHandler<HTMLInputElement, KeyboardEvent> = (e) => {
    if (typeof local.onKeyDown === 'function') {
      local.onKeyDown(e);
    }
    if (e.defaultPrevented) return;

    if (e.key === 'Escape') {
      handleClear();
    }
  };

  onCleanup(() => clearTimeout(debounceTimer));

  return (
    <AffixInput
      {...rest}
      type="text"
      size={local.size}
      value={local.value}
      onInput={handleInput}
      onKeyDown={handleKeyDown}
      aria-label={local.inputAriaLabel}
      placeholder={placeholderText()}
      disabled={local.disabled}
      autofocus={local.autofocus}
      prefix={<IoSearch class={styles.icon} />}
      suffix={
        <Show when={local.value.length > 0}>
          <IconButton icon={<IoClose />} label={clearButtonLabel()} onClick={handleClear} size="sm" variant="subtle" />
        </Show>
      }
      class={local.class}
    />
  );
};

export default SearchInput;
