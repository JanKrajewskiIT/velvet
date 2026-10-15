import { Index, mergeProps, splitProps } from 'solid-js';

import { cx } from '../../utils/cx';
import type { HtmlProps } from '../../utils/polymorphic';
import styles from './SkeletonText.module.css';

export interface SkeletonTextProps extends HtmlProps<HTMLSpanElement> {
  /** @default 3 */
  lines?: number;
  /** @default '60%' */
  lastWidth?: string;
  /** Space between lines in px. */
  gap?: number;
}

/** Paragraph placeholder — full-width lines, shorter last line. */
export const SkeletonText = (props: SkeletonTextProps) => {
  const merged = mergeProps({ lines: 3, lastWidth: '60%', gap: 8 } satisfies SkeletonTextProps, props);
  const [local, rest] = splitProps(merged, ['lines', 'lastWidth', 'gap', 'class', 'style']);
  const lines = () => Array.from({ length: local.lines }, (_, i) => i);
  const widthOf = (line: number) => (line === local.lines - 1 && local.lines > 1 ? local.lastWidth : '100%');
  return (
    <span
      {...rest}
      class={cx(styles.skeletonText, local.class)}
      style={{ gap: `${local.gap}px`, ...local.style }}
      aria-hidden="true"
    >
      <Index each={lines()}>{(line) => <span class={styles.skeleton} style={{ width: widthOf(line()) }} />}</Index>
    </span>
  );
};
