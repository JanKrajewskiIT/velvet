import {
  batch,
  createEffect,
  createMemo,
  createSignal,
  type JSX,
  on,
  onCleanup,
  Show,
  splitProps,
  untrack,
} from 'solid-js';

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
  disabled?: boolean;
  minHeight?: string;
  size?: ComponentSize;
}

const RichTextEditor = (props: Props<RichTextEditorOwnProps>) => {
  const { ts } = useI18n();
  const [local, rest] = splitProps(props, ['value', 'onChange', 'disabled', 'minHeight', 'size', 'class']);
  let editorRef: HTMLDivElement | undefined;
  let linkInputRef: HTMLInputElement | undefined;
  const [linkEditorOpen, setLinkEditorOpen] = createSignal(false);
  const [linkDraft, setLinkDraft] = createSignal('');

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
      commandValue,
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

  let linkFocusCancelled = false;
  const openLinkEditor = () => {
    if (local.disabled) return;
    batch(() => {
      setLinkEditorOpen(true);
      setLinkDraft('');
    });
    linkFocusCancelled = false;
    queueMicrotask(() => {
      if (linkFocusCancelled) return;
      linkInputRef?.focus();
    });
  };

  const closeLinkEditor = () => {
    linkFocusCancelled = true;
    batch(() => {
      setLinkEditorOpen(false);
      setLinkDraft('');
    });
  };

  onCleanup(() => {
    linkFocusCancelled = true;
  });

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

  const applyBold = () => applyCommand('bold');
  const applyItalic = () => applyCommand('italic');
  const applyUnderline = () => applyCommand('underline');
  const applyUnorderedList = () => applyCommand('insertUnorderedList');
  const applyOrderedList = () => applyCommand('insertOrderedList');
  const clearFormatting = () => applyCommand('removeFormat');

  const linkButtonVariant = createMemo(() => (linkEditorOpen() ? 'outline' : 'subtle'));
  const editorStyle = createMemo<JSX.CSSProperties | undefined>(() =>
    local.minHeight ? { '--editor-min-height': local.minHeight } : undefined,
  );

  createEffect(
    on(
      () => local.value,
      () => {
        untrack(() => syncEditorValue());
      },
      { defer: true },
    ),
  );

  return (
    <div {...rest} class={classNames(styles.wrapper, local.class)}>
      <FieldBase as="div" size={null} focusStyle="within" disabled={local.disabled} class={styles.editorShell}>
        <div class={styles.toolbar}>
          <Button class={styles.toolButton} variant="subtle" size="sm" onClick={applyBold} disabled={local.disabled}>
            B
          </Button>
          <Button class={styles.toolButton} variant="subtle" size="sm" onClick={applyItalic} disabled={local.disabled}>
            I
          </Button>
          <Button
            class={styles.toolButton}
            variant="subtle"
            size="sm"
            onClick={applyUnderline}
            disabled={local.disabled}
          >
            U
          </Button>
          <Button
            class={styles.toolButton}
            variant="subtle"
            size="sm"
            onClick={applyUnorderedList}
            disabled={local.disabled}
          >
            {ts('richText.list')}
          </Button>
          <Button
            class={styles.toolButton}
            variant="subtle"
            size="sm"
            onClick={applyOrderedList}
            disabled={local.disabled}
          >
            1.
          </Button>
          <Button
            class={styles.toolButton}
            variant={linkButtonVariant()}
            size="sm"
            onClick={openLinkEditor}
            disabled={local.disabled}
          >
            {ts('richText.link')}
          </Button>
          <Button class={styles.toolButton} variant="subtle" size="sm" onClick={removeLink} disabled={local.disabled}>
            {ts('richText.unlink')}
          </Button>
          <Button
            class={styles.toolButton}
            variant="subtle"
            size="sm"
            onClick={clearFormatting}
            disabled={local.disabled}
          >
            {ts('richText.clear')}
          </Button>
        </div>
        <Show when={linkEditorOpen()}>
          <div class={styles.linkEditor}>
            <Input
              ref={linkInputRef}
              type="url"
              size={local.size}
              value={linkDraft()}
              placeholder={ts('richText.linkPlaceholder')}
              disabled={local.disabled}
              class={styles.linkInput}
              onInput={handleLinkDraftInput}
              onKeyDown={handleLinkInputKeyDown}
            />
            <Button class={styles.linkAction} variant="primary" size="sm" onClick={applyLink} disabled={local.disabled}>
              {ts('common.apply')}
            </Button>
            <Button
              class={styles.linkAction}
              variant="ghost"
              size="sm"
              onClick={closeLinkEditor}
              disabled={local.disabled}
            >
              {ts('common.cancel')}
            </Button>
          </div>
        </Show>
        <div
          ref={editorRef}
          class={styles.editor}
          contentEditable={!local.disabled}
          data-placeholder={ts('richText.placeholder')}
          style={editorStyle()}
          onInput={handleInput}
          role="textbox"
          aria-multiline="true"
          aria-label={ts('richText.editor')}
        />
      </FieldBase>
    </div>
  );
};

export default RichTextEditor;
