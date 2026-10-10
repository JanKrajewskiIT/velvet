import { onCleanup, onMount, Show } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { Button } from '../actions/Button';
import type { TimelineAction } from './timelineTypes';

export interface TimelineConfirmProps {
  action: TimelineAction;
  busy: boolean;
  /** Failure text of the last attempt. */
  error: string | undefined;
  onCancel: () => void;
  onConfirm: () => void;
}

/** Inline "are you sure" row for a confirming action. Focus moves in on open and back to the trigger on close. */
export const TimelineConfirm = (props: TimelineConfirmProps) => {
  const translate = useTranslate();
  let root!: HTMLDivElement;
  onMount(() => {
    const trigger = document.activeElement;
    root.querySelector('button')?.focus();
    onCleanup(() => {
      const active = document.activeElement;
      const focusLost = !active || active === document.body || root.contains(active);
      if (focusLost && trigger instanceof HTMLElement && trigger.isConnected) trigger.focus();
    });
  });
  return (
    <div
      ref={(element) => {
        root = element;
      }}
      class="vui-timeline__confirm"
      role="alert"
    >
      <span>
        {typeof props.action.confirm === 'string'
          ? props.action.confirm
          : translate('velvet.data.timelineConfirm.question', { action: props.action.label })}
      </span>
      <Show when={props.error}>{(error) => <span class="vui-timeline__err">{error()}</span>}</Show>
      <Button variant="ghost" size="sm" disabled={props.busy} onClick={() => props.onCancel()}>
        {translate('velvet.common.cancel')}
      </Button>
      <Button
        size="sm"
        variant={props.action.tone === 'danger' ? 'danger' : 'primary'}
        loading={props.busy}
        onClick={() => props.onConfirm()}
      >
        {props.action.confirmLabel || props.action.label}
      </Button>
    </div>
  );
};
