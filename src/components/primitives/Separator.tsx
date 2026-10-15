import { mergeProps, Show, splitProps } from 'solid-js';

import { variantClass } from '../../utils/cssModule';
import { cx } from '../../utils/cx';
import type { HtmlProps } from '../../utils/polymorphic';
import styles from './Separator.module.css';

const SEP_CLASSES = {
  line: styles.sepVariantLine,
  vertical: styles.sepVariantVertical,
  horizontal: styles.sepVariantHorizontal,
  dash: styles.sepVariantDash,
  text: styles.sepVariantText,
} as const;

export interface SeparatorProps extends HtmlProps<HTMLSpanElement> {
  /** line = 1px rule · dash = short 10×2 bar · text = glyph in `--fg-tertiary`. @default 'line' */
  variant?: 'line' | 'dash' | 'text';
  /** Only for `line`. @default 'vertical' */
  orientation?: 'vertical' | 'horizontal';
  /** Expose `role="separator"` (toolbars, menus). Otherwise `aria-hidden`. */
  semantic?: boolean;
}

/** Inline separator between siblings in a row. For block-level section breaks use Divider. */
export const Separator = (props: SeparatorProps) => {
  const merged = mergeProps({ variant: 'line', orientation: 'vertical' } satisfies SeparatorProps, props);
  const [local, rest] = splitProps(merged, ['variant', 'orientation', 'semantic', 'class', 'children']);
  return (
    <span
      class={cx(
        styles.sep,
        variantClass(SEP_CLASSES, local.variant),
        local.variant === 'line' && variantClass(SEP_CLASSES, local.orientation),
        local.class,
      )}
      role={local.semantic ? 'separator' : undefined}
      aria-orientation={local.semantic ? local.orientation : undefined}
      aria-hidden={local.semantic ? undefined : true}
      {...rest}
    >
      <Show when={local.variant === 'text'}>{local.children ?? '/'}</Show>
    </span>
  );
};
