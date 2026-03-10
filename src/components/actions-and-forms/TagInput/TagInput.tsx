import { createSignal, For, type JSX, splitProps } from 'solid-js';

import type Props from '~/models/Props';

import TagChip from '../../feedback-and-states/TagChip/TagChip';
import styles from './TagInput.module.css';

interface TagInputOwnProps extends Omit<
  JSX.InputHTMLAttributes<HTMLInputElement>,
  'value' | 'onChange'
> {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}

const TagInput = (props: Props<TagInputOwnProps>) => {
  const [local, rest] = splitProps(props, [
    'value',
    'onChange',
    'placeholder',
    'class',
  ]);
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
    <div class={`${styles.container} ${local.class ?? ''}`}>
      <div class={styles.tagsContainer}>
        <For each={local.value}>
          {(tag) => (
            <TagChip
              label={tag}
              color="var(--color-primary)"
              onClick={() => removeTag(tag)}
            />
          )}
        </For>
        <input
          {...rest}
          class={styles.input}
          value={inputValue()}
          onInput={(e) => setInputValue(e.currentTarget.value)}
          onKeyDown={handleKeyDown}
          placeholder={local.value.length === 0 ? local.placeholder : ''}
        />
      </div>
    </div>
  );
};

export default TagInput;
