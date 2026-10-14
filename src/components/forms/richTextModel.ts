export const MARK_NAMES = ['bold', 'italic', 'underline', 'strike', 'code'] as const;

export type MarkName = (typeof MARK_NAMES)[number];

export const MARK_TAGS: Readonly<Record<MarkName, string>> = {
  bold: 'STRONG',
  italic: 'EM',
  underline: 'U',
  strike: 'S',
  code: 'CODE',
};

const MARK_SELECTOR = 'strong,em,u,s,code,a';
export const LEAF_SELECTOR = ':scope>p,:scope>h2,:scope>h3,:scope>blockquote,:scope>pre,li';
export const LIST_TAG = /^(UL|OL)$/u;
export const SAFE_URL = /^(https?:|mailto:|tel:|\/|#)/iu;

const TOP_LEVEL_TAG = /^(P|H2|H3|BLOCKQUOTE|PRE|UL|OL)$/u;
const DROPPED_TAG =
  /^(SCRIPT|STYLE|TEMPLATE|IFRAME|OBJECT|EMBED|SVG|MATH|HEAD|META|LINK|TITLE|NOSCRIPT|IMG|VIDEO|AUDIO|CANVAS|INPUT|BUTTON|SELECT|TEXTAREA)$/u;
const TAG_ALIAS: Readonly<Record<string, string>> = {
  B: 'STRONG',
  I: 'EM',
  STRIKE: 'S',
  DEL: 'S',
  INS: 'U',
  DIV: 'P',
  H1: 'H2',
  H4: 'H3',
  H5: 'H3',
  H6: 'H3',
  TT: 'CODE',
  KBD: 'CODE',
};
const ALLOWED_TAGS: ReadonlySet<string> = new Set([
  'P',
  'H2',
  'H3',
  'BLOCKQUOTE',
  'PRE',
  'UL',
  'OL',
  'LI',
  'STRONG',
  'EM',
  'U',
  'S',
  'CODE',
  'A',
  'BR',
]);

export const unwrap = (element: Element): void => element.replaceWith(...element.childNodes);

const cleanTree = (parent: Node): void => {
  for (const node of Array.from(parent.childNodes)) {
    if (node instanceof Text) continue;
    if (!(node instanceof Element)) {
      node.remove();
      continue;
    }
    const raw = node.tagName.toUpperCase();
    if (DROPPED_TAG.test(raw)) {
      node.remove();
      continue;
    }
    const tag = TAG_ALIAS[raw] ?? raw;
    if (!ALLOWED_TAGS.has(tag)) {
      cleanTree(node);
      unwrap(node);
      continue;
    }
    const href = tag === 'A' ? (node.getAttribute('href') ?? '').trim() : '';
    let element = node;
    if (tag !== raw) {
      element = document.createElement(tag);
      element.append(...node.childNodes);
      node.replaceWith(element);
    }
    for (const attribute of Array.from(element.attributes)) element.removeAttribute(attribute.name);
    if (tag === 'A') {
      if (href && SAFE_URL.test(href)) element.setAttribute('href', href);
      else {
        cleanTree(element);
        unwrap(element);
        continue;
      }
    }
    cleanTree(element);
  }
};

/** Gives an empty block or list item a `<br>` so it keeps a caret position and height. */
export const fill = (element: Element): void => {
  element.querySelectorAll(MARK_SELECTOR).forEach((mark) => {
    if (!mark.textContent) unwrap(mark);
  });
  if (!element.textContent && !element.querySelector('br')) element.append(document.createElement('br'));
};

const flattenNestedLists = (root: Element) => {
  root.querySelectorAll('li > ul, li > ol').forEach((list) => {
    list.parentElement?.after(...Array.from(list.children));
    list.remove();
  });
};

const flattenNestedBlocks = (root: Element) => {
  root
    .querySelectorAll('li p, li h2, li h3, li blockquote, li pre, p p, h2 p, h3 p, blockquote p, pre p, p h2, p h3')
    .forEach((block) => {
      if (block.nextSibling) block.after(document.createElement('br'));
      unwrap(block);
    });
};

const wrapLooseTopLevel = (root: Element) => {
  let paragraph: HTMLParagraphElement | undefined;
  for (const node of Array.from(root.childNodes)) {
    if (node instanceof Element && TOP_LEVEL_TAG.test(node.tagName)) {
      paragraph = undefined;
      continue;
    }
    if (node instanceof Element && node.tagName === 'LI') {
      const previous = node.previousElementSibling;
      if (previous && LIST_TAG.test(previous.tagName) && node.previousSibling === previous) previous.append(node);
      else {
        const list = document.createElement('ul');
        node.before(list);
        list.append(node);
      }
      paragraph = undefined;
      continue;
    }
    const blank = node instanceof Text ? !node.data.trim() : node instanceof Element && node.tagName === 'BR';
    if (!paragraph && blank) {
      node.remove();
      continue;
    }
    if (!paragraph) {
      paragraph = document.createElement('p');
      node.before(paragraph);
    }
    paragraph.append(node);
  }
};

const wrapLooseListContent = (root: Element) => {
  root.querySelectorAll('ul,ol').forEach((list) => {
    for (const child of Array.from(list.childNodes)) {
      if (child instanceof Element && child.tagName === 'LI') continue;
      if (child instanceof Text && !child.data.trim()) {
        child.remove();
        continue;
      }
      const item = document.createElement('li');
      child.before(item);
      item.append(child);
    }
    if (!list.children.length) list.remove();
  });
};

/** Coerces arbitrary markup under `root` into top-level blocks, flat lists and filled leaves. */
export const structure = (root: Element): void => {
  flattenNestedLists(root);
  flattenNestedBlocks(root);
  wrapLooseTopLevel(root);
  wrapLooseListContent(root);
  root.querySelectorAll(LEAF_SELECTOR).forEach(fill);
  if (!root.firstChild) {
    const paragraph = document.createElement('p');
    paragraph.append(document.createElement('br'));
    root.append(paragraph);
  }
};

const mergeAdjacentMarks = (root: Element) => {
  let merged = true;
  while (merged) {
    merged = false;
    for (const mark of Array.from(root.querySelectorAll(MARK_SELECTOR))) {
      const next = mark.nextSibling;
      if (
        next instanceof Element &&
        next.tagName === mark.tagName &&
        next.getAttribute('href') === mark.getAttribute('href')
      ) {
        mark.append(...next.childNodes);
        next.remove();
        merged = true;
        break;
      }
    }
  }
};

/** Removes redundant marks, merges adjacent equal ones and joins neighbouring lists. */
export const tidy = (root: Element): void => {
  root.querySelectorAll('strong strong, em em, u u, s s, code code, a a').forEach(unwrap);
  root.querySelectorAll(MARK_SELECTOR).forEach((mark) => {
    if (!mark.textContent) unwrap(mark);
  });
  mergeAdjacentMarks(root);
  root.querySelectorAll('ul+ul,ol+ol').forEach((list) => {
    const previous = list.previousElementSibling;
    if (previous && previous.tagName === list.tagName) {
      previous.append(...list.childNodes);
      list.remove();
    }
  });
  root.normalize();
};

const sanitizeRichTextRoot = (html: string): HTMLDivElement => {
  const template = document.createElement('template');
  // Parse in an inert template; strip unsafe tags and attributes before any nodes enter the live DOM.
  // nosemgrep: rules.javascript.browser.security.insecure-document-method, rules.javascript.browser.security.insecure-innerhtml
  template.innerHTML = html;
  cleanTree(template.content);
  const holder = document.createElement('div');
  holder.append(template.content);
  structure(holder);
  tidy(holder);
  return holder;
};

/** Allow-list sanitizer used for the default value, paste and history. */
export const createRichTextFragment = (html: string): DocumentFragment => {
  const fragment = document.createDocumentFragment();
  fragment.append(...sanitizeRichTextRoot(html).childNodes);
  return fragment;
};

/** Allow-list sanitizer used for output. Still sanitize server-side. */
export const sanitizeRichText = (html: string): string => sanitizeRichTextRoot(html).innerHTML;

export const escapeHtml = (text: string): string =>
  text.replace(/&/gu, '&amp;').replace(/</gu, '&lt;').replace(/>/gu, '&gt;');
