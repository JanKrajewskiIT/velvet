import { createMemo, createSignal, createUniqueId, type JSX, mergeProps, onCleanup, onMount, Show } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { FieldLabel } from '../primitives/Field';
import { createRichTextHistory } from './createRichTextHistory';
import { createRichTextLink } from './createRichTextLink';
import {
  insertContent,
  insertLineBreak,
  insertParagraph,
  readHtml,
  repairLive,
  setBlock,
  setList,
} from './richTextBlocks';
import { resolveLinkLabels, type RichTextLinkLabels, RichTextLinkPopover } from './RichTextLinkPopover';
import { applyMarkdownShortcut } from './richTextMarkdown';
import { applyMark, insertPending } from './richTextMarks';
import { escapeHtml, MARK_NAMES, MARK_TAGS, type MarkName, sanitizeRichText } from './richTextModel';
import { blockOf, caretTo, closestTag, endOf, rangeIn, restoreSel, saveSel, textNodesIn } from './richTextSelection';
import { EMPTY_FORMAT, type RichTextFormat, RichTextToolbar } from './RichTextToolbar';
import { matchesShortcut, TOOL_LABEL_KEYS, TOOLBAR_ENTRIES, toolbarEntries, type ToolId } from './richTextTools';

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

export interface RichTextLabels extends RichTextLinkLabels {
  /** Accessible name of the formatting toolbar. */
  toolbar: string;
}

export interface RichTextEditorProps {
  label?: JSX.Element;
  hint?: JSX.Element;
  error?: JSX.Element;
  /** Initial HTML (sanitized). The editor is uncontrolled. */
  defaultValue?: string;
  /** Fires on content change with sanitized HTML (`''` when empty) and the plain text. */
  onValueChange?: (html: string, text: string) => void;
  /** Alias of `onValueChange`. */
  onChange?: (html: string, text: string) => void;
  /** @default localized "Write something…" */
  placeholder?: string;
  /** px. @default 140 */
  minHeight?: number;
  /** px — scrolls beyond. */
  maxHeight?: number;
  /** Soft limit on plain-text length; the counter turns red past it. */
  maxLength?: number;
  /** `full` · `minimal` (bold, italic, lists, link) · `false` (shortcuts and markdown only). @default 'full' */
  toolbar?: 'full' | 'minimal' | false;
  /** Overrides for the toolbar button names. */
  toolLabels?: Partial<Record<ToolId, string>>;
  /** Overrides for the toolbar and link-popover texts. */
  labels?: Partial<RichTextLabels>;
  disabled?: boolean;
  /** Renders the content without toolbar or editing. */
  readOnly?: boolean;
  class?: string;
}

/** Dependency-free WYSIWYG for comments, descriptions and notes, built on `contenteditable` with its own editing engine and undo stack. Output is allow-listed HTML: p h2 h3 blockquote pre ul ol li strong em u s code a[href] br. */
export const RichTextEditor = (props: RichTextEditorProps) => {
  const p = mergeProps(
    { defaultValue: '', minHeight: 140, toolbar: 'full' } satisfies Partial<RichTextEditorProps>,
    props,
  );
  const translate = useTranslate();
  const id = createUniqueId();
  const placeholder = () => p.placeholder ?? translate('velvet.forms.richTextEditor.placeholder');
  const toolLabel = (tool: ToolId) => p.toolLabels?.[tool] ?? translate(TOOL_LABEL_KEYS[tool]);
  const labels = createMemo<RichTextLabels>(() => ({
    toolbar: p.labels?.toolbar ?? translate('velvet.forms.richTextEditor.toolbar'),
    ...resolveLinkLabels(p.labels, translate),
  }));
  const editable = () => !p.disabled && !p.readOnly;
  const emitChange = (html: string, text: string) => (p.onValueChange ?? p.onChange)?.(html, text);
  const pending = new Map<string, boolean>();
  const [format, setFormat] = createSignal<RichTextFormat>(EMPTY_FORMAT);
  const [textLength, setTextLength] = createSignal(0);
  const [empty, setEmpty] = createSignal(true);
  let editor!: HTMLDivElement;
  let lastOutput: string | undefined;

  const refreshFormat = () => {
    const range = rangeIn(editor);
    if (!range) return;
    const texts = range.collapsed ? [] : textNodesIn(range, editor);
    const inside = (tag: string) =>
      range.collapsed
        ? !!closestTag(range.startContainer, tag, editor)
        : texts.length > 0 && texts.every((text) => closestTag(text, tag, editor));
    const block = blockOf(range.startContainer, editor);
    setFormat({
      marks: new Set(MARK_NAMES.filter((name) => pending.get(MARK_TAGS[name]) ?? inside(MARK_TAGS[name]))),
      block: block?.tagName ?? 'P',
      list: block?.tagName === 'LI' ? (block.parentElement?.tagName ?? null) : null,
      link: !!closestTag(range.startContainer, 'A', editor) || texts.some((text) => closestTag(text, 'A', editor)),
    });
  };

  const afterChange = () => {
    const text = editor.innerText.replace(/\n+$/u, '');
    const isEmpty =
      !editor.textContent && editor.children.length <= 1 && !editor.querySelector('li,h2,h3,blockquote,pre');
    setEmpty(isEmpty);
    setTextLength(text.trim() ? Array.from(text).length : 0);
    refreshFormat();
    const output = isEmpty ? '' : readHtml(editor);
    if (lastOutput !== undefined && output !== lastOutput) emitChange(output, text);
    lastOutput = output;
  };

  const history = createRichTextHistory({
    root: () => editor,
    onRestore: () => {
      pending.clear();
      afterChange();
    },
  });

  const run = (command: (root: HTMLElement) => void) => {
    if (!editable()) return;
    const saved = saveSel(editor);
    if (document.activeElement !== editor) editor.focus();
    if (saved) restoreSel(editor, saved);
    else if (!rangeIn(editor)) caretTo(...endOf(editor.lastElementChild ?? editor));
    history.flush();
    command(editor);
    history.record();
    afterChange();
  };

  const toggleMark = (name: MarkName) =>
    run((root) => {
      const tag = MARK_TAGS[name];
      const range = rangeIn(root);
      if (!range) return;
      if (!range.collapsed) {
        applyMark(root, tag);
        return;
      }
      const base = !!closestTag(range.startContainer, tag, root);
      const active = pending.get(tag) ?? base;
      if (!active === base) pending.delete(tag);
      else pending.set(tag, !active);
    });

  const link = createRichTextLink({
    editor: () => editor,
    run,
    pending,
    editable,
    invalidText: () => labels().invalid,
  });

  const exec = (tool: ToolId) => {
    switch (tool) {
      case 'bold':
      case 'italic':
      case 'underline':
      case 'strike':
      case 'code':
        return toggleMark(tool);
      case 'link':
        return link.open();
      case 'undo':
        return history.travel(-1);
      case 'redo':
        return history.travel(1);
      case 'UL':
      case 'OL':
        return run((root) => setList(root, tool));
      case 'H2':
      case 'H3':
      case 'BLOCKQUOTE':
      case 'PRE':
        return run((root) => setBlock(root, tool));
    }
  };

  onMount(() => {
    editor.innerHTML = sanitizeRichText(p.defaultValue);
    history.record();
    afterChange();
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

  return (
    <div class={cx('vui-field', p.class)}>
      <Show when={p.label}>
        <FieldLabel id={`${id}-label`}>{p.label}</FieldLabel>
      </Show>
      <div class={cx('vui-rte', p.disabled && 'vui-rte--disabled', !!p.error && 'vui-rte--invalid')}>
        <Show when={p.toolbar && !p.readOnly ? p.toolbar : undefined}>
          {(toolbar) => (
            <RichTextToolbar
              entries={toolbarEntries(toolbar())}
              format={format()}
              canUndo={history.canUndo()}
              canRedo={history.canRedo()}
              disabled={p.disabled}
              label={labels().toolbar}
              controls={`${id}-editor`}
              toolLabel={toolLabel}
              onTool={exec}
            />
          )}
        </Show>
        <Show when={link.draft()}>
          {(draft) => (
            <RichTextLinkPopover
              href={draft().href}
              error={draft().error}
              existing={draft().existing}
              labels={labels()}
              onHrefChange={link.setHref}
              onApply={() => link.commit(false)}
              onRemove={() => link.commit(true)}
              onClose={link.close}
            />
          )}
        </Show>
        {/* eslint-disable-next-line jsx-a11y/interactive-supports-focus -- contenteditable receives focus natively; tabIndex would make the disabled and read-only states tabbable */}
        <div
          ref={editor}
          id={`${id}-editor`}
          class="vui-rte__area"
          contentEditable={editable()}
          spellcheck
          role="textbox"
          aria-multiline="true"
          aria-labelledby={p.label ? `${id}-label` : undefined}
          aria-label={p.label ? undefined : placeholder()}
          aria-describedby={p.hint || p.error ? `${id}-hint` : undefined}
          aria-placeholder={placeholder()}
          aria-invalid={!!p.error || undefined}
          aria-disabled={p.disabled || undefined}
          aria-readonly={p.readOnly || undefined}
          data-placeholder={placeholder()}
          data-empty={empty() || undefined}
          style={{
            'min-height': `${p.minHeight}px`,
            'max-height': p.maxHeight === undefined ? undefined : `${p.maxHeight}px`,
          }}
          onInput={onInput}
          onKeyDown={onKeyDown}
          onPaste={onPaste}
          onMouseDown={() => pending.clear()}
          onClick={onClick}
        />
      </div>
      <Show when={p.hint || p.error || p.maxLength}>
        <div class="vui-field__foot">
          <span id={`${id}-hint`} class={cx('vui-hint', !!p.error && 'vui-hint--error')}>
            {p.error || p.hint}
          </span>
          <Show when={p.maxLength}>
            {(max) => (
              <span
                class={cx('vui-hint', 'vui-field__count', textLength() > max() && 'vui-field__count--max')}
                aria-live="polite"
              >
                {textLength()}/{max()}
              </span>
            )}
          </Show>
        </div>
      </Show>
    </div>
  );
};
