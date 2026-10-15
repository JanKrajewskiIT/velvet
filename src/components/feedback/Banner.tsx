import { children, type JSX, mergeProps, Show, splitProps } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { variantClass } from '../../utils/cssModule';
import { cx } from '../../utils/cx';
import type { HtmlProps } from '../../utils/polymorphic';
import type { StatusTone } from '../../utils/tone';
import { CloseButton } from '../primitives/CloseButton';
import { Glyph } from '../primitives/Glyph';
import { Text } from '../primitives/Text';
import { typographyClass } from '../primitives/typography';
import { resolveAlertIcon } from './alertIcon';
import styles from './Banner.module.css';

const BANNER_CLASSES = {
  sticky: styles.bannerVariantSticky,
  brand: styles.bannerVariantBrand,
  info: styles.bannerVariantInfo,
  success: styles.bannerVariantSuccess,
  danger: styles.bannerVariantDanger,
  neutral: styles.bannerVariantNeutral,
  warning: styles.bannerVariantWarning,
} as const;

export interface BannerProps extends HtmlProps<HTMLDivElement, 'onClose'> {
  /** @default 'brand' */
  tone?: StatusTone;
  children?: JSX.Element;
  action?: JSX.Element;
  onClose?: () => void;
  /** Icon name; `null` hides it. */
  icon?: string | null;
  sticky?: boolean;
}

/** Full-width strip at the top of the page/app — system status, trial ending, maintenance. One at a time. */
export const Banner = (props: BannerProps) => {
  const merged = mergeProps({ tone: 'brand' } satisfies BannerProps, props);
  const [local, rest] = splitProps(merged, ['tone', 'children', 'action', 'onClose', 'icon', 'sticky', 'class']);
  const translate = useTranslate();
  const action = children(() => local.action);
  const glyph = () => resolveAlertIcon(local.icon, local.tone);

  return (
    <div
      {...rest}
      role="region"
      aria-label={translate('velvet.feedback.banner.label')}
      class={cx(
        typographyClass('body-sm'),
        styles.banner,
        variantClass(BANNER_CLASSES, local.tone),
        local.sticky && styles.bannerVariantSticky,
        local.class,
      )}
    >
      <div class={styles.bannerPartInner}>
        <Show when={glyph()}>{(name) => <Glyph name={name()} />}</Show>
        <Text as="div" variant="body-sm" tone="inherit" class={styles.bannerPartText}>
          {local.children}
        </Text>
        <Show when={action()}>
          <div class={styles.bannerPartAction}>{action()}</div>
        </Show>
      </div>
      <Show when={local.onClose}>
        <CloseButton
          variant="bare"
          class={styles.bannerPartClose}
          label={translate('velvet.common.dismiss')}
          onClick={() => local.onClose?.()}
        />
      </Show>
    </div>
  );
};
