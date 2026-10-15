import { type JSX, mergeProps, Show, splitProps } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { variantClass } from '../../utils/cssModule';
import { cx } from '../../utils/cx';
import { Glyph } from '../primitives/Glyph';
import { VisuallyHidden } from '../primitives/VisuallyHidden';
import styles from './Link.module.css';

const LINK_CLASSES = {
  plain: styles.linkVariantPlain,
  quiet: styles.linkVariantQuiet,
  standalone: styles.linkVariantStandalone,
  disabled: styles.linkVariantDisabled,
} as const;

export type LinkVariant = 'default' | 'plain' | 'quiet';

export interface LinkProps extends JSX.AnchorHTMLAttributes<HTMLAnchorElement> {
  href?: string;
  /** default — faint underline, solid on hover (prose) · plain — underline on hover only (UI) · quiet — secondary text colour (meta, footers). @default 'default' */
  variant?: LinkVariant;
  /** Semibold, no underline, trailing arrow that nudges on hover. "View all", "Read more". */
  standalone?: boolean;
  /** Opens in a new tab, adds external-link icon + screen-reader hint */
  external?: boolean;
  /** Renders without href, aria-disabled, not focusable */
  disabled?: boolean;
  /** Screen-reader hint for external links. @default localized "(opens in new tab)" */
  externalLabel?: string;
}

/**
 * Text link on --fg-link. Inline in prose or standalone as a call-to-action.
 * For navigation lists use Anchor / Breadcrumb / Tabs; for actions that don't navigate use Button variant="ghost".
 */
export const Link = (props: LinkProps) => {
  const merged = mergeProps({ variant: 'default' } satisfies Partial<LinkProps>, props);
  const [local, rest] = splitProps(merged, [
    'href',
    'variant',
    'standalone',
    'external',
    'disabled',
    'externalLabel',
    'class',
    'children',
  ]);
  const translate = useTranslate();
  return (
    <a
      {...rest}
      href={local.disabled ? undefined : local.href}
      target={local.external ? '_blank' : rest.target}
      rel={local.external ? 'noopener noreferrer' : rest.rel}
      aria-disabled={local.disabled || undefined}
      tabIndex={local.disabled ? -1 : rest.tabIndex}
      class={cx(
        styles.link,
        variantClass(LINK_CLASSES, local.variant, 'default'),
        local.standalone && styles.linkVariantStandalone,
        local.disabled && styles.linkVariantDisabled,
        local.class,
      )}
    >
      {local.children}
      <Show when={local.external}>
        <Glyph name="external-link" class={styles.linkPartIcon} />
        <VisuallyHidden> {local.externalLabel ?? translate('velvet.navigation.link.externalLabel')}</VisuallyHidden>
      </Show>
      <Show when={local.standalone && !local.external}>
        <Glyph name="arrow-right" class={cx(styles.linkPartIcon, styles.linkPartArrow)} />
      </Show>
    </a>
  );
};
