import type { I18nKey } from '@jankrajewskiit/i18n';

import { type MarkName, SAFE_URL } from './richTextModel';

export type ToolId = MarkName | 'H2' | 'H3' | 'UL' | 'OL' | 'BLOCKQUOTE' | 'PRE' | 'link' | 'undo' | 'redo';

export interface ToolButton {
  kind: 'button';
  id: ToolId;
  /** Glyph name; `text` is shown when absent. */
  icon?: string;
  text?: string;
  /** Shortcut in `mod+shift+x` form. */
  keys: string;
  /** Kept in the `minimal` toolbar. */
  minimal: boolean;
  /** Mirror the glyph horizontally. */
  flip?: boolean;
}

export type ToolbarEntry = ToolButton | { kind: 'separator'; minimal: boolean } | { kind: 'spacer' };

export const TOOLBAR_ENTRIES: ReadonlyArray<ToolbarEntry> = [
  { kind: 'button', id: 'bold', icon: 'bold', keys: 'mod+b', minimal: true },
  { kind: 'button', id: 'italic', icon: 'italic', keys: 'mod+i', minimal: true },
  { kind: 'button', id: 'underline', icon: 'underline', keys: 'mod+u', minimal: false },
  { kind: 'button', id: 'strike', icon: 'strikethrough', keys: 'mod+shift+x', minimal: false },
  { kind: 'button', id: 'code', icon: 'code', keys: 'mod+e', minimal: false },
  { kind: 'separator', minimal: false },
  { kind: 'button', id: 'H2', text: 'H2', keys: 'mod+alt+2', minimal: false },
  { kind: 'button', id: 'H3', text: 'H3', keys: 'mod+alt+3', minimal: false },
  { kind: 'button', id: 'UL', icon: 'list', keys: 'mod+shift+8', minimal: true },
  { kind: 'button', id: 'OL', icon: 'list-ordered', keys: 'mod+shift+7', minimal: true },
  { kind: 'button', id: 'BLOCKQUOTE', icon: 'message-square', keys: 'mod+shift+9', minimal: false },
  { kind: 'button', id: 'PRE', text: '{ }', keys: 'mod+alt+c', minimal: false },
  { kind: 'separator', minimal: true },
  { kind: 'button', id: 'link', icon: 'link', keys: 'mod+k', minimal: true },
  { kind: 'spacer' },
  { kind: 'button', id: 'undo', icon: 'rotate-ccw', keys: 'mod+z', minimal: false },
  { kind: 'button', id: 'redo', icon: 'rotate-ccw', keys: 'mod+shift+z', minimal: false, flip: true },
];

export const TOOL_LABEL_KEYS: Readonly<Record<ToolId, I18nKey>> = {
  bold: 'velvet.forms.richTextEditor.tools.bold',
  italic: 'velvet.forms.richTextEditor.tools.italic',
  underline: 'velvet.forms.richTextEditor.tools.underline',
  strike: 'velvet.forms.richTextEditor.tools.strike',
  code: 'velvet.forms.richTextEditor.tools.code',
  H2: 'velvet.forms.richTextEditor.tools.heading',
  H3: 'velvet.forms.richTextEditor.tools.subheading',
  UL: 'velvet.forms.richTextEditor.tools.bulletedList',
  OL: 'velvet.forms.richTextEditor.tools.numberedList',
  BLOCKQUOTE: 'velvet.forms.richTextEditor.tools.quote',
  PRE: 'velvet.forms.richTextEditor.tools.codeBlock',
  link: 'velvet.forms.richTextEditor.tools.link',
  undo: 'velvet.common.undo',
  redo: 'velvet.forms.richTextEditor.tools.redo',
};

export const toolbarEntries = (toolbar: 'full' | 'minimal'): ReadonlyArray<ToolbarEntry> =>
  toolbar === 'minimal' ? TOOLBAR_ENTRIES.filter((entry) => entry.kind === 'spacer' || entry.minimal) : TOOLBAR_ENTRIES;

export const isToolButton = (entry: ToolbarEntry): entry is ToolButton => entry.kind === 'button';

const isApplePlatform = () => typeof navigator !== 'undefined' && /Mac|iPhone|iPad/u.test(navigator.userAgent);

/** `mod+shift+x` → ⇧⌘X on Apple platforms, Ctrl+Shift+X elsewhere. */
export const formatShortcut = (keys: string): string => {
  const apple = isApplePlatform();
  const symbols: Readonly<Record<string, string>> = apple
    ? { mod: '⌘', shift: '⇧', alt: '⌥' }
    : { mod: 'Ctrl', shift: 'Shift', alt: 'Alt' };
  return keys
    .split('+')
    .map((part) => symbols[part] ?? part.toUpperCase())
    .join(apple ? '' : '+');
};

export const ariaShortcut = (keys: string): string => keys.replace('mod', isApplePlatform() ? 'Meta' : 'Control');

export const matchesShortcut = (event: KeyboardEvent, keys: string): boolean => {
  const parts = keys.split('+');
  const key = parts[parts.length - 1] ?? '';
  const code = /^[a-z]$/u.test(key) ? `Key${key.toUpperCase()}` : /^\d$/u.test(key) ? `Digit${key}` : key;
  return (
    (event.metaKey || event.ctrlKey) === parts.includes('mod') &&
    event.shiftKey === parts.includes('shift') &&
    event.altKey === parts.includes('alt') &&
    event.code === code
  );
};

/** `''` = no address (remove the link), `null` = not a usable address, otherwise the normalized URL. */
export const normalizeUrl = (input: string): string | null => {
  let value = input.trim();
  if (!value) return '';
  if (/^[\w.+-]+@[\w-]+\.[\w.-]+$/u.test(value)) return `mailto:${value}`;
  if (!/^[a-z][\w+.-]*:/iu.test(value) && !/^[/#]/u.test(value)) {
    if (!/^[\w-]+(\.[\w-]+)+/u.test(value)) return null;
    value = `https://${value}`;
  }
  return SAFE_URL.test(value) ? value : null;
};
