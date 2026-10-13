import {
  createRichTextFragment,
  fill,
  LEAF_SELECTOR,
  LIST_TAG,
  sanitizeRichText,
  structure,
  unwrap,
} from './richTextModel';
import {
  blockOf,
  caretAfter,
  caretTo,
  endOf,
  keepSel,
  leaves,
  pointIn,
  rangeIn,
  restoreSel,
  saveSel,
  textBefore,
} from './richTextSelection';

export type BlockTag = 'P' | 'H2' | 'H3' | 'BLOCKQUOTE' | 'PRE';
export type ListTag = 'UL' | 'OL';

const EXITABLE_WHEN_EMPTY = /^(LI|BLOCKQUOTE|H2|H3)$/u;
const STRAY_LIVE_MARKUP =
  ':scope>div,:scope>br,:scope>strong,:scope>em,:scope>u,:scope>s,:scope>code,:scope>a,span,font,b,i,[style]';

export const retag = (block: Element, tag: string): Element => {
  const element = document.createElement(tag);
  element.append(...block.childNodes);
  block.replaceWith(element);
  fill(element);
  return element;
};

/** Turns a list item into a block, splitting the list around it. */
const liftListItem = (item: Element, tag: string): Element => {
  const list = item.parentElement;
  if (!list) return item;
  const following: ChildNode[] = [];
  for (let sibling = item.nextSibling; sibling; sibling = sibling.nextSibling) following.push(sibling);
  const lifted = document.createElement(tag);
  lifted.append(...item.childNodes);
  fill(lifted);
  list.after(lifted);
  if (following.length) {
    const rest = document.createElement(list.tagName);
    rest.append(...following);
    lifted.after(rest);
  }
  item.remove();
  if (!list.children.length) list.remove();
  return lifted;
};

const blocksIn = (root: Element): Element[] => {
  const range = rangeIn(root);
  if (!range) return [];
  const start = blockOf(range.startContainer, root);
  if (!start) return [];
  const end = blockOf(range.endContainer, root);
  const all = leaves(root);
  const from = all.indexOf(start);
  const to = end ? all.indexOf(end) : from;
  return all.slice(from, Math.max(from, to) + 1);
};

export const setBlock = (root: Element, tag: Exclude<BlockTag, 'P'>): void => {
  const blocks = blocksIn(root);
  if (!blocks.length) return;
  const target = blocks.every((block) => block.tagName === tag) ? 'P' : tag;
  keepSel(root, () => {
    for (const block of blocks) {
      if (block.tagName === 'LI') liftListItem(block, target);
      else if (block.tagName !== target) retag(block, target);
    }
  });
};

export const setList = (root: Element, type: ListTag): void => {
  const blocks = blocksIn(root);
  if (!blocks.length) return;
  const alreadyList = blocks.every((block) => block.tagName === 'LI' && block.parentElement?.tagName === type);
  keepSel(root, () => {
    for (const block of blocks) {
      if (alreadyList) {
        liftListItem(block, 'P');
        continue;
      }
      if (block.tagName === 'LI') {
        const list = block.parentElement;
        if (list && list.tagName !== type) {
          const converted = document.createElement(type);
          converted.append(...list.childNodes);
          list.replaceWith(converted);
        }
        continue;
      }
      const item = document.createElement('li');
      item.append(...block.childNodes);
      fill(item);
      const previous = block.previousElementSibling;
      if (previous && previous.tagName === type) {
        previous.append(item);
        block.remove();
      } else {
        const list = document.createElement(type);
        list.append(item);
        block.replaceWith(list);
      }
    }
  });
};

/** Moves everything after the caret into a new block of the same kind (a plain paragraph after a heading). */
const splitBlock = (block: Element, range: Range): Element => {
  const tail = document.createRange();
  tail.setStart(range.startContainer, range.startOffset);
  tail.setEnd(block, block.childNodes.length);
  const fragment = tail.extractContents();
  const tag = /^H[23]$/u.test(block.tagName) && !fragment.textContent ? 'P' : block.tagName;
  const next = document.createElement(tag);
  next.append(fragment);
  fill(block);
  fill(next);
  block.after(next);
  return next;
};

const insertCodeNewline = (block: Element, range: Range) => {
  const after = block.textContent.slice(textBefore(block, range.startContainer, range.startOffset).length);
  const newline = document.createTextNode(after ? '\n' : '\n\n');
  range.insertNode(newline);
  caretTo(newline, 1);
};

/** Enter: splits the block; on an empty item/quote/heading it exits to a paragraph; twice at the end of a code block exits it. */
export const insertParagraph = (root: Element): void => {
  let range = rangeIn(root);
  if (!range) return;
  if (!range.collapsed) {
    range.deleteContents();
    range = rangeIn(root);
    if (!range) return;
  }
  const block = blockOf(range.startContainer, root);
  if (!block) return;
  if (block.tagName === 'PRE') {
    const before = textBefore(block, range.startContainer, range.startOffset);
    const after = block.textContent.slice(before.length);
    if (before.endsWith('\n') && /^\n?$/u.test(after)) {
      block.textContent = before.slice(0, -1);
      fill(block);
      const paragraph = document.createElement('p');
      paragraph.append(document.createElement('br'));
      block.after(paragraph);
      caretTo(paragraph, 0);
      return;
    }
    insertCodeNewline(block, range);
    return;
  }
  if (!block.textContent && EXITABLE_WHEN_EMPTY.test(block.tagName)) {
    caretTo(block.tagName === 'LI' ? liftListItem(block, 'P') : retag(block, 'P'), 0);
    return;
  }
  caretTo(...pointIn(splitBlock(block, range), 0));
};

/** Shift+Enter: a line break inside the block. */
export const insertLineBreak = (root: Element): void => {
  const range = rangeIn(root);
  if (!range) return;
  if (!range.collapsed) range.deleteContents();
  const block = blockOf(range.startContainer, root);
  if (!block) return;
  if (block.tagName === 'PRE') {
    insertCodeNewline(block, range);
    return;
  }
  const lineBreak = document.createElement('br');
  range.insertNode(lineBreak);
  const rest = document.createRange();
  rest.setStartAfter(lineBreak);
  rest.setEnd(block, block.childNodes.length);
  if (!rest.toString() && !rest.cloneContents().querySelector('br')) lineBreak.after(document.createElement('br'));
  caretAfter(lineBreak);
};

const toListItem = (element: Element): Element => {
  if (LIST_TAG.test(element.tagName)) return element;
  const item = document.createElement('li');
  item.append(...element.childNodes);
  return item;
};

/** Inserts sanitized markup at the caret: a single block merges inline, several blocks split the current one. */
export const insertContent = (root: Element, html: string): void => {
  const range = rangeIn(root);
  if (!range) return;
  if (!range.collapsed) range.deleteContents();
  const blocks = Array.from(createRichTextFragment(html).children);
  const firstBlock = blocks[0];
  if (!firstBlock) return;
  const block = blockOf(range.startContainer, root);
  if (!block) {
    root.append(...blocks);
    if (root.lastElementChild) caretTo(...endOf(root.lastElementChild));
    return;
  }
  if (blocks.length === 1 && !LIST_TAG.test(firstBlock.tagName)) {
    const inline = document.createDocumentFragment();
    inline.append(...firstBlock.childNodes);
    const last = inline.lastChild;
    range.insertNode(inline);
    if (last) caretAfter(last);
    return;
  }
  const tail = splitBlock(block, range);
  const nodes =
    block.tagName === 'LI'
      ? blocks.flatMap((entry) => (LIST_TAG.test(entry.tagName) ? Array.from(entry.children) : [toListItem(entry)]))
      : blocks;
  let reference = block;
  for (const node of nodes) {
    reference.after(node);
    reference = node;
  }
  if (!block.textContent) block.remove();
  if (!tail.textContent) tail.remove();
  const last = LIST_TAG.test(reference.tagName) ? reference.lastElementChild : reference;
  if (last) caretTo(...endOf(last));
};

/** Normalizes markup the browser produced while typing (divs, spans, styles) back into the allowed model. */
export const repairLive = (root: Element): void => {
  const stray =
    !root.firstChild ||
    !!root.querySelector(STRAY_LIVE_MARKUP) ||
    Array.from(root.childNodes).some((node) => node instanceof Text && node.data.trim());
  if (!stray) return;
  const range = rangeIn(root);
  const anchor = range ? { node: range.startContainer, offset: range.startOffset } : undefined;
  const saved = saveSel(root);
  root.querySelectorAll('[style]').forEach((element) => element.removeAttribute('style'));
  root.querySelectorAll('span,font').forEach(unwrap);
  root.querySelectorAll('b,i').forEach((element) => {
    const replacement = document.createElement(element.tagName === 'B' ? 'strong' : 'em');
    replacement.append(...element.childNodes);
    element.replaceWith(replacement);
  });
  root.querySelectorAll(':scope>div').forEach((element) => retag(element, 'P'));
  structure(root);
  if (anchor && anchor.node.isConnected && root.contains(anchor.node)) {
    caretTo(
      anchor.node,
      Math.min(anchor.offset, anchor.node instanceof Text ? anchor.node.length : anchor.node.childNodes.length),
    );
    return;
  }
  if (saved) {
    restoreSel(root, saved);
    return;
  }
  const first = root.querySelector(LEAF_SELECTOR);
  if (first) caretTo(...pointIn(first, 0));
};

/** Sanitized HTML of the editor, without the trailing placeholder `<br>` of each block. */
export const readHtml = (root: Element): string => {
  const clone = root.cloneNode(true);
  if (!(clone instanceof Element)) return '';
  clone.querySelectorAll(LEAF_SELECTOR).forEach((block) => {
    const last = block.lastChild;
    if (block.textContent && last?.nodeName === 'BR' && last.previousSibling?.nodeName !== 'BR') last.remove();
  });
  return sanitizeRichText(clone.innerHTML);
};
