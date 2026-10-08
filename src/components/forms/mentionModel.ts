export interface MentionOption {
  id?: string;
  label: string;
  description?: string;
  /** Avatar image, used for people (`@`). */
  src?: string;
  /** Glyph name for tags and custom triggers. @default 'tag' */
  icon?: string;
}

/** Suggestions per trigger character, e.g. `{ '@': people, '#': tags }`. */
export type MentionSources = Readonly<Record<string, ReadonlyArray<MentionOption>>>;

export interface MentionQuery {
  trigger: string;
  /** Text typed after the trigger. */
  text: string;
  /** Index of the trigger character. */
  start: number;
}

export type MentionQueryDetector = (text: string, caret: number) => MentionQuery | undefined;

const MAX_QUERY_LENGTH = 30;

const escapePattern = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&');
const escapeClassChars = (text: string) => text.replace(/[\]\\^-]/gu, '\\$&');

/** Finds an open `<trigger><query>` run that ends at the caret and starts the text or follows whitespace. */
export const createQueryDetector = (triggers: ReadonlyArray<string>): MentionQueryDetector => {
  if (triggers.length === 0) return () => undefined;
  const chars = triggers.map(escapeClassChars).join('');
  const pattern = new RegExp(`(?:^|\\s)([${chars}])([^\\s${chars}]{0,${MAX_QUERY_LENGTH}})$`, 'u');
  return (text, caret) => {
    const match = text.slice(0, caret).match(pattern);
    const trigger = match?.[1];
    const typed = match?.[2];
    return trigger !== undefined && typed !== undefined
      ? { trigger, text: typed, start: caret - typed.length - 1 }
      : undefined;
  };
};

export const filterMentions = (
  options: ReadonlyArray<MentionOption>,
  query: string,
  limit: number,
): MentionOption[] => {
  const needle = query.toLowerCase();
  return options
    .filter((option) => `${option.label} ${option.description ?? ''}`.toLowerCase().includes(needle))
    .slice(0, limit);
};

/** Matches every known `<trigger><label>` (longest first). Splitting on it puts the mentions at odd indexes. */
export const createMentionPattern = (sources: MentionSources): RegExp | undefined => {
  const known = Object.entries(sources)
    .flatMap(([trigger, options]) => options.map((option) => trigger + option.label))
    .sort((a, b) => b.length - a.length);
  return known.length ? new RegExp(`(${known.map(escapePattern).join('|')})(?![\\p{L}\\d])`, 'gu') : undefined;
};
