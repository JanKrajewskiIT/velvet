import { type JSX, onMount } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { Button } from '../actions/Button';

export interface OrganizerDeleteConfirmProps {
  title: string;
  onCancel: () => void;
  onConfirm: () => void;
}

/** Inline confirmation keeps the event visible and starts focus on the safe action. */
export const OrganizerDeleteConfirm = (props: OrganizerDeleteConfirmProps) => {
  const translate = useTranslate();
  let cancelButton: HTMLButtonElement | undefined;
  onMount(() => cancelButton?.focus({ preventScroll: true }));
  const onKeyDown: JSX.EventHandler<HTMLButtonElement, KeyboardEvent> = (event) => {
    if (event.key !== 'Escape') return;
    event.preventDefault();
    event.stopPropagation();
    props.onCancel();
  };
  return (
    <div
      class="vui-organizer__confirm"
      role="group"
      aria-label={translate('velvet.patterns.calendarOrganizer.deleteMessage', { title: props.title })}
    >
      <Button
        ref={(element) => {
          cancelButton = element;
        }}
        size="xs"
        variant="ghost"
        onClick={() => props.onCancel()}
        onKeyDown={onKeyDown}
      >
        {translate('velvet.common.cancel')}
      </Button>
      <Button size="xs" variant="danger" onClick={() => props.onConfirm()} onKeyDown={onKeyDown}>
        {translate('velvet.common.delete')}
      </Button>
    </div>
  );
};
