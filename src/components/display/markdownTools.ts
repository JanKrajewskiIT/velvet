import type { I18nKey } from '@jankrajewskiit/i18n';

/** What a toolbar action does to the text: wrap the selection, prefix its lines, insert a link, or fence it. */
interface ToolBase {
  id: string;
  labelKey: I18nKey;
  /** Glyph name. */
  icon?: string;
  /** Text face when there is no glyph, e.g. `H`. */
  glyph?: string;
  /** Letter of the Cmd/Ctrl shortcut. */
  shortcut?: string;
}

interface WrapTool extends ToolBase {
  kind: 'wrap';
  marker: string;
}

interface LineTool extends ToolBase {
  kind: 'line';
  prefix: string;
  numbered?: boolean;
}

interface LinkTool extends ToolBase {
  kind: 'link';
}

interface BlockTool extends ToolBase {
  kind: 'block';
}

export type MarkdownTool = WrapTool | LineTool | LinkTool | BlockTool;

export type ToolbarItem = MarkdownTool | { kind: 'separator'; id: string };

export const MARKDOWN_TOOLBAR: readonly ToolbarItem[] = [
  { kind: 'line', id: 'h', labelKey: 'velvet.display.markdownEditor.tools.heading', glyph: 'H', prefix: '## ' },
  {
    kind: 'wrap',
    id: 'b',
    labelKey: 'velvet.display.markdownEditor.tools.bold',
    icon: 'bold',
    marker: '**',
    shortcut: 'b',
  },
  {
    kind: 'wrap',
    id: 'i',
    labelKey: 'velvet.display.markdownEditor.tools.italic',
    icon: 'italic',
    marker: '*',
    shortcut: 'i',
  },
  {
    kind: 'wrap',
    id: 's',
    labelKey: 'velvet.display.markdownEditor.tools.strikethrough',
    icon: 'strikethrough',
    marker: '~~',
  },
  { kind: 'separator', id: 'sep-1' },
  { kind: 'line', id: 'ul', labelKey: 'velvet.display.markdownEditor.tools.bulletedList', icon: 'list', prefix: '- ' },
  {
    kind: 'line',
    id: 'ol',
    labelKey: 'velvet.display.markdownEditor.tools.numberedList',
    icon: 'list-ordered',
    prefix: '1. ',
    numbered: true,
  },
  {
    kind: 'line',
    id: 'task',
    labelKey: 'velvet.display.markdownEditor.tools.checklist',
    icon: 'check-circle',
    prefix: '- [ ] ',
  },
  { kind: 'line', id: 'q', labelKey: 'velvet.display.markdownEditor.tools.quote', glyph: '“', prefix: '> ' },
  { kind: 'separator', id: 'sep-2' },
  {
    kind: 'wrap',
    id: 'code',
    labelKey: 'velvet.display.markdownEditor.tools.inlineCode',
    icon: 'code',
    marker: '`',
    shortcut: 'e',
  },
  { kind: 'link', id: 'link', labelKey: 'velvet.display.markdownEditor.tools.link', icon: 'link', shortcut: 'k' },
  { kind: 'block', id: 'pre', labelKey: 'velvet.display.markdownEditor.tools.codeBlock', glyph: '{ }' },
];

const SHORTCUT_TOOLS = MARKDOWN_TOOLBAR.filter(
  (item): item is MarkdownTool => item.kind !== 'separator' && item.shortcut !== undefined,
);

export const toolForShortcut = (key: string): MarkdownTool | undefined =>
  SHORTCUT_TOOLS.find((tool) => tool.shortcut === key.toLowerCase());

const LINK_PLACEHOLDER_URL = 'https://';
const LINE_PREFIX = /^(#{1,6} |> |- \[[ x]\] |[-*+] |\d+[.)] )/u;

/** Localized text a tool inserts when nothing is selected. */
export interface ToolPlaceholders {
  wrap: (tool: MarkdownTool) => string;
  link: string;
  block: string;
}

export interface TextEdit {
  value: string;
  selectionStart: number;
  selectionEnd: number;
}

const edit = (value: string, selectionStart: number, selectionEnd: number): TextEdit => ({
  value,
  selectionStart,
  selectionEnd,
});

/** Index of the first character of the line containing `index`. */
export const lineStart = (value: string, index: number): number =>
  index <= 0 ? 0 : value.lastIndexOf('\n', index - 1) + 1;

const applyWrap = (tool: WrapTool, value: string, start: number, end: number, placeholder: string): TextEdit => {
  const { marker } = tool;
  const selected = value.slice(start, end);
  const wrapped =
    start >= marker.length &&
    value.slice(start - marker.length, start) === marker &&
    value.slice(end, end + marker.length) === marker;
  if (wrapped) {
    return edit(
      value.slice(0, start - marker.length) + selected + value.slice(end + marker.length),
      start - marker.length,
      end - marker.length,
    );
  }
  const text = selected || placeholder;
  return edit(
    value.slice(0, start) + marker + text + marker + value.slice(end),
    start + marker.length,
    start + marker.length + text.length,
  );
};

const applyLink = (value: string, start: number, end: number, placeholder: string): TextEdit => {
  const text = value.slice(start, end) || placeholder;
  const markup = `[${text}](${LINK_PLACEHOLDER_URL})`;
  const urlStart = start + text.length + 3;
  return edit(value.slice(0, start) + markup + value.slice(end), urlStart, urlStart + LINK_PLACEHOLDER_URL.length);
};

const applyBlock = (value: string, start: number, end: number, placeholder: string): TextEdit => {
  const text = value.slice(start, end) || placeholder;
  const opening = `${start > 0 && value[start - 1] !== '\n' ? '\n' : ''}\`\`\`\n`;
  return edit(
    value.slice(0, start) + opening + text + '\n```\n' + value.slice(end),
    start + opening.length,
    start + opening.length + text.length,
  );
};

const applyLinePrefix = (tool: LineTool, value: string, start: number, end: number): TextEdit => {
  const first = lineStart(value, start);
  const lineEnd = value.indexOf('\n', end);
  const last = lineEnd === -1 ? value.length : lineEnd;
  const lines = value.slice(first, last).split('\n');
  const allPrefixed = lines.every((line) => line.startsWith(tool.prefix));
  const next = lines
    .map((line, index) => {
      if (allPrefixed) return line.slice(tool.prefix.length);
      const prefix = tool.numbered ? `${index + 1}. ` : tool.prefix;
      return prefix + line.replace(LINE_PREFIX, '');
    })
    .join('\n');
  return edit(value.slice(0, first) + next + value.slice(last), first, first + next.length);
};

/** Applies a toolbar action to the `[start, end)` selection and returns the new text and selection. */
export const applyTool = (
  tool: MarkdownTool,
  value: string,
  start: number,
  end: number,
  placeholders: ToolPlaceholders,
): TextEdit => {
  switch (tool.kind) {
    case 'wrap':
      return applyWrap(tool, value, start, end, placeholders.wrap(tool));
    case 'link':
      return applyLink(value, start, end, placeholders.link);
    case 'block':
      return applyBlock(value, start, end, placeholders.block);
    case 'line':
      return applyLinePrefix(tool, value, start, end);
    default: {
      const unreachable: never = tool;
      return unreachable;
    }
  }
};

const LIST_MARKER = /^(\s*)(- \[[ x]\] |[-*+] |(\d+)([.)]) |> )/u;
const LIST_LINE = /^\s*([-*+]|\d+[.)])\s/u;
const INDENT = '  ';

/** Enter inside a list or quote line: continue it, or end it when the item is empty. `null` = default behaviour. */
export const continueList = (value: string, caret: number): TextEdit | null => {
  const first = lineStart(value, caret);
  const line = value.slice(first, caret);
  const match = line.match(LIST_MARKER);
  if (!match) return null;
  const [, indent = '', marker = '', number, delimiter = ''] = match;
  if (line.trim() === marker.trim()) return edit(value.slice(0, first) + value.slice(caret), first, first);
  const next = number ? `${indent}${Number(number) + 1}${delimiter} ` : indent + marker.replace('[x]', '[ ]');
  const position = caret + 1 + next.length;
  return edit(`${value.slice(0, caret)}\n${next}${value.slice(caret)}`, position, position);
};

/** Tab / Shift+Tab on a list line indents or outdents it. `null` = default behaviour. */
export const indentListLine = (value: string, caret: number, outdent: boolean): TextEdit | null => {
  const first = lineStart(value, caret);
  if (!LIST_LINE.test(value.slice(first))) return null;
  if (!outdent)
    return edit(value.slice(0, first) + INDENT + value.slice(first), caret + INDENT.length, caret + INDENT.length);
  if (!value.startsWith(INDENT, first)) return edit(value, caret, caret);
  return edit(value.slice(0, first) + value.slice(first + INDENT.length), caret - INDENT.length, caret - INDENT.length);
};
