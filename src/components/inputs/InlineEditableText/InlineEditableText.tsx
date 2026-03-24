import { IoCheckmark, IoCloseOutline, IoPencil } from 'solid-icons/io';
import { createEffect, createSignal, type JSX, onMount, Show, splitProps } from 'solid-js';

import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import IconButton from '../../buttons/IconButton/IconButton';
import Text from '../../typography/Text/Text';
import Input, { type InputSize } from '../Input/Input';
import styles from './InlineEditableText.module.css';

interface InlineEditableTextMessages {
  emptyValue?: string;
  saveButtonLabel?: string;
  cancelButtonLabel?: string;
  editButtonLabel?: string;
}

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
  messages?: InlineEditableTextMessages;
  inputAriaLabel?: string;
}

const InlineEditableText = (props: Props<InlineEditableTextProps>) => {
  const [local, rest] = splitProps(props, [
    'value',
    'onChange',
    'placeholder',
    'disabled',
    'size',
    'startInEditMode',
    'saveLabel',
    'cancelLabel',
    'editLabel',
    'messages',
    'inputAriaLabel',
    'class',
  ]);
  const [isEditing, setIsEditing] = createSignal(false);
  const [draft, setDraft] = createSignal('');

  onMount(() => {
    setIsEditing(Boolean(local.startInEditMode));
    setDraft(local.value);
  });

  const emptyValueLabel = () => local.messages?.emptyValue ?? local.placeholder ?? 'Click edit';
  const saveButtonLabel = () => local.messages?.saveButtonLabel ?? local.saveLabel ?? 'Save';
  const cancelButtonLabel = () => local.messages?.cancelButtonLabel ?? local.cancelLabel ?? 'Cancel';
  const editButtonLabel = () => local.messages?.editButtonLabel ?? local.editLabel ?? 'Edit value';

  createEffect(() => {
    if (!isEditing()) {
      setDraft(local.value);
    }
  });

  const beginEdit = () => {
    if (local.disabled) return;
    setDraft(local.value);
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setDraft(local.value);
    setIsEditing(false);
  };

  const saveEdit = () => {
    const next = draft().trim();
    local.onChange(next);
    setIsEditing(false);
  };

  const handleKeyDown: JSX.EventHandler<HTMLInputElement, KeyboardEvent> = (e) => {
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
    <div {...rest} class={classNames(styles.wrapper, local.class)}>
      <Show
        when={isEditing()}
        fallback={
          <div class={styles.readMode}>
            <Text as="span" variant="bodyMd">
              {local.value || emptyValueLabel()}
            </Text>
            <IconButton
              icon={<IoPencil />}
              title={editButtonLabel()}
              onClick={beginEdit}
              disabled={local.disabled}
              size="sm"
              variant="subtle"
            />
          </div>
        }
      >
        <div class={styles.editMode}>
          <Input
            type="text"
            size={local.size}
            value={draft()}
            onInput={(e) => setDraft(e.currentTarget.value)}
            onKeyDown={handleKeyDown}
            placeholder={local.placeholder}
            aria-label={local.inputAriaLabel ?? 'Editable text input'}
            autofocus
          />
          <IconButton icon={<IoCheckmark />} title={saveButtonLabel()} onClick={saveEdit} size="sm" variant="subtle" />
          <IconButton
            icon={<IoCloseOutline />}
            title={cancelButtonLabel()}
            onClick={cancelEdit}
            size="sm"
            variant="subtle"
          />
        </div>
      </Show>
    </div>
  );
};

export default InlineEditableText;
