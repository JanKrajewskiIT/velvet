import * as React from 'react';
/**
 * Renders a Markdown string as Velvet-styled prose: headings (with ids for Anchor), paragraphs, bold/italic/strike, inline code,
 * links (external open in a new tab), images, lists, task lists, blockquotes, fenced code, tables, rules.
 * HTML in the source is escaped and only http(s)/mailto/relative URLs are kept — safe for user or AI content.
 * The .vui-prose class can also wrap hand-written HTML.
 */
export interface MarkdownProps {
  source?: string;
  /** Alternative to source */
  children?: string;
  /** sm for comments/cards, lg for articles. @default 'md' */
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}
export declare function Markdown(props: MarkdownProps): JSX.Element;
/** The underlying renderer — returns an HTML string */
export declare function renderMarkdown(source: string): string;
