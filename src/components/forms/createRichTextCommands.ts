import type { RichTextHistory } from './createRichTextHistory';
import { createRichTextLink } from './createRichTextLink';
import type { RichTextState } from './createRichTextState';
import { setBlock, setList } from './richTextBlocks';
import { applyMark } from './richTextMarks';
import { MARK_TAGS, type MarkName } from './richTextModel';
import { caretTo, closestTag, endOf, rangeIn, restoreSel, saveSel } from './richTextSelection';
import type { ToolId } from './richTextTools';

export type RichTextCommands = ReturnType<typeof createRichTextCommands>;

export interface RichTextCommandsOptions {
  editor: () => HTMLElement;
  editable: () => boolean;
  invalidText: () => string;
  state: RichTextState;
  history: RichTextHistory;
}

/** Toolbar and shortcut commands: each runs against the restored selection with history recorded and output refreshed. */
export const createRichTextCommands = (options: RichTextCommandsOptions) => {
  const { pending, afterChange } = options.state;
  const { history } = options;

  const run = (command: (root: HTMLElement) => void) => {
    if (!options.editable()) return;
    const editor = options.editor();
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
    editor: options.editor,
    run,
    pending,
    editable: options.editable,
    invalidText: options.invalidText,
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

  return { run, exec, link };
};
