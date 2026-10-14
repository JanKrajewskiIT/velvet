/** Token kinds map to the `tk-*` classes of the code surface. */
type TokenKind = 'c' | 's' | 'k' | 'n' | 't' | 'p';

export interface HighlightToken {
  /** Absent for plain text. */
  kind?: TokenKind;
  text: string;
}

interface HighlightRule {
  pattern: RegExp;
  kind: TokenKind;
  /** The token is the match's capture group (the tag name after `<` / `</`); the rest of the match stays plain. */
  capture?: boolean;
}

const SHELL_LANGUAGES = ['bash', 'sh'];

const SHELL_RULES: HighlightRule[] = [
  { pattern: /^\$ /gu, kind: 'p' },
  { pattern: /#.*/gu, kind: 'c' },
];

const CODE_RULES: HighlightRule[] = [
  { pattern: /\/\/.*|\/\*[\s\S]*?\*\/|<!--[\s\S]*?-->/gu, kind: 'c' },
  { pattern: /"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`/gu, kind: 's' },
  {
    pattern:
      /\b(?:import|from|export|default|const|let|var|function|return|if|else|for|while|class|extends|new|await|async|try|catch|throw|typeof|interface|type|true|false|null|undefined)\b/gu,
    kind: 'k',
  },
  { pattern: /\b\d+(?:\.\d+)?\b/gu, kind: 'n' },
  { pattern: /<\/?([A-Za-z][\w.-]*)/gu, kind: 't', capture: true },
];

interface RuleMatch {
  start: number;
  end: number;
  /** Where the coloured part begins (after the plain `<` of a tag). */
  tokenStart: number;
  kind: TokenKind;
}

const firstMatchFrom = (line: string, from: number, rules: HighlightRule[]): RuleMatch | undefined => {
  let best: RuleMatch | undefined;
  for (const rule of rules) {
    rule.pattern.lastIndex = from;
    const match = rule.pattern.exec(line);
    if (!match || (best && match.index >= best.start)) continue;
    const name = rule.capture ? match[1] : undefined;
    best = {
      start: match.index,
      end: match.index + match[0].length,
      tokenStart: name === undefined ? match.index : match.index + match[0].length - name.length,
      kind: rule.kind,
    };
  }
  return best;
};

/**
 * Splits one line of code into plain and coloured tokens in a single left-to-right pass,
 * so a later rule never recolours text an earlier token already owns (a `//` inside a string stays a string).
 * Output is data, not markup — nothing here needs escaping or `innerHTML`.
 */
export const highlight = (line: string, language: string): HighlightToken[] => {
  const rules = SHELL_LANGUAGES.includes(language) ? SHELL_RULES : CODE_RULES;
  const tokens: HighlightToken[] = [];
  let position = 0;
  while (position < line.length) {
    const match = firstMatchFrom(line, position, rules);
    if (!match) break;
    if (match.tokenStart > position) tokens.push({ text: line.slice(position, match.tokenStart) });
    tokens.push({ kind: match.kind, text: line.slice(match.tokenStart, match.end) });
    position = match.end;
  }
  if (position < line.length) tokens.push({ text: line.slice(position) });
  return tokens;
};
