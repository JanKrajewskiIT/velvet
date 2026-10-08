import { unwrap } from './richTextModel';
import { blockOf, caretTo, closestTag, keepSel, rangeIn, select, textNodesIn } from './richTextSelection';

/** Marks the next typed text should gain (`true`) or lose (`false`), by tag name. */
export type PendingMarks = ReadonlyMap<string, boolean>;

const splitRange = (range: Range): Range => {
  let startNode = range.startContainer;
  let startOffset = range.startOffset;
  let endNode = range.endContainer;
  let endOffset = range.endOffset;
  if (endNode instanceof Text && endOffset > 0 && endOffset < endNode.length) endNode.splitText(endOffset);
  if (startNode instanceof Text && startOffset > 0 && startOffset < startNode.length) {
    const tail = startNode.splitText(startOffset);
    if (endNode === startNode) {
      endNode = tail;
      endOffset -= startOffset;
    }
    startNode = tail;
    startOffset = 0;
  }
  const split = document.createRange();
  split.setStart(startNode, startOffset);
  split.setEnd(endNode, endOffset);
  return split;
};

const cloneAround = (mark: Element, fragment: DocumentFragment, place: 'before' | 'after') => {
  if (!fragment.textContent) {
    mark[place](fragment);
    return;
  }
  const clone = mark.cloneNode(false);
  clone.appendChild(fragment);
  mark[place](clone);
};

/** Splits `mark` so that `text` sits in a mark of its own, ready to be unwrapped. */
const isolate = (mark: Element, text: Text) => {
  const before = document.createRange();
  before.setStart(mark, 0);
  before.setEnd(text, 0);
  cloneAround(mark, before.extractContents(), 'before');
  const after = document.createRange();
  after.setStart(text, text.length);
  after.setEnd(mark, mark.childNodes.length);
  cloneAround(mark, after.extractContents(), 'after');
};

/** Wraps or unwraps the selected text in `tag`. With `on` unset it toggles; `attributes` always rewrap (links). */
export const applyMark = (
  root: Element,
  tag: string,
  on?: boolean,
  attributes?: Readonly<Record<string, string>>,
): void => {
  const original = rangeIn(root);
  if (!original || original.collapsed) return;
  const texts = textNodesIn(splitRange(original), root).filter(
    (text) => !(tag === 'CODE' && closestTag(text, 'PRE', root)),
  );
  const first = texts[0];
  const last = texts[texts.length - 1];
  if (!first || !last) return;
  const turnOn = on ?? !texts.every((text) => closestTag(text, tag, root));
  for (const text of texts) {
    const existing = closestTag(text, tag, root);
    if (existing && (!turnOn || attributes)) {
      isolate(existing, text);
      unwrap(existing);
    }
    if (turnOn && (!existing || attributes)) {
      const mark = document.createElement(tag);
      for (const [name, value] of Object.entries(attributes ?? {})) mark.setAttribute(name, value);
      text.before(mark);
      mark.append(text);
    }
  }
  const selected = document.createRange();
  selected.setStart(first, 0);
  selected.setEnd(last, last.length);
  select(selected);
  keepSel(root);
};

export const removeLinks = (root: Element): void => {
  const range = rangeIn(root);
  if (!range) return;
  const nodes: Node[] = range.collapsed ? [range.startContainer] : textNodesIn(range, root);
  keepSel(root, () => {
    for (const node of nodes) {
      const link = closestTag(node, 'A', root);
      if (link) unwrap(link);
    }
  });
};

const NBSP = '\u00a0';

/** A collapsible space at the end of a block is not rendered, so the browser would move the caret back before it. */
const endsBlock = (position: Range, root: Element): boolean => {
  const block = blockOf(position.startContainer, root);
  if (!block) return false;
  const rest = document.createRange();
  rest.setStart(position.startContainer, position.startOffset);
  rest.setEnd(block, block.childNodes.length);
  return !rest.toString();
};

/** Inserts `text` at the caret, applying the toggled-but-not-yet-typed marks. */
export const insertPending = (root: Element, text: string, pending: PendingMarks): void => {
  const range = rangeIn(root);
  if (!range) return;
  if (!range.collapsed) range.deleteContents();
  const position = range.cloneRange();
  for (const [tag, on] of pending) {
    const mark = on ? null : closestTag(position.startContainer, tag, root);
    if (!mark) continue;
    const tail = document.createRange();
    tail.setStart(position.startContainer, position.startOffset);
    tail.setEnd(mark, mark.childNodes.length);
    const fragment = tail.extractContents();
    if (fragment.textContent) {
      const clone = mark.cloneNode(false);
      clone.appendChild(fragment);
      mark.after(clone);
    }
    position.setStartAfter(mark);
    position.collapse(true);
  }
  const textNode = document.createTextNode(text === ' ' && endsBlock(position, root) ? NBSP : text);
  let inserted: Node = textNode;
  for (const [tag, on] of pending) {
    if (on && !closestTag(position.startContainer, tag, root)) {
      const mark = document.createElement(tag);
      mark.append(inserted);
      inserted = mark;
    }
  }
  position.insertNode(inserted);
  caretTo(textNode, textNode.length);
  keepSel(root);
};
