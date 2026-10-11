import * as React from 'react';
/**
 * Renders a Markdown string as Velvet-styled prose: ATX and setext headings (unique ids for Anchor: repeats get -1, -2…), paragraphs,
 * bold/italic (* and _)/strike, inline code, hard line breaks (two trailing spaces or \), links — inline, reference ([t][id], [t][], [id])
 * and autolinks (<url>, bare http(s)/www) — external ones open in a new tab, images, nested lists (ordered start kept), task lists
 * (inline formatting kept), blockquotes, fenced code, tables, rules.
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
