import { batch, createEffect, createSignal, For, type JSX, on, splitProps } from 'solid-js';

import { useI18n } from '~/i18n/I18nProvider';
import type Props from '~/models/Props';
import type { ComponentSize, InputCoreNativeProps } from '~/models/Props';
import classNames from '~/utils/classNames';

import ClosableChip from '../../feedback/ClosableChip/ClosableChip';
import FieldBase from '../FieldBase/FieldBase';
import Input from '../Input/Input';
import fieldInputResetStyles from '../shared/fieldInputReset.module.css';
import styles from './TagInput.module.css';

interface TagInputOwnProps extends Omit<InputCoreNativeProps, 'value' | 'onChange'> {
  value: string[];
  onChange: (tags: string[]) => void;
  size?: ComponentSize;
}

const TagInput = (props: Props<TagInputOwnProps>) => {
  const { ts } = useI18n();
  const [local, rest] = splitProps(props, ['value', 'onChange', 'size', 'class', 'disabled', 'readOnly', 'onKeyDown']);
  const [inputValue, setInputValue] = createSignal('');

  createEffect(
    on(
      () => local.value,
      (next) => {
        if (next.length === 0 && inputValue() !== '') {
          setInputValue('');
        }
      },
      { defer: true },
    ),
  );

  const handleKeyDown: JSX.EventHandler<HTMLInputElement, KeyboardEvent> = (e) => {
    if (typeof local.onKeyDown === 'function') {
      local.onKeyDown(e);
    }
    if (e.defaultPrevented) return;

    if (local.readOnly || local.disabled) return;

    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = inputValue().trim();
      batch(() => {
        if (newTag && !local.value.includes(newTag)) {
          local.onChange([...local.value, newTag]);
        }
        setInputValue('');
      });
    } else if (e.key === 'Backspace' && inputValue() === '') {
      local.onChange(local.value.slice(0, -1));
    }
  };

  const handleInput: JSX.EventHandler<HTMLInputElement, InputEvent> = (e) => {
    setInputValue(e.currentTarget.value);
  };

  const removeTag = (tagToRemove: string) => {
    if (local.readOnly || local.disabled) return;
    local.onChange(local.value.filter((tag) => tag !== tagToRemove));
  };

  return (
    <FieldBase
      as="div"
      size={local.size}
      readOnly={local.readOnly}
      disabled={local.disabled}
      focusStyle="within"
      class={classNames(styles.root, local.class)}
    >
      <div class={styles.tagsContainer}>
        <For each={local.value}>
          {(tag) => (
            <ClosableChip label={tag} onRemove={() => removeTag(tag)} disabled={local.disabled || local.readOnly} />
          )}
        </For>
        <Input
          {...rest}
          type="text"
          class={classNames(fieldInputResetStyles.reset, styles.input)}
          size={null}
          value={inputValue()}
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          aria-label={ts('common.search')}
          placeholder={local.value.length === 0 ? ts('common.searchEllipsis') : ''}
          disabled={local.disabled}
          readOnly={local.readOnly}
        />
      </div>
    </FieldBase>
  );
};

export default TagInput;
