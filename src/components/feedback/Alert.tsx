import { children, type JSX, mergeProps, Show, splitProps } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import type { HtmlProps } from '../../utils/polymorphic';
import type { StatusTone } from '../../utils/tone';
import { CloseButton } from '../primitives/CloseButton';
import { Glyph } from '../primitives/Glyph';
import { resolveAlertIcon } from './alertIcon';

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
      class={cx('vui-alert', `vui-alert--${local.tone}`, `vui-alert--${local.variant}`, local.class)}
    >
      <Show when={glyph()}>{(name) => <Glyph name={name()} class="vui-alert__icon" />}</Show>
      <div class="vui-alert__body">
        <Show when={title()}>
          <div class="vui-alert__title">{title()}</div>
        </Show>
        <Show when={text()}>
          <div class="vui-alert__text">{text()}</div>
        </Show>
        <Show when={action()}>
          <div class="vui-alert__actions">{action()}</div>
        </Show>
      </div>
      <Show when={local.onClose}>
        <CloseButton
          class="vui-alert__close"
          label={translate('velvet.common.dismiss')}
          onClick={() => local.onClose?.()}
        />
      </Show>
    </div>
  );
};
