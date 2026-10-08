import { setBlock, setList } from './richTextBlocks';
import { fill } from './richTextModel';
import { blockOf, caretTo, closestTag, pointIn, rangeIn, textBefore } from './richTextSelection';

export type MarkdownResult = { kind: 'block' } | { kind: 'mark'; tag: string };

const BLOCK_SHORTCUT = /^(#{1,2}|[-*+]|1[.)]|>|```)[\s\u00a0]$/u;
const INLINE_RULES: ReadonlyArray<{ pattern: RegExp; tag: string; delimiterLength: number }> = [
  { pattern: /\*\*([^*\s](?:[^*]*[^*\s])?)\*\*$/u, tag: 'STRONG', delimiterLength: 2 },
  { pattern: /~~([^~\s](?:[^~]*[^~\s])?)~~$/u, tag: 'S', delimiterLength: 2 },
  { pattern: /(?:^|[^*\w])\*([^*\s](?:[^*]*[^*\s])?)\*$/u, tag: 'EM', delimiterLength: 1 },
  { pattern: /(?:^|[^_\w])_([^_\s](?:[^_]*[^_\s])?)_$/u, tag: 'EM', delimiterLength: 1 },
  { pattern: /`([^`]+)`$/u, tag: 'CODE', delimiterLength: 1 },
];

const applyBlockShortcut = (root: Element, marker: string) => {
  switch (marker) {
    case '#':
      return setBlock(root, 'H2');
    case '##':
      return setBlock(root, 'H3');
    case '>':
      return setBlock(root, 'BLOCKQUOTE');
    case '```':
      return setBlock(root, 'PRE');
    default:
      return setList(root, marker.startsWith('1') ? 'OL' : 'UL');
  }
};

/**
 * Markdown as you type: `# ` `## ` `- ` `1. ` `> ` and ``` at the start of a paragraph, or `**bold**`, `*italic*`, `_italic_`, `~~strike~~`
 * and `` `code` `` just before the caret. `beforeMutate` runs before the first DOM change so the caller can snapshot history.
 */
export const applyMarkdownShortcut = (
  root: Element,
  typed: string,
  beforeMutate: () => void,
): MarkdownResult | undefined => {
  const range = rangeIn(root);
  if (!range || !range.collapsed) return undefined;
  const block = blockOf(range.startContainer, root);
  if (!block) return undefined;

  if (typed === ' ' && block.tagName === 'P') {
    const marker = textBefore(block, range.startContainer, range.startOffset).match(BLOCK_SHORTCUT)?.[1];
    if (marker) {
      beforeMutate();
      const prefix = document.createRange();
      prefix.setStart(block, 0);
      prefix.setEnd(range.startContainer, range.startOffset);
      prefix.deleteContents();
      fill(block);
      caretTo(...pointIn(block, 0));
      applyBlockShortcut(root, marker);
      return { kind: 'block' };
    }
  }

  const node = range.startContainer;
  if (!(node instanceof Text) || block.tagName === 'PRE' || closestTag(node, 'CODE', root)) return undefined;
  const before = node.data.slice(0, range.startOffset);
  for (const rule of INLINE_RULES) {
    const inner = before.match(rule.pattern)?.[1];
    if (inner === undefined || closestTag(node, rule.tag, root)) continue;
    beforeMutate();
    const end = range.startOffset;
    const start = end - inner.length - 2 * rule.delimiterLength;
    const tail = node.splitText(end);
    const middle = node.splitText(start);
    middle.data = inner;
    const mark = document.createElement(rule.tag);
    middle.before(mark);
    mark.append(middle);
    caretTo(tail, 0);
    return { kind: 'mark', tag: rule.tag };
  }
  return undefined;
};
