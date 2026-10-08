import { createSignal, type JSX, mergeProps, Show, splitProps } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import type { HtmlProps } from '../../utils/polymorphic';
import { Button } from '../actions/Button';
import { type StateSize, StateTile } from './StateTile';

export interface ErrorStateProps extends HtmlProps<HTMLDivElement, 'title'> {
  /** @default localized "Something went wrong" */
  title?: JSX.Element;
  /** @default localized "We couldn’t load this. Check your connection and try again." */
  description?: JSX.Element;
  onRetry?: () => void;
  /** @default localized "Try again" */
  retryLabel?: string;
  /** Error text / stack, hidden behind "Show details". */
  details?: string;
  /** @default 'triangle-alert' */
  icon?: string;
  /** @default 'md' */
  size?: StateSize;
}

/** Failed-to-load placeholder with Retry and optional collapsible technical details. */
export const ErrorState = (props: ErrorStateProps) => {
  const merged = mergeProps({ icon: 'triangle-alert', size: 'md' } satisfies ErrorStateProps, props);
  const [local, rest] = splitProps(merged, [
    'title',
    'description',
    'onRetry',
    'retryLabel',
    'details',
    'icon',
    'size',
    'class',
  ]);
  const translate = useTranslate();
  const title = () => (local.title === undefined ? translate('velvet.feedback.errorState.title') : local.title);
  const description = () =>
    local.description === undefined ? translate('velvet.feedback.errorState.description') : local.description;
  const retryLabel = () => local.retryLabel ?? translate('velvet.feedback.errorState.retryLabel');
  const [open, setOpen] = createSignal(false);

  return (
    <div
      {...rest}
      role="alert"
      class={cx('vui-empty', 'vui-empty--error', 'vui-tone--danger', `vui-empty--${local.size}`, local.class)}
    >
      <StateTile icon={local.icon} size={local.size} tone="danger" />
      <div class="vui-empty__text">
        <div class="vui-empty__title">{title()}</div>
        <Show when={description()}>
          <div class="vui-empty__desc">{description()}</div>
        </Show>
      </div>
      <Show when={local.onRetry || local.details}>
        <div class="vui-empty__actions">
          <Show when={local.onRetry}>
            <Button variant="secondary" size="sm" iconLeft="refresh" onClick={() => local.onRetry?.()}>
              {retryLabel()}
            </Button>
          </Show>
          <Show when={local.details}>
            <Button variant="ghost" size="sm" aria-expanded={open()} onClick={() => setOpen(!open())}>
              {open()
                ? translate('velvet.feedback.errorState.hideDetails')
                : translate('velvet.feedback.errorState.showDetails')}
            </Button>
          </Show>
        </div>
      </Show>
      <Show when={open() && local.details}>
        <pre class="vui-empty__details">{local.details}</pre>
      </Show>
    </div>
  );
};
