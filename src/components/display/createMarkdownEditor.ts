import { createDeferred, onMount } from 'solid-js';

import { createControllable } from '../../hooks/createControllable';
import { useTranslate } from '../../i18n/useTranslate';
import type { MarkdownEditorMode } from './markdownEditorModes';
import {
  applyTool,
  continueList,
  indentListLine,
  type MarkdownTool,
  type TextEdit,
  toolForShortcut,
  type ToolPlaceholders,
} from './markdownTools';

export interface MarkdownEditorOptions {
  value?: string;
  defaultValue: string;
  onChange?: (value: string) => void;
  onValueChange?: (value: string) => void;
  mode?: MarkdownEditorMode;
  defaultMode: MarkdownEditorMode;
  onModeChange?: (mode: MarkdownEditorMode) => void;
  maxLength?: number;
  disabled?: boolean;
  readOnly?: boolean;
  autoFocus?: boolean;
  onKeyDown?: (e: KeyboardEvent) => void;
}

const countWords = (text: string): number => text.trim().match(/\S+/gu)?.length ?? 0;

export const createMarkdownEditor = (options: MarkdownEditorOptions) => {
  const translate = useTranslate();
  let textarea: HTMLTextAreaElement | undefined;

  const [value, setValue] = createControllable<string>({
    value: () => options.value,
    defaultValue: options.defaultValue,
    onChange: (next) => (options.onChange ?? options.onValueChange)?.(next),
  });
  const [mode, setMode] = createControllable<MarkdownEditorMode>({
    value: () => options.mode,
    defaultValue: options.defaultMode,
    onChange: (next) => options.onModeChange?.(next),
  });
  const previewSource = createDeferred(value);
  const editable = () => !options.disabled && !options.readOnly;

  const limit = (text: string) =>
    options.maxLength && text.length > options.maxLength ? text.slice(0, options.maxLength) : text;

  const commit = (edit: TextEdit) => {
    setValue(limit(edit.value));
    textarea?.focus({ preventScroll: true });
    textarea?.setSelectionRange(edit.selectionStart, edit.selectionEnd);
  };

  const runTool = (tool: MarkdownTool) => {
    if (!textarea || !editable()) return;
    const placeholders: ToolPlaceholders = {
      wrap: (wrapTool) => translate(wrapTool.labelKey).toLowerCase(),
      link: translate('velvet.display.markdownEditor.placeholders.linkText'),
      block: translate('velvet.display.markdownEditor.placeholders.code'),
    };
    commit(applyTool(tool, value(), textarea.selectionStart, textarea.selectionEnd, placeholders));
  };

  const onInput = (e: InputEvent & { currentTarget: HTMLTextAreaElement }) => {
    setValue(limit(e.currentTarget.value));
    e.currentTarget.value = value();
  };

  const onKeyDown = (e: KeyboardEvent & { currentTarget: HTMLTextAreaElement }) => {
    options.onKeyDown?.(e);
    if (e.defaultPrevented || !editable()) return;
    const el = e.currentTarget;
    const hasModifier = e.metaKey || e.ctrlKey;
    if (hasModifier && !e.shiftKey && !e.altKey) {
      const tool = toolForShortcut(e.key);
      if (tool) {
        e.preventDefault();
        runTool(tool);
        return;
      }
    }
    if (e.key === 'Enter' && !e.shiftKey && !hasModifier && el.selectionStart === el.selectionEnd) {
      const edit = continueList(value(), el.selectionStart);
      if (edit) {
        e.preventDefault();
        commit(edit);
      }
      return;
    }
    if (e.key === 'Tab' && !hasModifier) {
      const edit = indentListLine(value(), el.selectionStart, e.shiftKey);
      if (edit) {
        e.preventDefault();
        commit(edit);
      }
    }
  };

  onMount(() => {
    if (options.autoFocus) textarea?.focus();
  });

  return {
    bindTextarea: (element: HTMLTextAreaElement) => {
      textarea = element;
    },
    value,
    mode,
    setMode,
    previewSource,
    words: () => countWords(value()),
    showWrite: () => mode() !== 'preview',
    showPreview: () => mode() !== 'write',
    runTool,
    onInput,
    onKeyDown,
  };
};
