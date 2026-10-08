// Markdown to HTML with a closed output vocabulary: every source character is HTML-escaped first, the renderer
// only ever emits the tags below, and link/image URLs must match an allow-list of schemes. Raw HTML in the source
// therefore never reaches the DOM, which makes the result safe to assign to innerHTML.

const ESCAPES: Readonly<Record<string, string>> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' };
const ENTITY_TEXT: Readonly<Record<string, string>> = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"' };
const SAFE_URL = /^(?:https?:|mailto:|#|\/(?!\/)|\.)/iu;
const EXTERNAL_URL = /^https?:/iu;

const PLACEHOLDER = '\uE000';
const PLACEHOLDER_PATTERN = /\uE000(\d+)\uE000/gu;
const MAX_NESTING = 16;

const URL_PART = String.raw`((?:[^\s()\uE000]|\([^\s()\uE000]*\))+)(?:\s+&quot;(.*?)&quot;)?`;
const HARD_BREAK = /(?: {2,}|\\)\n/gu;
const CODE_SPAN = /`([^`]+)`/gu;
const BACKSLASH_ESCAPE = /\\([\\`*_{}[\]()#+\-.!~|<>])/gu;
const ANGLE_AUTOLINK = /<((?:https?:\/\/|mailto:)[^\s<>]+)>/giu;
const IMAGE = new RegExp(String.raw`!\[([^\]]*)\]\(${URL_PART}\)`, 'gu');
const INLINE_LINK = new RegExp(String.raw`\[((?:[^[\]]|\[[^\]]*\])*)\]\(${URL_PART}\)`, 'gu');
const REFERENCE_LINK = /\[((?:[^[\]]|\[[^\]]*\])+)\]\[([^\]]*)\]/gu;
const SHORTCUT_REFERENCE = /\[([^[\]]+)\](?![([])/gu;
const BARE_URL = /(^|[\s(])(https?:\/\/(?:(?!&quot;|&lt;|&gt;)[^\s\uE000])+)/giu;
const TRAILING_PUNCTUATION = /[.,:;!?)\]]+$/u;

const FENCE = /^\s*(```|~~~)\s*([\w+-]*)/u;
const HEADING = /^ {0,3}(#{1,6})\s+(.*?)(?:\s+#+)?\s*$/u;
const RULE = /^ {0,3}([-*_])(?:\s*\1){2,}\s*$/u;
const SETEXT_UNDERLINE = /^ {0,3}(=+|-+)\s*$/u;
const LIST_ITEM = /^(\s*)([-*+]|\d{1,9}[.)])\s+(.*)$/u;
const QUOTE = /^ {0,3}>/u;
const TABLE_ROW = /^\s*\|/u;
const TABLE_SEPARATOR = /^\|?\s*:?-+/u;
const REFERENCE_DEFINITION = /^ {0,3}\[([^\]]+)\]:\s*(\S+)(?:\s+(?:"([^"]*)"|'([^']*)'))?\s*$/u;
const TASK_ITEM = /^\[( |x)\]\s+(.*)/isu;
const BLOCK_STARTS = [HEADING, FENCE, RULE, LIST_ITEM, QUOTE, TABLE_ROW];

type Alignment = 'left' | 'center' | 'right';

interface LinkTarget {
  url: string;
  title?: string | undefined;
}

interface Context {
  references: ReadonlyMap<string, LinkTarget>;
  headingIds: Map<string, number>;
}

const escapeHtml = (text: string): string => text.replace(/[&<>"]/gu, (char) => ESCAPES[char] ?? char);

const safeUrl = (url: string): string => (SAFE_URL.test(url) && !url.includes(PLACEHOLDER) ? url : '#');

const startsBlock = (line: string): boolean => BLOCK_STARTS.some((pattern) => pattern.test(line));

const referenceKey = (label: string): string => label.trim().replace(/\s+/gu, ' ').toLowerCase();

const indentOf = (line: string): number => line.length - line.trimStart().length;

/** Holds already-rendered HTML fragments out of reach of later inline rules, which only ever see their placeholders. */
const createStash = () => {
  const fragments: string[] = [];
  return {
    put: (html: string): string => `${PLACEHOLDER}${fragments.push(html) - 1}${PLACEHOLDER}`,
    restore: (text: string): string => {
      let restored = text;
      for (let pass = 0; pass <= fragments.length && restored.includes(PLACEHOLDER); pass++) {
        restored = restored.replace(PLACEHOLDER_PATTERN, (_match, index: string) => fragments[Number(index)] ?? '');
      }
      return restored;
    },
  };
};

const emphasize = (text: string): string =>
  text
    .replace(/\*\*\*(?=\S)([\s\S]*?\S)\*\*\*/gu, '<strong><em>$1</em></strong>')
    .replace(/\*\*(?=\S)([\s\S]*?\S)\*\*/gu, '<strong>$1</strong>')
    .replace(/(^|[^\p{L}\p{N}_])__(?=\S)([\s\S]*?\S)__(?![\p{L}\p{N}_])/gu, '$1<strong>$2</strong>')
    .replace(/\*(?=[^\s*])([\s\S]*?[^\s*])\*/gu, '<em>$1</em>')
    .replace(/(^|[^\p{L}\p{N}_])_(?=[^\s_])([\s\S]*?[^\s_])_(?![\p{L}\p{N}_])/gu, '$1<em>$2</em>')
    .replace(/~~(?=\S)([\s\S]*?\S)~~/gu, '<del>$1</del>');

const stripUrlBrackets = (url: string): string => url.replace(/^&lt;(.*)&gt;$/u, '$1');

const renderInline = (source: string, references: ReadonlyMap<string, LinkTarget>): string => {
  const stash = createStash();
  const plain = (text: string) => stash.restore(text).replace(/<[^>]+>/gu, '');
  const link = (url: string, label: string, title?: string): string => {
    const href = safeUrl(url);
    const attributes = `${title ? ` title="${plain(title)}"` : ''}${EXTERNAL_URL.test(href) ? ' target="_blank" rel="noreferrer"' : ''}`;
    return stash.put(`<a href="${href}"${attributes}>${label}</a>`);
  };
  const linkToReference = (match: string, label: string, key: string): string => {
    const target = references.get(referenceKey(key));
    return target ? link(escapeHtml(target.url), emphasize(label), target.title && escapeHtml(target.title)) : match;
  };

  let text = source.replaceAll(PLACEHOLDER, '');
  text = text.replace(HARD_BREAK, () => stash.put('<br>'));
  text = text.replace(CODE_SPAN, (_match, code: string) => stash.put(`<code>${escapeHtml(code)}</code>`));
  text = text.replace(BACKSLASH_ESCAPE, (_match, char: string) => stash.put(escapeHtml(char)));
  text = text.replace(ANGLE_AUTOLINK, (_match, url: string) => link(escapeHtml(url), escapeHtml(url)));
  text = escapeHtml(text);

  text = text.replace(IMAGE, (_match, alt: string, url: string, title?: string) => {
    const caption = title ? ` title="${plain(title)}"` : '';
    return stash.put(`<img src="${safeUrl(stripUrlBrackets(url))}" alt="${plain(alt)}"${caption} loading="lazy">`);
  });
  text = text.replace(INLINE_LINK, (_match, label: string, url: string, title?: string) =>
    link(stripUrlBrackets(url), emphasize(label), title),
  );
  text = text.replace(REFERENCE_LINK, (match, label: string, key: string) =>
    linkToReference(match, label, key || label),
  );
  text = text.replace(SHORTCUT_REFERENCE, (match, label: string) => linkToReference(match, label, label));
  text = text.replace(BARE_URL, (_match, lead: string, url: string) => {
    const trailing = TRAILING_PUNCTUATION.exec(url)?.[0] ?? '';
    const target = url.slice(0, url.length - trailing.length);
    return `${lead}${link(target, target)}${trailing}`;
  });

  return stash.restore(emphasize(text).replaceAll('\n', ' '));
};

const decodeEntities = (text: string): string =>
  text.replace(/&(?:amp|lt|gt|quot);/gu, (entity) => ENTITY_TEXT[entity] ?? entity);

const uniqueHeadingId = (html: string, ids: Map<string, number>): string => {
  const base = decodeEntities(html.replace(/<[^>]+>/gu, ''))
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/gu, '');
  if (!base) return '';
  const seen = ids.get(base) ?? 0;
  ids.set(base, seen + 1);
  return seen === 0 ? base : `${base}-${seen}`;
};

const renderHeading = (level: number, text: string, context: Context): string => {
  const html = renderInline(text, context.references);
  const id = uniqueHeadingId(html, context.headingIds);
  return `<h${level}${id ? ` id="${id}"` : ''}>${html}</h${level}>`;
};

const tableCells = (row: string): string[] =>
  row
    .trim()
    .replace(/^\||\|$/gu, '')
    .split(/(?<!\\)\|/u)
    .map((cell) => cell.trim().replaceAll('\\|', '|'));

const columnAlignment = (cell: string): Alignment => {
  if (!cell.endsWith(':')) return 'left';
  return cell.startsWith(':') ? 'center' : 'right';
};

const renderTableRow = (
  tag: 'th' | 'td',
  cells: readonly string[],
  alignments: readonly Alignment[],
  context: Context,
): string =>
  `<tr>${cells.map((cell, index) => `<${tag} style="text-align:${alignments[index] ?? 'left'}">${renderInline(cell, context.references)}</${tag}>`).join('')}</tr>`;

const renderListItem = (text: string, nested: string[], context: Context, depth: number): string => {
  const task = TASK_ITEM.exec(text);
  const body = renderInline(task?.[2] ?? text, context.references);
  const blocks = parseBlocks(nested, context, depth + 1);
  if (!task) return `<li>${body}${blocks}</li>`;
  const done = task[1] !== ' ';
  const check = `<span class="vui-prose__check${done ? ' vui-prose__check--on' : ''}" aria-hidden="true"></span>`;
  const label = `<span${done ? ' class="vui-prose__done"' : ''}>${body}</span>`;
  return `<li class="vui-prose__task"><span class="vui-prose__row">${check}${label}</span>${blocks}</li>`;
};

/** Removes the indentation shared by all non-blank lines. */
const dedent = (lines: readonly string[]): string[] => {
  const margin = Math.min(...lines.filter((line) => line.trim()).map(indentOf));
  return lines.map((line) => line.slice(Number.isFinite(margin) ? Math.min(margin, indentOf(line)) : 0));
};

/** Reads the list starting at `start`; returns its HTML and the index of the first line that is not part of it. */
const parseList = (lines: readonly string[], start: number, context: Context, depth: number): [string, number] => {
  const first = LIST_ITEM.exec(lines[start] ?? '');
  const base = first?.[1]?.length ?? 0;
  const ordered = /^\d/u.test(first?.[2] ?? '');
  const firstNumber = ordered ? Number.parseInt(first?.[2] ?? '1', 10) : 1;
  const items: string[] = [];
  let i = start;

  while (i < lines.length) {
    const marker = LIST_ITEM.exec(lines[i] ?? '');
    if (!marker || (marker[1]?.length ?? 0) !== base || /^\d/u.test(marker[2] ?? '') !== ordered) break;
    const children: string[] = [];
    i++;
    while (i < lines.length) {
      const line = lines[i] ?? '';
      if (line.trim()) {
        if (indentOf(line) <= base) break;
        children.push(line);
        i++;
        continue;
      }
      let next = i + 1;
      while (next < lines.length && !(lines[next] ?? '').trim()) next++;
      const following = lines[next];
      if (following === undefined || indentOf(following) <= base) break;
      children.push(...lines.slice(i, next));
      i = next;
    }
    const nested = dedent(children);
    let continued = 0;
    while (continued < nested.length && (nested[continued] ?? '').trim() && !startsBlock(nested[continued] ?? ''))
      continued++;
    const ownText = [marker[3] ?? '', ...nested.slice(0, continued)].join('\n');
    items.push(renderListItem(ownText, nested.slice(continued), context, depth));
  }

  const tag = ordered ? 'ol' : 'ul';
  const startAttribute = ordered && firstNumber !== 1 ? ` start="${firstNumber}"` : '';
  return [`<${tag}${startAttribute}>${items.join('')}</${tag}>`, i];
};

const parseBlocks = (lines: string[], context: Context, depth: number): string => {
  if (depth > MAX_NESTING) return lines.length ? `<p>${escapeHtml(lines.join(' '))}</p>` : '';
  const out: string[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i] ?? '';
    if (!line.trim()) {
      i++;
      continue;
    }

    const fence = FENCE.exec(line);
    if (fence) {
      const marker = fence[1] ?? '```';
      const buffer: string[] = [];
      i++;
      while (i < lines.length && !(lines[i] ?? '').trimStart().startsWith(marker)) buffer.push(lines[i++] ?? '');
      i++;
      out.push(`<pre data-lang="${escapeHtml(fence[2] ?? '')}"><code>${escapeHtml(buffer.join('\n'))}</code></pre>`);
      continue;
    }

    const heading = HEADING.exec(line);
    if (heading) {
      out.push(renderHeading((heading[1] ?? '#').length, heading[2] ?? '', context));
      i++;
      continue;
    }

    if (RULE.test(line)) {
      out.push('<hr>');
      i++;
      continue;
    }

    if (QUOTE.test(line)) {
      const buffer: string[] = [];
      while (i < lines.length && QUOTE.test(lines[i] ?? ''))
        buffer.push((lines[i++] ?? '').replace(/^ {0,3}>\s?/u, ''));
      out.push(`<blockquote>${parseBlocks(buffer, context, depth + 1)}</blockquote>`);
      continue;
    }

    const separator = lines[i + 1];
    if (TABLE_ROW.test(line) && separator && TABLE_SEPARATOR.test(separator.trim())) {
      const head = tableCells(line);
      const alignments = tableCells(separator).map(columnAlignment);
      i += 2;
      const rows: string[][] = [];
      while (i < lines.length && TABLE_ROW.test(lines[i] ?? '')) rows.push(tableCells(lines[i++] ?? ''));
      const body = rows.map((cells) => renderTableRow('td', cells, alignments, context)).join('');
      out.push(
        `<div class="vui-prose__table"><table><thead>${renderTableRow('th', head, alignments, context)}</thead><tbody>${body}</tbody></table></div>`,
      );
      continue;
    }

    if (LIST_ITEM.test(line)) {
      const [html, next] = parseList(lines, i, context, depth);
      out.push(html);
      i = next;
      continue;
    }

    const paragraph = [line];
    i++;
    let setextLevel = 0;
    while (i < lines.length && (lines[i] ?? '').trim()) {
      const next = lines[i] ?? '';
      const underline = SETEXT_UNDERLINE.exec(next);
      if (underline) {
        setextLevel = underline[1]?.startsWith('=') ? 1 : 2;
        i++;
        break;
      }
      if (startsBlock(next)) break;
      paragraph.push(next);
      i++;
    }
    out.push(
      setextLevel
        ? renderHeading(setextLevel, paragraph.join(' '), context)
        : `<p>${renderInline(paragraph.join('\n'), context.references)}</p>`,
    );
  }
  return out.join('');
};

/** Splits reference definitions (`[id]: url "title"`) from the document, ignoring fenced code. */
const extractReferences = (lines: readonly string[]): { references: Map<string, LinkTarget>; content: string[] } => {
  const references = new Map<string, LinkTarget>();
  const content: string[] = [];
  let fenced = false;
  for (const line of lines) {
    if (FENCE.test(line)) fenced = !fenced;
    const definition = fenced ? null : REFERENCE_DEFINITION.exec(line);
    if (!definition) {
      content.push(line);
      continue;
    }
    const title = definition[3] ?? definition[4];
    references.set(referenceKey(definition[1] ?? ''), { url: (definition[2] ?? '').replace(/^<(.*)>$/u, '$1'), title });
  }
  return { references, content };
};

/**
 * Renders Markdown to an HTML string: headings (ATX and setext, unique ids), paragraphs with hard breaks, bold / italic / strike,
 * inline code, inline and reference links, autolinks, images, nested ordered / unordered / task lists, blockquotes, fenced code, tables, rules.
 * Raw HTML in the source is escaped; only http(s), mailto, anchor and relative URLs survive.
 */
export const renderMarkdown = (source = ''): string => {
  const lines = source.replace(/\r\n?/gu, '\n').replaceAll('\t', '    ').split('\n');
  const { references, content } = extractReferences(lines);
  return parseBlocks(content, { references, headingIds: new Map() }, 0);
};
