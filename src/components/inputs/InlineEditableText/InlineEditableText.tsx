import { IoCheckmark, IoCloseOutline, IoPencil } from 'solid-icons/io';
import { batch, createEffect, createSignal, type JSX, on, onMount, Show, splitProps } from 'solid-js';

import { useI18n } from '~/i18n';
import type Props from '~/models/Props';
import type { ComponentSize } from '~/models/Props';
import classNames from '~/utils/classNames';

import IconButton from '../../buttons/IconButton/IconButton';
import Text from '../../typography/Text/Text';
import Input from '../Input/Input';
import styles from './InlineEditableText.module.css';

interface InlineEditableTextProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  size?: ComponentSize;
  startInEditMode?: boolean;
}

const InlineEditableText = (props: Props<InlineEditableTextProps>) => {
  const { ts } = useI18n();
  const [local, rest] = splitProps(props, [
    'value',
    'onChange',
    'placeholder',
    'disabled',
    'size',
    'startInEditMode',
    'class',
  ]);
  const [isEditing, setIsEditing] = createSignal(false);
  const [draft, setDraft] = createSignal('');

  onMount(() => {
    batch(() => {
      setIsEditing(Boolean(local.startInEditMode));
      setDraft(local.value);
    });
  });

  createEffect(
    on(
      () => local.value,
      (next) => {
        if (!isEditing()) {
          setDraft(next);
        }
      },
      { defer: true },
    ),
  );

  const beginEdit = () => {
    if (local.disabled) return;
    batch(() => {
      setDraft(local.value);
      setIsEditing(true);
    });
  };

  const cancelEdit = () => {
    batch(() => {
      setDraft(local.value);
      setIsEditing(false);
    });
  };

  const saveEdit = () => {
    const next = draft().trim();
    batch(() => {
      local.onChange(next);
      setIsEditing(false);
    });
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

  const handleDraftInput: JSX.EventHandler<HTMLInputElement, InputEvent> = (e) => {
    setDraft(e.currentTarget.value);
  };

  return (
    <div {...rest} class={classNames(styles.wrapper, local.class)}>
      <Show
        when={isEditing()}
        fallback={
          <div class={styles.readMode}>
            <Text as="span" variant="bodyMd">
              {local.value || local.placeholder || ts('inlineEditable.clickEdit')}
            </Text>
            <IconButton
              icon={IoPencil}
              label={ts('inlineEditable.editValue')}
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
            onInput={handleDraftInput}
            onKeyDown={handleKeyDown}
            placeholder={local.placeholder}
            aria-label={ts('inlineEditable.inputLabel')}
            autofocus
          />
          <IconButton icon={IoCheckmark} label={ts('common.save')} onClick={saveEdit} size="sm" variant="subtle" />
          <IconButton
            icon={IoCloseOutline}
            label={ts('common.cancel')}
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
