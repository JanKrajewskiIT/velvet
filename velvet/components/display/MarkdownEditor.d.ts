import * as React from 'react';
/**
 * Markdown authoring field — Write · Split · Preview tabs, formatting toolbar, ⌘B / ⌘I / ⌘K / ⌘E shortcuts,
 * Enter continues lists (empty item ends the list), Tab / Shift+Tab indents list items. The preview IS <Markdown> —
 * same renderer, same sanitising (raw HTML escaped, only http/mailto/relative links), so what you write is what readers see.
 */
export interface MarkdownEditorProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** Preferred name — same callback as onChange (onChange stays as an alias). */
  onValueChange?: (value: string) => void;
  label?: React.ReactNode;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  placeholder?: string;
  /** Controlled view. */
  mode?: 'write' | 'split' | 'preview';
  /** @default 'split' — collapses to stacked panes under 640px */
  defaultMode?: 'write' | 'split' | 'preview';
  onModeChange?: (mode: 'write' | 'split' | 'preview') => void;
  /** Pane height. @default 280 */
  height?: number | string;
  maxLength?: number;
  disabled?: boolean;
  readOnly?: boolean;
  autoFocus?: boolean;
  /** @default true */
  toolbar?: boolean;
  previewEmpty?: React.ReactNode;
  id?: string;
  className?: string;
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}
export declare function MarkdownEditor(props: MarkdownEditorProps): JSX.Element;
/**
 * Edit a Markdown field in a modal. Works on a draft: Save is disabled until something changed; closing a dirty draft asks
 * "Discard unsaved changes?"; ⌘↵ saves. onSave may return a Promise — while pending the editor locks and Save shows a spinner;
 * if it rejects the dialog stays open, the draft is kept and the error shows inline.
 */
export interface MarkdownEditDialogProps {
  open: boolean;
  onClose?: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** Initial value — the draft resets to it every time the dialog opens. */
  value?: string;
  onSave?: (value: string) => void | Promise<void>;
  saveLabel?: string;
  cancelLabel?: string;
  /** @default 'split' */
  defaultMode?: 'write' | 'split' | 'preview';
  /** @default 340 */
  height?: number | string;
  maxLength?: number;
  placeholder?: string;
  /** @default 'lg' */
  size?: 'sm' | 'md' | 'lg';
  /** @default true */
  confirmDiscard?: boolean;
}
export declare function MarkdownEditDialog(props: MarkdownEditDialogProps): JSX.Element;
