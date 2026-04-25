import { IoClose, IoSearch } from 'solid-icons/io';
import { type JSX, onCleanup, Show, splitProps } from 'solid-js';

import Icon from '~/components/media/Icon/Icon';
import { useI18n } from '~/i18n/I18nProvider';
import type Props from '~/models/Props';
import type { ComponentSize, InputCoreNativeProps } from '~/models/Props';
import classNames from '~/utils/classNames';

import IconButton from '../../buttons/IconButton/IconButton';
import AffixInput from '../AffixInput/AffixInput';
import styles from './SearchInput.module.css';

interface SearchInputProps extends Omit<InputCoreNativeProps, 'value' | 'onInput'> {
  value: string;
  onInput: (value: string) => void;
  onClear?: () => void;
  debounce?: number;
  size?: ComponentSize;
}

const SearchInput = (props: Props<SearchInputProps>) => {
  const { ts } = useI18n();
  const [local, rest] = splitProps(props, [
    'value',
    'onInput',
    'onClear',
    'debounce',
    'disabled',
    'autofocus',
    'size',
    'onKeyDown',
    'class',
  ]);
  let debounceTimer: ReturnType<typeof setTimeout> | undefined;

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
      aria-label={ts('common.search')}
      placeholder={ts('common.searchEllipsis')}
      disabled={local.disabled}
      autofocus={local.autofocus}
      prefix={<Icon icon={IoSearch} class={styles.icon} />}
      suffix={
        <Show when={local.value.length > 0}>
          <IconButton icon={IoClose} label={ts('search.clear')} onClick={handleClear} size="sm" variant="subtle" />
        </Show>
      }
      class={classNames(styles.wrapper, local.class)}
    />
  );
};

export default SearchInput;
