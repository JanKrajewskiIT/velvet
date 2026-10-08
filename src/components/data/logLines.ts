export const LOG_LEVELS = ['debug', 'info', 'warn', 'error'] as const;

export type LogLevel = (typeof LOG_LEVELS)[number];

export interface LogLine {
  message: string;
  level?: LogLevel;
  /** Date, epoch ms or preformatted string. */
  ts?: Date | number | string;
  /** Service / module. */
  source?: string;
}

/** A normalised line: level resolved, `index` is its position in the input. */
export interface LogRow extends LogLine {
  level: LogLevel;
  index: number;
}

export interface TextPart {
  text: string;
  match: boolean;
}

const LEVEL_PATTERN = /\b(ERROR|ERR|FATAL|WARN(?:ING)?|INFO|DEBUG|TRACE)\b/iu;
const REGEXP_SPECIALS = /[.*+?^${}()|[\]\\]/gu;
const TIME_FORMAT = new Intl.DateTimeFormat('en-GB', {
  hour12: false,
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
});

export const detectLevel = (message: string): LogLevel => {
  const keyword = LEVEL_PATTERN.exec(message)?.[1]?.toUpperCase();
  if (!keyword) return 'info';
  if (keyword.startsWith('ERR') || keyword === 'FATAL') return 'error';
  if (keyword.startsWith('WARN')) return 'warn';
  return keyword === 'INFO' ? 'info' : 'debug';
};

export const toLogRows = (lines: ReadonlyArray<string | LogLine>): LogRow[] =>
  lines.map((line, index) =>
    typeof line === 'string'
      ? { message: line, level: detectLevel(line), index }
      : { ...line, level: line.level ?? detectLevel(line.message), index },
  );

export const formatLogTimestamp = (ts: Date | number | string): string => {
  if (typeof ts === 'string') return ts;
  const date = new Date(ts);
  return `${TIME_FORMAT.format(date)}.${String(date.getMilliseconds()).padStart(3, '0')}`;
};

/** Splits `text` into runs, flagging the case-insensitive occurrences of `query`. */
export const splitByQuery = (text: string, query: string): TextPart[] => {
  if (!query) return [{ text, match: false }];
  const pattern = new RegExp(`(${query.replace(REGEXP_SPECIALS, '\\$&')})`, 'giu');
  return text.split(pattern).map((part, k) => ({ text: part, match: k % 2 === 1 }));
};
