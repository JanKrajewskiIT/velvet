import { createSignal, type JSX, mergeProps, Show, splitProps } from 'solid-js';

import { createAutoDismiss, dismissDuration } from '../../hooks/createAutoDismiss';
import { useTranslate } from '../../i18n/useTranslate';
import { callHandler } from '../../utils/callHandler';
import { cx } from '../../utils/cx';
import { type StatusTone, toneIcon } from '../../utils/tone';
import { Button } from '../actions/Button';
import { CloseButton } from '../primitives/CloseButton';
import { Glyph } from '../primitives/Glyph';

export interface ToastProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'title' | 'style' | 'children'> {
  /** @default 'neutral' */
  tone?: StatusTone;
  title?: JSX.Element;
  description?: JSX.Element;
  action?: JSX.Element;
  /** Icon name; null hides it. Defaults per tone. */
  icon?: string | null;
  /** Called on dismiss click and when the countdown ends. */
  onClose?: () => void;
  /** Auto-dismiss after N ms (shows a countdown bar that pauses on hover/focus). Suggested: 5000, or 6000 with undo. */
  duration?: number;
  /** Renders an Undo button. */
  onUndo?: () => void;
  /** @default localized "Undo" */
  undoLabel?: string;
  /** Accessible name of the dismiss button. @default localized "Dismiss" */
  closeLabel?: string;
  style?: JSX.CSSProperties;
}

/** Transient status message. With `onUndo` it becomes the undo pattern — prefer it over a confirm dialog for reversible destructive actions. */
export const Toast = (props: ToastProps) => {
  const merged = mergeProps({ tone: 'neutral' } satisfies Partial<ToastProps>, props);
  const [local, rest] = splitProps(merged, [
    'tone',
    'title',
    'description',
    'action',
    'icon',
    'onClose',
    'duration',
    'onUndo',
    'undoLabel',
    'closeLabel',
    'class',
    'onMouseEnter',
    'onMouseLeave',
    'onFocusIn',
    'onFocusOut',
  ]);
  const [hovered, setHovered] = createSignal(false);
  const [focused, setFocused] = createSignal(false);
  const duration = () => dismissDuration(local.duration);
  createAutoDismiss(
    duration,
    () => hovered() || focused(),
    () => local.onClose?.(),
  );
  const translate = useTranslate();
  const glyph = () => (local.icon === undefined ? toneIcon(local.tone) : local.icon);
  return (
    <div
      {...rest}
      role="status"
      class={cx('vui-toast', `vui-toast--${local.tone}`, local.class)}
      onMouseEnter={(event) => {
        setHovered(true);
        callHandler(local.onMouseEnter, event);
      }}
      onMouseLeave={(event) => {
        setHovered(false);
        callHandler(local.onMouseLeave, event);
      }}
      onFocusIn={(event) => {
        setFocused(true);
        callHandler(local.onFocusIn, event);
      }}
      onFocusOut={(event) => {
        setFocused(event.relatedTarget instanceof Node && event.currentTarget.contains(event.relatedTarget));
        callHandler(local.onFocusOut, event);
      }}
    >
      <Show when={glyph()}>{(name) => <Glyph name={name()} class="vui-toast__icon" />}</Show>
      <div class="vui-toast__content">
        <Show when={local.title}>
          <div class="vui-toast__title">{local.title}</div>
        </Show>
        <Show when={local.description}>
          <div class="vui-toast__desc">{local.description}</div>
        </Show>
        <Show when={local.action || local.onUndo}>
          <div class="vui-toast__action">
            <Show when={local.onUndo}>
              {(undo) => (
                <Button variant="soft" size="sm" iconLeft="refresh" onClick={() => undo()()}>
                  {local.undoLabel ?? translate('velvet.common.undo')}
                </Button>
              )}
            </Show>
            {local.action}
          </div>
        </Show>
      </div>
      <Show when={local.onClose}>
        {(close) => (
          <CloseButton label={local.closeLabel ?? translate('velvet.common.dismiss')} onClick={() => close()()} />
        )}
      </Show>
      <Show when={duration()}>
        {(duration) => (
          <Show when={duration() > 0}>
            <span class="vui-toast__progress" style={{ 'animation-duration': `${duration()}ms` }} aria-hidden="true" />
          </Show>
        )}
      </Show>
    </div>
  );
};
