import { type JSX, mergeProps, Show, splitProps } from 'solid-js';

import { variantClass } from '../../utils/cssModule';
import { cx } from '../../utils/cx';
import { type ElementTag, type HtmlProps, Polymorphic } from '../../utils/polymorphic';
import { renderIcon } from './Glyph';
import styles from './SectionLabel.module.css';
import { Text } from './Text';
import { typographyClass } from './typography';

const SECTION_LABEL_CLASSES = {
  secondary: styles.sectionLabelVariantSecondary,
  brand: styles.sectionLabelVariantBrand,
  sticky: styles.sectionLabelVariantSticky,
} as const;

export interface SectionLabelProps extends HtmlProps<HTMLElement> {
  /** @default 'div' */
  as?: ElementTag;
  /** Leading glyph name or node. */
  icon?: JSX.Element;
  /** Trailing slot — count, "Clear" link, action. */
  end?: JSX.Element;
  /** Default is tertiary. */
  tone?: 'secondary' | 'brand';
  /** Sticks to the top of a scrolling list with a frosted ground. */
  sticky?: boolean;
}

/** Uppercase group heading inside menus, listboxes, sidebars, filter bars and panels. */
export const SectionLabel = (props: SectionLabelProps) => {
  const merged = mergeProps({ as: 'div' } satisfies SectionLabelProps, props);
  const [local, rest] = splitProps(merged, ['as', 'icon', 'end', 'tone', 'sticky', 'class', 'children']);
  return (
    <Polymorphic
      {...rest}
      tag={local.as}
      class={cx(
        typographyClass('section'),
        styles.sectionLabel,
        local.tone && variantClass(SECTION_LABEL_CLASSES, local.tone),
        local.sticky && styles.sectionLabelVariantSticky,
        local.class,
      )}
    >
      {renderIcon(local.icon)}
      <Text as="span" variant="section" tone="inherit" class={styles.sectionLabelPartText}>
        {local.children}
      </Text>
      <Show when={local.end != null}>
        <Text as="span" variant="label-sm" tone="inherit" class={styles.sectionLabelPartEnd}>
          {local.end}
        </Text>
      </Show>
    </Polymorphic>
  );
};
