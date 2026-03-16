import { IoCheckmark, IoCloseOutline, IoPencil } from 'solid-icons/io';
import { createEffect, createSignal, onMount, Show } from 'solid-js';

import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import IconButton from '../../buttons/IconButton/IconButton';
import Input, { type InputSize } from '../Input/Input';
import styles from './InlineEditableText.module.css';

interface InlineEditableTextProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  size?: InputSize;
  startInEditMode?: boolean;
  saveLabel?: string;
  cancelLabel?: string;
  editLabel?: string;
}

const InlineEditableText = (props: Props<InlineEditableTextProps>) => {
  const [isEditing, setIsEditing] = createSignal(false);
  const [draft, setDraft] = createSignal('');

  onMount(() => {
    setIsEditing(Boolean(props.startInEditMode));
    setDraft(props.value);
  });

  createEffect(() => {
    if (!isEditing()) {
      setDraft(props.value);
    }
  });

  const beginEdit = () => {
    if (props.disabled) return;
    setDraft(props.value);
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setDraft(props.value);
    setIsEditing(false);
  };

  const saveEdit = () => {
    const next = draft().trim();
    props.onChange(next);
    setIsEditing(false);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      saveEdit();
    }

    if (e.key === 'Escape') {
      e.preventDefault();
      cancelEdit();
    }
  };

  return (
    <div class={classNames(styles.wrapper, props.class)}>
      <Show
        when={isEditing()}
        fallback={
          <div class={styles.readMode}>
            <span class={classNames(styles.value, !props.value && styles.placeholder)}>
              {props.value || props.placeholder || 'Click edit'}
            </span>
            <IconButton
              icon={<IoPencil />}
              title={props.editLabel ?? 'Edit value'}
              class={styles.iconButton}
              onClick={beginEdit}
              disabled={props.disabled}
            />
          </div>
        }
      >
        <div class={styles.editMode}>
          <Input
            type="text"
            class={styles.input}
            size={props.size}
            value={draft()}
            onInput={(e) => setDraft(e.currentTarget.value)}
            onKeyDown={handleKeyDown}
            placeholder={props.placeholder}
            autofocus
          />
          <IconButton
            icon={<IoCheckmark />}
            title={props.saveLabel ?? 'Save'}
            class={styles.iconButton}
            onClick={saveEdit}
          />
          <IconButton
            icon={<IoCloseOutline />}
            title={props.cancelLabel ?? 'Cancel'}
            class={styles.iconButton}
            onClick={cancelEdit}
          />
        </div>
      </Show>
    </div>
  );
};

export default InlineEditableText;
