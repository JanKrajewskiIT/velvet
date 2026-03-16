import { createSignal, For, type JSX, splitProps } from 'solid-js';

import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import EditableChip from '../../feedback/EditableChip/EditableChip';
import AffixInput from '../AffixInput/AffixInput';
import type { InputSize } from '../Input/Input';
import styles from './TagInput.module.css';

interface TagInputOwnProps extends Omit<JSX.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  size?: InputSize;
}

const TagInput = (props: Props<TagInputOwnProps>) => {
  const [local, rest] = splitProps(props, ['value', 'onChange', 'placeholder', 'size', 'class']);
  const [inputValue, setInputValue] = createSignal('');

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = inputValue().trim();
      if (newTag && !local.value.includes(newTag)) {
        local.onChange([...local.value, newTag]);
      }
      setInputValue('');
    } else if (e.key === 'Backspace' && inputValue() === '') {
      local.onChange(local.value.slice(0, -1));
    }
  };

  const removeTag = (tagToRemove: string) => {
    local.onChange(local.value.filter((tag) => tag !== tagToRemove));
  };

  return (
    <AffixInput
      {...rest}
      type="text"
      size={local.size}
      class={classNames(styles.container, local.class)}
      inputClass={styles.input}
      value={inputValue()}
      onInput={(e) => setInputValue(e.currentTarget.value)}
      onKeyDown={handleKeyDown}
      placeholder={local.value.length === 0 ? local.placeholder : ''}
      prefix={
        local.value.length > 0 ? (
          <div class={styles.tagsContainer}>
            <For each={local.value}>
              {(tag) => <EditableChip label={tag} removeLabel={`Remove ${tag}`} onRemove={() => removeTag(tag)} />}
            </For>
          </div>
        ) : undefined
      }
    />
  );
};

export default TagInput;
