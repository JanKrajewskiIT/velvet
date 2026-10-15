import { type JSX, mergeProps, splitProps } from 'solid-js';

import { variantClass } from '../../utils/cssModule';
import { cx } from '../../utils/cx';
import type { HtmlProps } from '../../utils/polymorphic';
import styles from './Mark.module.css';

const MARK_CLASSES = {
  text: styles.markVariantText,
  mention: styles.markVariantMention,
} as const;

export type MarkVariant = 'highlight' | 'text' | 'mention';

export interface MarkProps extends HtmlProps<HTMLElement> {
  /** highlight: tinted fill · text: brand colour, no fill · mention: chip-like. @default 'highlight' */
  variant?: MarkVariant;
}

/** A highlighted run inside text: search hits, emphasis, @mentions. */
export const Mark = (props: MarkProps) => {
  const merged = mergeProps({ variant: 'highlight' } satisfies MarkProps, props);
  const [local, rest] = splitProps(merged, ['variant', 'class']);
  return (
    <mark {...rest} class={cx(styles.mark, variantClass(MARK_CLASSES, local.variant, 'highlight'), local.class)} />
  );
};

const DIACRITICS = /[̀-ͯ]/gu;
const fold = (char: string): string => char.normalize('NFD').replace(DIACRITICS, '').toLowerCase();

/** Wraps the first accent- and case-insensitive match of `query` in a Mark. */
export const highlightMatch = (
  text: string | number | null | undefined,
  query?: string,
  variant?: MarkVariant,
): JSX.Element => {
  if (text == null) return null;
  const source = String(text);
  if (!query) return source;

  const chars = Array.from(source);
  const origin: number[] = [];
  let haystack = '';
  chars.forEach((char, index) => {
    const folded = fold(char);
    for (let k = 0; k < folded.length; k++) origin.push(index);
    haystack += folded;
  });

  const needle = Array.from(query).map(fold).join('');
  const at = needle ? haystack.indexOf(needle) : -1;
  if (at < 0) return source;

  const from = origin[at] ?? 0;
  const to = (origin[at + needle.length - 1] ?? from) + 1;
  return (
    <>
      {chars.slice(0, from).join('')}
      <Mark variant={variant}>{chars.slice(from, to).join('')}</Mark>
      {chars.slice(to).join('')}
    </>
  );
};
