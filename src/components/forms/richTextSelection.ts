import { clamp } from '../../utils/math';
import { LEAF_SELECTOR, LIST_TAG, tidy } from './richTextModel';

export type SavedPoint = readonly [blockIndex: number, offset: number];
export type SavedSelection = readonly [start: SavedPoint, end: SavedPoint];
export type DomPoint = readonly [node: Node, offset: number];

/** The current selection range when it lies entirely inside `root`. */
export const rangeIn = (root: Element): Range | null => {
  const selection = window.getSelection();
  if (!selection || !selection.rangeCount) return null;
  const range = selection.getRangeAt(0);
  return root.contains(range.startContainer) && root.contains(range.endContainer) ? range : null;
};

export const select = (range: Range): void => {
  const selection = window.getSelection();
  selection?.removeAllRanges();
  selection?.addRange(range);
};

export const caretTo = (node: Node, offset: number): void => {
  const range = document.createRange();
  range.setStart(node, offset);
  range.collapse(true);
  select(range);
};

export const caretAfter = (node: Node): void => {
  const range = document.createRange();
  range.setStartAfter(node);
  range.collapse(true);
  select(range);
};

export const closestTag = (node: Node | null, tag: string, root: Element): Element | null => {
  for (let current = node; current && current !== root; current = current.parentNode) {
    if (current instanceof Element && current.tagName === tag) return current;
  }
  return null;
};

/** The leaf block (paragraph, heading, quote, code block or list item) that contains `node`. */
export const blockOf = (node: Node | null, root: Element): Element | null => {
  if (!node || node === root || !root.contains(node)) return null;
  let current: Node = node;
  while (current.parentNode && current.parentNode !== root) {
    if (current instanceof Element && current.tagName === 'LI') return current;
    current = current.parentNode;
  }
  if (!(current instanceof Element)) return null;
  return LIST_TAG.test(current.tagName) ? current.querySelector('li') : current;
};

export const leaves = (root: Element): Element[] => Array.from(root.querySelectorAll(LEAF_SELECTOR));

export const textBefore = (block: Element, node: Node, offset: number): string => {
  const range = document.createRange();
  range.setStart(block, 0);
  range.setEnd(node, offset);
  return range.toString();
};

/** The DOM position `offset` characters into `block`'s text. */
export const pointIn = (block: Node, offset: number): DomPoint => {
  const walker = document.createTreeWalker(block, NodeFilter.SHOW_TEXT);
  let remaining = offset;
  let last: Text | undefined;
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    if (!(node instanceof Text)) continue;
    last = node;
    if (remaining <= node.length) return [node, remaining];
    remaining -= node.length;
  }
  return last ? [last, last.length] : [block, 0];
};

export const endOf = (element: Node): DomPoint => {
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
  let last: Text | undefined;
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    if (node instanceof Text) last = node;
  }
  return last ? [last, last.length] : [element, element.childNodes.length];
};

/** Block-relative selection that survives DOM rewrites inside the blocks. */
export const saveSel = (root: Element): SavedSelection | null => {
  const range = rangeIn(root);
  if (!range) return null;
  const all = leaves(root);
  const point = (node: Node, offset: number): SavedPoint => {
    const block = blockOf(node, root);
    return block ? [all.indexOf(block), textBefore(block, node, offset).length] : [0, 0];
  };
  return [point(range.startContainer, range.startOffset), point(range.endContainer, range.endOffset)];
};

export const restoreSel = (root: Element, saved: SavedSelection | null): void => {
  if (!saved) return;
  const all = leaves(root);
  const at = ([index, offset]: SavedPoint): DomPoint | undefined => {
    const block = all[clamp(index, 0, all.length - 1)];
    return block ? pointIn(block, offset) : undefined;
  };
  const start = at(saved[0]);
  const end = at(saved[1]);
  if (!start || !end) return;
  const range = document.createRange();
  range.setStart(...start);
  range.setEnd(...end);
  select(range);
};

/** Text nodes of `range` that belong to a block, excluding ones the range only touches at an edge. */
export const textNodesIn = (range: Range, root: Element): Text[] => {
  const usable = (text: Text) =>
    text.length > 0 &&
    !(text === range.startContainer && range.startOffset >= text.length) &&
    !(text === range.endContainer && range.endOffset === 0) &&
    !!blockOf(text, root) &&
    !(text.parentElement && LIST_TAG.test(text.parentElement.tagName));
  const container = range.commonAncestorContainer;
  if (container instanceof Text) return usable(container) ? [container] : [];
  const found: Text[] = [];
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    if (node instanceof Text && range.intersectsNode(node) && usable(node)) found.push(node);
  }
  return found;
};

/** Runs `mutate`, re-tidies the markup and restores the selection by block position. */
export const keepSel = (root: Element, mutate?: () => void): void => {
  const saved = saveSel(root);
  mutate?.();
  tidy(root);
  restoreSel(root, saved);
};
