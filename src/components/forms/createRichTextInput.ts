import { type JSX, onCleanup, onMount } from 'solid-js';

import type { RichTextCommands } from './createRichTextCommands';
import type { RichTextHistory } from './createRichTextHistory';
import type { RichTextState } from './createRichTextState';
import { insertContent, insertLineBreak, insertParagraph, repairLive } from './richTextBlocks';
import { applyMarkdownShortcut } from './richTextMarkdown';
import { insertPending } from './richTextMarks';
import { escapeHtml, sanitizeRichText } from './richTextModel';
import { rangeIn } from './richTextSelection';
import { matchesShortcut, TOOLBAR_ENTRIES } from './richTextTools';

const NAVIGATION_KEYS = new Set([
  'ArrowLeft',
  'ArrowRight',
  'ArrowUp',
  'ArrowDown',
  'Home',
  'End',
  'PageUp',
  'PageDown',
]);
const MARKDOWN_TRIGGER = /[ *_`~]$/u;

export interface RichTextInputOptions {
  editor: () => HTMLElement;
  state: RichTextState;
  history: RichTextHistory;
  commands: Pick<RichTextCommands, 'run' | 'exec'>;
}

/** Native input handling of the contenteditable: `beforeinput` interception, markdown shortcuts, key shortcuts, sanitized paste, link follow. */
export const createRichTextInput = (options: RichTextInputOptions) => {
  const { pending, afterChange, refreshFormat } = options.state;
  const { history } = options;
  const { run, exec } = options.commands;

  onMount(() => {
    const editor = options.editor();
    const onBeforeInput = (event: InputEvent) => {
      if (event.inputType === 'historyUndo' || event.inputType === 'historyRedo') {
        event.preventDefault();
        history.travel(event.inputType === 'historyUndo' ? -1 : 1);
      } else if (event.inputType.startsWith('format')) {
        event.preventDefault();
      } else if (event.inputType === 'insertParagraph') {
        event.preventDefault();
        run(insertParagraph);
      } else if (event.inputType === 'insertLineBreak') {
        event.preventDefault();
        run(insertLineBreak);
      } else if (event.inputType === 'insertText' && event.data && !event.isComposing && pending.size > 0) {
        event.preventDefault();
        insertPending(editor, event.data, pending);
        pending.clear();
        afterChange();
        history.recordSoon();
      }
    };
    let frame = 0;
    const onSelectionChange = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (rangeIn(editor)) refreshFormat();
      });
    };
    editor.addEventListener('beforeinput', onBeforeInput);
    document.addEventListener('selectionchange', onSelectionChange);
    onCleanup(() => {
      editor.removeEventListener('beforeinput', onBeforeInput);
      document.removeEventListener('selectionchange', onSelectionChange);
      cancelAnimationFrame(frame);
    });
  });

  const onInput: JSX.EventHandler<HTMLDivElement, InputEvent> = (event) => {
    const editor = options.editor();
    repairLive(editor);
    const typed = event.data ?? '';
    const shortcut =
      event.inputType === 'insertText' && !event.isComposing && MARKDOWN_TRIGGER.test(typed)
        ? applyMarkdownShortcut(editor, typed.slice(-1), history.record)
        : undefined;
    if (shortcut) {
      if (shortcut.kind === 'mark') {
        pending.clear();
        pending.set(shortcut.tag, false);
      }
      history.record();
    } else history.recordSoon();
    afterChange();
  };

  const onKeyDown: JSX.EventHandler<HTMLDivElement, KeyboardEvent> = (event) => {
    if (NAVIGATION_KEYS.has(event.key)) pending.clear();
    if (!(event.metaKey || event.ctrlKey)) return;
    const tool = TOOLBAR_ENTRIES.find((entry) => entry.kind === 'button' && matchesShortcut(event, entry.keys));
    const toolId = tool?.kind === 'button' ? tool.id : matchesShortcut(event, 'mod+y') ? 'redo' : undefined;
    if (!toolId) return;
    event.preventDefault();
    exec(toolId);
  };

  const onPaste: JSX.EventHandler<HTMLDivElement, ClipboardEvent> = (event) => {
    event.preventDefault();
    const clipboard = event.clipboardData;
    if (!clipboard) return;
    const html = clipboard.getData('text/html');
    const lines = clipboard.getData('text/plain').split(/\r?\n/u);
    const fromText = () =>
      lines
        .filter((line, index) => line.trim() || (index > 0 && index < lines.length - 1))
        .map((line) => `<p>${escapeHtml(line) || '<br>'}</p>`)
        .join('');
    run((root) => insertContent(root, sanitizeRichText(html || fromText())));
  };

  const onClick: JSX.EventHandler<HTMLDivElement, MouseEvent> = (event) => {
    if (!(event.metaKey || event.ctrlKey) || !(event.target instanceof Element)) return;
    const anchor = event.target.closest('a[href]');
    if (!(anchor instanceof HTMLAnchorElement)) return;
    event.preventDefault();
    window.open(anchor.href, '_blank', 'noopener');
  };

  const onMouseDown = () => pending.clear();

  return { onInput, onKeyDown, onPaste, onClick, onMouseDown };
};
