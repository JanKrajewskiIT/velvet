import * as React from 'react';
/**
 * Streaming log tail on the code surface — line numbers, timestamps, level column, source, level toggles with counts, text filter with highlights, wrap toggle.
 * Follows new lines while scrolled to the bottom; scrolling up pauses and shows "N new" to jump back. Plain strings work — the level is detected from ERROR / WARN / INFO / DEBUG.
 */
export interface LogLine { message: string; level?: 'debug' | 'info' | 'warn' | 'error'; /** Date, epoch ms or preformatted string */ ts?: Date | number | string; /** Service / module */ source?: string }
export interface LogViewerProps {
  lines: Array<string | LogLine>;
  /** @default 'Logs' */
  title?: string;
  /** Body height. @default 320 */
  height?: number | string;
  /** Start pinned to the newest line. @default true */
  follow?: boolean;
  /** @default true */
  showTimestamps?: boolean;
  /** @default true */
  lineNumbers?: boolean;
  /** @default false */
  wrap?: boolean;
  /** Levels visible at start. @default all */
  levels?: Array<'debug' | 'info' | 'warn' | 'error'>;
  className?: string;
}
export declare function LogViewer(props: LogViewerProps): JSX.Element;
