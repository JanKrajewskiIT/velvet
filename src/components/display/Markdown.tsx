import { createMemo, mergeProps } from 'solid-js';

import { variantClass } from '../../utils/cssModule';
import { cx } from '../../utils/cx';
import styles from './Markdown.module.css';
import { renderMarkdown } from './renderMarkdown';

const PROSE_CLASSES = {
  sm: styles.proseVariantSm,
  lg: styles.proseVariantLg,
} as const;

export type MarkdownSize = 'sm' | 'md' | 'lg';

/**
 * Renders a Markdown string as Velvet-styled prose: headings (ATX and setext, with unique ids for Anchor), paragraphs with hard breaks,
 * bold/italic/strike, inline code, inline and reference links, autolinks, images, nested and task lists, blockquotes, fenced code, tables, rules.
 * HTML in the source is escaped and only http(s)/mailto/relative URLs are kept — safe for user or AI content.
 * Pass HTML through the component to apply its scoped prose styles.
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
  return (
    // The renderer escapes source HTML and emits only its closed, safe tag and attribute set.
    // eslint-disable-next-line solid/no-innerhtml -- renderMarkdown guarantees safe generated markup.
    <div class={cx(styles.prose, variantClass(PROSE_CLASSES, merged.size, 'md'), merged.class)} innerHTML={html()} />
  );
};
