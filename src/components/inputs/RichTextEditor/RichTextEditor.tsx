import { createEffect, createSignal, createUniqueId, type JSX, Show, splitProps } from 'solid-js';

import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import Button from '../../buttons/Button/Button';
import Text from '../../typography/Text/Text';
import type { InputSize } from '../Input/Input';
import Input from '../Input/Input';
import styles from './RichTextEditor.module.css';

interface RichTextEditorOwnProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  minHeight?: string;
  size?: InputSize;
}

const RichTextEditor = (props: Props<RichTextEditorOwnProps>) => {
  const [local, rest] = splitProps(props, [
    'value',
    'onChange',
    'placeholder',
    'label',
    'disabled',
    'minHeight',
    'size',
    'class',
  ]);
  let editorRef: HTMLDivElement | undefined;
  let linkInputRef: HTMLInputElement | undefined;
  const labelId = createUniqueId();
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

  createEffect(() => {
    syncEditorValue();
  });

  return (
    <div {...rest} class={classNames(styles.wrapper, local.class)}>
      {local.label && (
        <Text as="span" variant="labelMd" id={labelId} class={styles.label}>
          {local.label}
        </Text>
      )}
      <div class={classNames(styles.editorShell, local.disabled && styles.disabled)}>
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
            List
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
            Link
          </Button>
          <Button class={styles.toolButton} variant="subtle" size="sm" onClick={removeLink} disabled={local.disabled}>
            Unlink
          </Button>
          <Button
            class={styles.toolButton}
            variant="subtle"
            size="sm"
            onClick={() => applyCommand('removeFormat')}
            disabled={local.disabled}
          >
            Clear
          </Button>
        </div>
        <Show when={linkEditorOpen()}>
          <div class={styles.linkEditor}>
            <Input
              ref={linkInputRef}
              type="url"
              size={local.size}
              value={linkDraft()}
              placeholder="https://example.com"
              disabled={local.disabled}
              class={styles.linkInput}
              onInput={(event) => setLinkDraft(event.currentTarget.value)}
              onKeyDown={handleLinkInputKeyDown}
            />
            <Button class={styles.linkAction} variant="primary" size="sm" onClick={applyLink} disabled={local.disabled}>
              Apply
            </Button>
            <Button
              class={styles.linkAction}
              variant="ghost"
              size="sm"
              onClick={closeLinkEditor}
              disabled={local.disabled}
            >
              Cancel
            </Button>
          </div>
        </Show>
        <div
          ref={editorRef}
          class={styles.editor}
          contentEditable={!local.disabled}
          data-placeholder={local.placeholder ?? 'Write rich text content...'}
          style={local.minHeight ? { '--editor-min-height': local.minHeight } : undefined}
          onInput={handleInput}
          role="textbox"
          aria-multiline="true"
          aria-labelledby={local.label ? labelId : undefined}
          aria-label={local.label ? undefined : 'Rich text editor'}
        />
      </div>
    </div>
  );
};

export default RichTextEditor;
