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
    'class',
  ]);
  let editorRef: HTMLDivElement | undefined;
  let linkInputRef: HTMLInputElement | undefined;
  const [linkEditorOpen, setLinkEditorOpen] = createSignal(false);
  const [linkDraft, setLinkDraft] = createSignal('');
  const editorAriaLabel = () => local.ariaLabel ?? t('richText.editor');

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
            {t('richText.list')}
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
            {t('richText.link')}
          </Button>
          <Button class={styles.toolButton} variant="subtle" size="sm" onClick={removeLink} disabled={local.disabled}>
            {t('richText.unlink')}
          </Button>
          <Button
            class={styles.toolButton}
            variant="subtle"
            size="sm"
            onClick={() => applyCommand('removeFormat')}
            disabled={local.disabled}
          >
            {t('common.clear')}
          </Button>
        </div>
        <Show when={linkEditorOpen()}>
          <div class={styles.linkEditor}>
            <Input
              ref={linkInputRef}
              type="url"
              size={local.size}
              value={linkDraft()}
              placeholder={t('richText.linkPlaceholder')}
              disabled={local.disabled}
              class={styles.linkInput}
              onInput={handleLinkDraftInput}
              onKeyDown={handleLinkInputKeyDown}
            />
            <Button class={styles.linkAction} variant="primary" size="sm" onClick={applyLink} disabled={local.disabled}>
              {t('common.apply')}
            </Button>
            <Button
              class={styles.linkAction}
              variant="ghost"
              size="sm"
              onClick={closeLinkEditor}
              disabled={local.disabled}
            >
              {t('common.cancel')}
            </Button>
          </div>
        </Show>
        <div
          ref={editorRef}
          class={styles.editor}
          contentEditable={!local.disabled}
          data-placeholder={local.placeholder ?? t('richText.placeholder')}
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
