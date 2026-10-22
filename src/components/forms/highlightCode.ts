const KEYWORDS = new Set([
  'and',
  'or',
  'not',
  'if',
  'else',
  'elif',
  'when',
  'then',
  'def',
  'return',
  'import',
  'from',
  'in',
  'is',
  'true',
  'false',
  'True',
  'False',
  'None',
  'null',
  'for',
  'while',
  'let',
  'const',
]);
const TOKENS = /"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|(?:#|\/\/)[^\n]*|\b[A-Za-z_][\w.]*\b|-?\b\d+(?:\.\d+)?\b/gu;
const TOKEN_CLASSES = {
  key: 'tk-k',
  keyword: 'tk-w',
  string: 'tk-s',
  number: 'tk-n',
  comment: 'tk-c',
  function: 'tk-f',
  text: '',
} as const;

export interface CodeToken {
  text: string;
  kind: keyof typeof TOKEN_CLASSES;
}

export const tokenizeCode = (source: string): CodeToken[] => {
  const tokens: CodeToken[] = [];
  let end = 0;
  for (const match of source.matchAll(TOKENS)) {
    const index = match.index;
    const text = match[0];
    if (index > end) tokens.push({ kind: 'text', text: source.slice(end, index) });
    const before = source.slice(source.lastIndexOf('\n', index - 1) + 1, index);
    const after = source.slice(index + text.length);
    let kind: CodeToken['kind'] = 'text';
    if (text.startsWith('"') || text.startsWith("'")) kind = 'string';
    else if ((text.startsWith('#') || text.startsWith('//')) && (!before || /\s$/u.test(before))) kind = 'comment';
    else if (/^-?\d/u.test(text)) kind = 'number';
    else if (/^\s*-?\s*$/u.test(before) && /^\s*:(?:\s|$)/u.test(after)) kind = 'key';
    else if (KEYWORDS.has(text)) kind = 'keyword';
    else if (after.startsWith('(')) kind = 'function';
    tokens.push({ kind, text });
    end = index + text.length;
  }
  if (end < source.length) tokens.push({ kind: 'text', text: source.slice(end) });
  return tokens;
};

const escapeCode = (text: string) => text.replace(/&/gu, '&amp;').replace(/</gu, '&lt;').replace(/>/gu, '&gt;');

/** Only fixed token markup is emitted; source text is always escaped. */
export const highlightCode = (source: string): string =>
  tokenizeCode(source)
    .map((token) => {
      const text = escapeCode(token.text);
      const className = TOKEN_CLASSES[token.kind];
      return className ? `<span class="${className}">${text}</span>` : text;
    })
    .join('');
