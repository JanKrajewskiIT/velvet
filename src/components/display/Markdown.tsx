import { createMemo, mergeProps } from 'solid-js';

import { cx, modifier } from '../../utils/cx';
import { renderMarkdown } from './renderMarkdown';

export type MarkdownSize = 'sm' | 'md' | 'lg';

/**
 * Renders a Markdown string as Velvet-styled prose: headings (ATX and setext, with unique ids for Anchor), paragraphs with hard breaks,
 * bold/italic/strike, inline code, inline and reference links, autolinks, images, nested and task lists, blockquotes, fenced code, tables, rules.
 * HTML in the source is escaped and only http(s)/mailto/relative URLs are kept — safe for user or AI content.
 * The `.vui-prose` class can also wrap hand-written HTML.
 */
export interface MarkdownProps {
  source?: string;
  /** Alternative to `source`. */
  children?: string;
  /** sm for comments/cards, lg for articles. @default 'md' */
  size?: MarkdownSize;
  class?: string;
}

export const Markdown = (props: MarkdownProps) => {
  const merged = mergeProps({ size: 'md' } satisfies MarkdownProps, props);
  const html = createMemo(() =>
    renderMarkdown(merged.source ?? (typeof merged.children === 'string' ? merged.children : '')),
  );
  // eslint-disable-next-line solid/no-innerhtml -- renderMarkdown escapes source HTML and allows only http(s)/mailto/relative URLs
  return <div class={cx('vui-prose', modifier('vui-prose', merged.size, 'md'), merged.class)} innerHTML={html()} />;
};
