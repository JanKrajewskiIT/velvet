import { createSignal } from 'solid-js';

import { applyMark, removeLinks } from './richTextMarks';
import {
  caretAfter,
  caretTo,
  closestTag,
  endOf,
  rangeIn,
  restoreSel,
  type SavedSelection,
  saveSel,
  textNodesIn,
} from './richTextSelection';
import { normalizeUrl } from './richTextTools';

export interface LinkDraft {
  href: string;
  selection: SavedSelection | null;
  /** The caret or selection is already inside a link. */
  existing: boolean;
  error?: string;
}

export interface RichTextLinkOptions {
  editor: () => HTMLElement;
  /** Runs an editing command with the editor focused, history recorded and output refreshed. */
  run: (command: (root: HTMLElement) => void) => void;
  /** Marks toggled but not yet typed; a fresh link must not capture the next typed text. */
  pending: Map<string, boolean>;
  editable: () => boolean;
  invalidText: () => string;
}

/** State and commands of the link popover: open on the current link or selection, apply, remove, cancel. */
export const createRichTextLink = (options: RichTextLinkOptions) => {
  const [draft, setDraft] = createSignal<LinkDraft>();

  const open = () => {
    const editor = options.editor();
    if (!options.editable()) return;
    if (!rangeIn(editor)) {
      editor.focus();
      if (!rangeIn(editor)) caretTo(...endOf(editor.lastElementChild ?? editor));
    }
    const range = rangeIn(editor);
    if (!range) return;
    const anchor =
      closestTag(range.startContainer, 'A', editor) ??
      textNodesIn(range, editor)
        .map((text) => closestTag(text, 'A', editor))
        .find((found) => found !== null);
    setDraft({ href: anchor?.getAttribute('href') ?? '', selection: saveSel(editor), existing: !!anchor });
  };

  const setHref = (href: string) => {
    const current = draft();
    if (current) setDraft({ ...current, href, error: undefined });
  };

  const close = () => {
    const current = draft();
    const editor = options.editor();
    setDraft(undefined);
    editor.focus();
    if (current) restoreSel(editor, current.selection);
  };

  const commit = (remove: boolean) => {
    const current = draft();
    if (!current) return;
    const url = remove ? '' : normalizeUrl(current.href);
    if (url === null) {
      setDraft({ ...current, error: options.invalidText() });
      return;
    }
    const editor = options.editor();
    setDraft(undefined);
    editor.focus();
    restoreSel(editor, current.selection);
    options.run((root) => {
      const range = rangeIn(root);
      if (!range) return;
      if (!url) {
        removeLinks(root);
        return;
      }
      if (!range.collapsed) {
        applyMark(root, 'A', true, { href: url });
        return;
      }
      const existing = closestTag(range.startContainer, 'A', root);
      if (existing) {
        existing.setAttribute('href', url);
        return;
      }
      const anchor = document.createElement('a');
      anchor.setAttribute('href', url);
      anchor.textContent = current.href.trim().replace(/^mailto:/u, '');
      range.insertNode(anchor);
      caretAfter(anchor);
      options.pending.clear();
      options.pending.set('A', false);
    });
  };

  return { draft, open, setHref, close, commit };
};
