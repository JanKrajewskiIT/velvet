import { createSignal } from 'solid-js';

import { readHtml } from './richTextBlocks';
import { MARK_NAMES, MARK_TAGS } from './richTextModel';
import { blockOf, closestTag, rangeIn, textNodesIn } from './richTextSelection';
import { EMPTY_FORMAT, type RichTextFormat } from './RichTextToolbar';

export interface RichTextStateOptions {
  editor: () => HTMLElement;
  emitChange: (html: string, text: string) => void;
}

export type RichTextState = ReturnType<typeof createRichTextState>;

/** Derived editor state: active format at the caret, text length, emptiness, pending marks and change emission. */
export const createRichTextState = (options: RichTextStateOptions) => {
  const pending = new Map<string, boolean>();
  const [format, setFormat] = createSignal<RichTextFormat>(EMPTY_FORMAT);
  const [textLength, setTextLength] = createSignal(0);
  const [empty, setEmpty] = createSignal(true);
  let lastOutput: string | undefined;

  const refreshFormat = () => {
    const editor = options.editor();
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
    const editor = options.editor();
    const text = editor.innerText.replace(/\n+$/u, '');
    const isEmpty =
      !editor.textContent && editor.children.length <= 1 && !editor.querySelector('li,h2,h3,blockquote,pre');
    setEmpty(isEmpty);
    setTextLength(text.trim() ? Array.from(text).length : 0);
    refreshFormat();
    const output = isEmpty ? '' : readHtml(editor);
    if (lastOutput !== undefined && output !== lastOutput) options.emitChange(output, text);
    lastOutput = output;
  };

  return { pending, format, textLength, empty, refreshFormat, afterChange };
};
