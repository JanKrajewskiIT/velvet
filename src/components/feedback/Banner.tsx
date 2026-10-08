import { children, type JSX, mergeProps, Show, splitProps } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import type { HtmlProps } from '../../utils/polymorphic';
import type { StatusTone } from '../../utils/tone';
import { CloseButton } from '../primitives/CloseButton';
import { Glyph } from '../primitives/Glyph';
import { resolveAlertIcon } from './alertIcon';

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
      class={cx('vui-banner', `vui-banner--${local.tone}`, local.sticky && 'vui-banner--sticky', local.class)}
    >
      <div class="vui-banner__inner">
        <Show when={glyph()}>{(name) => <Glyph name={name()} />}</Show>
        <div class="vui-banner__text">{local.children}</div>
        <Show when={action()}>
          <div class="vui-banner__action">{action()}</div>
        </Show>
      </div>
      <Show when={local.onClose}>
        <CloseButton
          variant="bare"
          class="vui-banner__close"
          label={translate('velvet.common.dismiss')}
          onClick={() => local.onClose?.()}
        />
      </Show>
    </div>
  );
};
