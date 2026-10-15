import { type JSX, mergeProps, Show, splitProps } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { variantClass } from '../../utils/cssModule';
import { cx } from '../../utils/cx';
import { type HtmlProps, Polymorphic } from '../../utils/polymorphic';
import type { Tone } from '../../utils/tone';
import { CloseButton } from '../primitives/CloseButton';
import { renderIcon } from '../primitives/Glyph';
import { typographyClass } from '../primitives/typography';
import styles from './Tag.module.css';

const TAG_CLASSES = {
  sm: styles.tagVariantSm,
  selectable: styles.tagVariantSelectable,
  selected: styles.tagVariantSelected,
  disabled: styles.tagVariantDisabled,
  pill: styles.tagVariantPill,
  soft: styles.tagVariantSoft,
  dashed: styles.tagVariantDashed,
} as const;

export type TagVariant = 'outline' | 'soft' | 'dashed';

export interface TagProps extends HtmlProps<HTMLElement, 'onClick'> {
  icon?: JSX.Element;
  /** Selected (filter on) — only meaningful with `onClick`. */
  selected?: boolean;
  /** Makes the tag a toggle button. */
  onClick?: (e: MouseEvent) => void;
  /** Shows a remove (×) affordance. */
  onRemove?: (e: MouseEvent | KeyboardEvent) => void;
  /** Accessible name of the remove control. @default localized "Remove" + children (when a string) */
  removeLabel?: string;
  /** Dims the tag and disables the remove control / click. */
  disabled?: boolean;
  /** @default 'md' */
  size?: 'sm' | 'md';
  /** outline = hairline on raised (filters) · soft = tinted fill from tone (keyword hits, statuses) · dashed = missing / placeholder. @default 'outline' */
  variant?: TagVariant;
  /** Colour for soft / outline (status or label hue). */
  tone?: Tone;
  /** pill = fully rounded (keyword chips, comparison chips). @default 'rounded' */
  shape?: 'rounded' | 'pill';
}

/** Chip for filters, categories and removable selections. */
export const Tag = (props: TagProps) => {
  const merged = mergeProps(
    { disabled: false, size: 'md', variant: 'outline', shape: 'rounded' } satisfies TagProps,
    props,
  );
  const translate = useTranslate();
  const [local, rest] = splitProps(merged, [
    'icon',
    'selected',
    'onClick',
    'onRemove',
    'removeLabel',
    'disabled',
    'size',
    'variant',
    'tone',
    'shape',
    'class',
    'children',
  ]);
  const selectable = () => !!local.onClick;
  const removeLabel = () =>
    local.removeLabel ??
    (typeof local.children === 'string'
      ? translate('velvet.display.tag.removeItem', { name: local.children })
      : translate('velvet.common.remove'));
  return (
    <Polymorphic
      {...rest}
      tag={selectable() ? 'button' : 'span'}
      type={selectable() ? 'button' : undefined}
      onClick={local.onClick}
      aria-pressed={selectable() ? !!local.selected : undefined}
      data-tone={local.tone}
      class={cx(
        typographyClass(local.size === 'sm' ? 'label-sm' : 'button-sm'),
        styles.tag,
        local.size === 'sm' && styles.tagVariantSm,
        variantClass(TAG_CLASSES, local.variant, 'outline'),
        local.shape === 'pill' && styles.tagVariantPill,
        selectable() && styles.tagVariantSelectable,
        local.selected && styles.tagVariantSelected,
        local.disabled && styles.tagVariantDisabled,
        local.class,
      )}
      disabled={selectable() ? local.disabled : undefined}
      aria-disabled={!selectable() && local.disabled ? true : undefined}
    >
      {renderIcon(local.icon)}
      {local.children}
      <Show when={local.onRemove}>
        <CloseButton as="span" variant="tag" disabled={local.disabled} label={removeLabel()} onClick={local.onRemove} />
      </Show>
    </Polymorphic>
  );
};
