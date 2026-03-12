import { createEffect, type JSX, splitProps } from 'solid-js';

import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import type { InputSize } from '../Input/Input';
import InputBase from '../shared/InputBase';
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

  const insertLink = () => {
    if (local.disabled) return;
    const url = window.prompt('Enter URL');
    if (!url) return;
    applyCommand('createLink', url);
  };

  const handleInput: JSX.EventHandler<HTMLDivElement, InputEvent> = () => {
    emitValue();
  };

  createEffect(() => {
    syncEditorValue();
  });

  return (
    <div {...rest} class={classNames(styles.wrapper, local.class)}>
      {local.label && <span class={styles.label}>{local.label}</span>}
      <InputBase
        class={classNames(styles.editorShell, local.disabled && styles.disabled)}
        size={local.size}
        disabled={local.disabled}
        focusWithin
      >
        <div class={styles.toolbar}>
          <button
            type="button"
            class={styles.toolButton}
            onClick={() => applyCommand('bold')}
            disabled={local.disabled}
          >
            B
          </button>
          <button
            type="button"
            class={styles.toolButton}
            onClick={() => applyCommand('italic')}
            disabled={local.disabled}
          >
            I
          </button>
          <button
            type="button"
            class={styles.toolButton}
            onClick={() => applyCommand('underline')}
            disabled={local.disabled}
          >
            U
          </button>
          <button
            type="button"
            class={styles.toolButton}
            onClick={() => applyCommand('insertUnorderedList')}
            disabled={local.disabled}
          >
            List
          </button>
          <button
            type="button"
            class={styles.toolButton}
            onClick={() => applyCommand('insertOrderedList')}
            disabled={local.disabled}
          >
            1.
          </button>
          <button type="button" class={styles.toolButton} onClick={insertLink} disabled={local.disabled}>
            Link
          </button>
          <button
            type="button"
            class={styles.toolButton}
            onClick={() => applyCommand('removeFormat')}
            disabled={local.disabled}
          >
            Clear
          </button>
        </div>
        <div
          ref={editorRef}
          class={styles.editor}
          contentEditable={!local.disabled}
          data-placeholder={local.placeholder ?? 'Write rich text content...'}
          style={{ 'min-height': local.minHeight ?? '180px' }}
          onInput={handleInput}
          role="textbox"
          aria-multiline="true"
        />
      </InputBase>
    </div>
  );
};

export default RichTextEditor;
