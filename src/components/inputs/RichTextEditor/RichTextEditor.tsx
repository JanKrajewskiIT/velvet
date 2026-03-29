import { createEffect, createSignal, type JSX, Show, splitProps } from 'solid-js';

import { useI18n } from '~/i18n/I18nProvider';
import type Props from '~/models/Props';
import type { ComponentSize, DivCoreNativeProps } from '~/models/Props';
import classNames from '~/utils/classNames';

import Button from '../../buttons/Button/Button';
import FieldBase from '../FieldBase/FieldBase';
import Input from '../Input/Input';
import styles from './RichTextEditor.module.css';

interface RichTextEditorOwnProps extends Omit<DivCoreNativeProps, 'onChange'> {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  ariaLabel?: string;
  disabled?: boolean;
  minHeight?: string;
  size?: ComponentSize;
  messages?: RichTextEditorMessages;
}

interface RichTextEditorMessages {
  editorLabel?: string;
  placeholder?: string;
  listButtonLabel?: string;
  linkButtonLabel?: string;
  unlinkButtonLabel?: string;
  clearButtonLabel?: string;
  linkPlaceholder?: string;
  applyButtonLabel?: string;
  cancelButtonLabel?: string;
}

const RichTextEditor = (props: Props<RichTextEditorOwnProps>) => {
  const { t } = useI18n();
  const [local, rest] = splitProps(props, [
    'value',
    'onChange',
    'placeholder',
    'ariaLabel',
    'disabled',
    'minHeight',
    'size',
    'messages',
    'class',
  ]);
  let editorRef: HTMLDivElement | undefined;
  let linkInputRef: HTMLInputElement | undefined;
  const [linkEditorOpen, setLinkEditorOpen] = createSignal(false);
  const [linkDraft, setLinkDraft] = createSignal('');
  const editorAriaLabel = () => local.ariaLabel ?? local.messages?.editorLabel ?? t('richText.editor');
  const placeholderText = () => local.placeholder ?? local.messages?.placeholder ?? t('richText.placeholder');
  const listButtonLabel = () => local.messages?.listButtonLabel ?? t('richText.list');
  const linkButtonLabel = () => local.messages?.linkButtonLabel ?? t('richText.link');
  const unlinkButtonLabel = () => local.messages?.unlinkButtonLabel ?? t('richText.unlink');
  const clearButtonLabel = () => local.messages?.clearButtonLabel ?? t('richText.clear');
  const linkPlaceholder = () => local.messages?.linkPlaceholder ?? t('richText.linkPlaceholder');
  const applyButtonLabel = () => local.messages?.applyButtonLabel ?? t('common.apply');
  const cancelButtonLabel = () => local.messages?.cancelButtonLabel ?? t('common.cancel');

  const syncEditorValue = () => {
    if (!editorRef) return;
    const current = editorRef.innerHTML;
    const next = local.value;
    if (current !== next) {
      editorRef.innerHTML = next;
    }
  };

  const emitValue = () => {
    if (!editorRef) return;
    local.onChange(editorRef.innerHTML);
  };

  const applyCommand = (command: string, commandValue?: string) => {
    if (local.disabled) return;
    editorRef?.focus();
    const execCommandCandidate = (document as unknown as { execCommand?: unknown }).execCommand;
    if (typeof execCommandCandidate !== 'function') return;
    (execCommandCandidate as (commandName: string, showUi: boolean, value?: string) => boolean)(
      command,
      false,
      commandValue
    );
    emitValue();
  };

  const normalizeLink = (raw: string): string | null => {
    const trimmed = raw.trim();
    if (!trimmed) return null;

    if (/^[a-zA-Z][a-zA-Z\d+.-]*:/u.test(trimmed)) {
      return trimmed;
    }

    return `https://${trimmed}`;
  };

  const openLinkEditor = () => {
    if (local.disabled) return;
    setLinkEditorOpen(true);
    setLinkDraft('');
    queueMicrotask(() => linkInputRef?.focus());
  };

  const closeLinkEditor = () => {
    setLinkEditorOpen(false);
    setLinkDraft('');
  };

  const applyLink = () => {
    const normalized = normalizeLink(linkDraft());
    if (!normalized) return;
    applyCommand('createLink', normalized);
    closeLinkEditor();
  };

  const removeLink = () => {
    applyCommand('unlink');
    closeLinkEditor();
  };

  const handleLinkInputKeyDown: JSX.EventHandler<HTMLInputElement, KeyboardEvent> = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      applyLink();
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      closeLinkEditor();
    }
  };

  const handleInput: JSX.EventHandler<HTMLDivElement, InputEvent> = () => {
    emitValue();
  };

  const handleLinkDraftInput: JSX.EventHandler<HTMLInputElement, InputEvent> = (event) => {
    setLinkDraft(event.currentTarget.value);
  };

  createEffect(() => {
    syncEditorValue();
  });

  return (
    <div {...rest} class={classNames(styles.wrapper, local.class)}>
      <FieldBase as="div" size={null} focusStyle="within" disabled={local.disabled} class={styles.editorShell}>
        <div class={styles.toolbar}>
          <Button
            class={styles.toolButton}
            variant="subtle"
            size="sm"
            onClick={() => applyCommand('bold')}
            disabled={local.disabled}
          >
            B
          </Button>
          <Button
            class={styles.toolButton}
            variant="subtle"
            size="sm"
            onClick={() => applyCommand('italic')}
            disabled={local.disabled}
          >
            I
          </Button>
          <Button
            class={styles.toolButton}
            variant="subtle"
            size="sm"
            onClick={() => applyCommand('underline')}
            disabled={local.disabled}
          >
            U
          </Button>
          <Button
            class={styles.toolButton}
            variant="subtle"
            size="sm"
            onClick={() => applyCommand('insertUnorderedList')}
            disabled={local.disabled}
          >
            {listButtonLabel()}
          </Button>
          <Button
            class={styles.toolButton}
            variant="subtle"
            size="sm"
            onClick={() => applyCommand('insertOrderedList')}
            disabled={local.disabled}
          >
            1.
          </Button>
          <Button
            class={styles.toolButton}
            variant={linkEditorOpen() ? 'outline' : 'subtle'}
            size="sm"
            onClick={openLinkEditor}
            disabled={local.disabled}
          >
            {linkButtonLabel()}
          </Button>
          <Button class={styles.toolButton} variant="subtle" size="sm" onClick={removeLink} disabled={local.disabled}>
            {unlinkButtonLabel()}
          </Button>
          <Button
            class={styles.toolButton}
            variant="subtle"
            size="sm"
            onClick={() => applyCommand('removeFormat')}
            disabled={local.disabled}
          >
            {clearButtonLabel()}
          </Button>
        </div>
        <Show when={linkEditorOpen()}>
          <div class={styles.linkEditor}>
            <Input
              ref={linkInputRef}
              type="url"
              size={local.size}
              value={linkDraft()}
              placeholder={linkPlaceholder()}
              disabled={local.disabled}
              class={styles.linkInput}
              onInput={handleLinkDraftInput}
              onKeyDown={handleLinkInputKeyDown}
            />
            <Button class={styles.linkAction} variant="primary" size="sm" onClick={applyLink} disabled={local.disabled}>
              {applyButtonLabel()}
            </Button>
            <Button
              class={styles.linkAction}
              variant="ghost"
              size="sm"
              onClick={closeLinkEditor}
              disabled={local.disabled}
            >
              {cancelButtonLabel()}
            </Button>
          </div>
        </Show>
        <div
          ref={editorRef}
          class={styles.editor}
          contentEditable={!local.disabled}
          data-placeholder={placeholderText()}
          style={local.minHeight ? { '--editor-min-height': local.minHeight } : undefined}
          onInput={handleInput}
          role="textbox"
          aria-multiline="true"
          aria-label={editorAriaLabel()}
        />
      </FieldBase>
    </div>
  );
};

export default RichTextEditor;
