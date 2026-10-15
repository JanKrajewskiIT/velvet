import { type JSX, mergeProps, splitProps } from 'solid-js';

import { cx } from '../../utils/cx';
import type { HtmlProps } from '../../utils/polymorphic';
import styles from './EmptyText.module.css';
import { renderIcon } from './Glyph';
import { Text } from './Text';

export interface EmptyTextProps extends HtmlProps<HTMLElement> {
  /** Glyph name or node above the text. */
  icon?: JSX.Element;
  /** start = left-aligned, no inline padding (inside prose / timelines). @default 'center' */
  align?: 'center' | 'start';
  /** Dashed outline — for drop zones and empty editable lists. */
  dashed?: boolean;
  /** Element to render — `li` inside lists, `p` inside prose. @default 'div' */
  as?: 'div' | 'li' | 'p' | 'span';
}

/** One-line "nothing here" inside a list, panel or column. For a whole empty view use EmptyState. */
export const EmptyText = (props: EmptyTextProps) => {
  const merged = mergeProps({ align: 'center', as: 'div' } satisfies EmptyTextProps, props);
  const [local, rest] = splitProps(merged, ['icon', 'align', 'dashed', 'as', 'class', 'children']);
  return (
    <Text
      {...rest}
      as={local.as}
      variant="body-sm"
      tone="tertiary"
      class={cx(
        styles.emptyText,
        local.align === 'start' && styles.emptyTextVariantStart,
        local.dashed && styles.emptyTextVariantDashed,
        local.class,
      )}
    >
      {renderIcon(local.icon, styles.emptyTextPartIcon)}
      {local.children}
    </Text>
  );
};
