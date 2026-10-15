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
import styles from './Alert.module.css';
import { resolveAlertIcon } from './alertIcon';

const ALERT_CLASSES = {
  soft: styles.alertVariantSoft,
  info: styles.alertVariantInfo,
  success: styles.alertVariantSuccess,
  warning: styles.alertVariantWarning,
  danger: styles.alertVariantDanger,
  brand: styles.alertVariantBrand,
  neutral: styles.alertVariantNeutral,
  outline: styles.alertVariantOutline,
  solid: styles.alertVariantSolid,
} as const;

export interface AlertProps extends HtmlProps<HTMLDivElement, 'title' | 'onClose'> {
  /** @default 'info' */
  tone?: StatusTone;
  title?: JSX.Element;
  children?: JSX.Element;
  /** Buttons under the text. */
  action?: JSX.Element;
  onClose?: () => void;
  /** Icon name; `null` hides it. */
  icon?: string | null;
  /** soft = tinted fill · outline = border + raised surface · solid = strong fill. @default 'soft' */
  variant?: 'soft' | 'outline' | 'solid';
}

/** Inline message inside content — form errors, plan limits, contextual tips. danger/warning announce as `role="alert"`. */
export const Alert = (props: AlertProps) => {
  const merged = mergeProps({ tone: 'info', variant: 'soft' } satisfies AlertProps, props);
  const [local, rest] = splitProps(merged, [
    'tone',
    'title',
    'children',
    'action',
    'onClose',
    'icon',
    'variant',
    'class',
  ]);
  const translate = useTranslate();
  const title = children(() => local.title);
  const text = children(() => local.children);
  const action = children(() => local.action);
  const glyph = () => resolveAlertIcon(local.icon, local.tone);

  return (
    <div
      {...rest}
      role={local.tone === 'danger' || local.tone === 'warning' ? 'alert' : 'status'}
      class={cx(
        typographyClass('body-sm'),
        styles.alert,
        variantClass(ALERT_CLASSES, local.tone),
        variantClass(ALERT_CLASSES, local.variant),
        local.class,
      )}
    >
      <Show when={glyph()}>{(name) => <Glyph name={name()} class={styles.alertPartIcon} />}</Show>
      <div class={styles.alertPartBody}>
        <Show when={title()}>
          <Text as="div" variant="label" tone="inherit" class={styles.alertPartTitle}>
            {title()}
          </Text>
        </Show>
        <Show when={text()}>
          <Text as="div" variant="body-sm" tone="secondary" class={styles.alertPartText}>
            {text()}
          </Text>
        </Show>
        <Show when={action()}>
          <div class={styles.alertPartActions}>{action()}</div>
        </Show>
      </div>
      <Show when={local.onClose}>
        <CloseButton
          class={styles.alertPartClose}
          label={translate('velvet.common.dismiss')}
          onClick={() => local.onClose?.()}
        />
      </Show>
    </div>
  );
};
