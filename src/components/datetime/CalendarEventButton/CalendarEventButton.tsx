import { FaRegularCalendarPlus } from 'solid-icons/fa';
import { FiCheck } from 'solid-icons/fi';
import { Show } from 'solid-js';

import IconButton from '~/components/buttons/IconButton/IconButton';
import Icon from '~/components/media/Icon/Icon';
import type Props from '~/models/Props';
import type { ComponentSize } from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './CalendarEventButton.module.css';

export interface CalendarEventButtonEvent {
  title: string;
  start: string | null;
  durationMinutes?: number | null;
  details?: string;
  location?: string;
  synced?: boolean;
}

interface CalendarEventButtonProps {
  event: CalendarEventButtonEvent;
  addLabel: string;
  syncedLabel: string;
  size?: ComponentSize;
  onOpen?: (url: string) => void;
}

const formatDateForCalendar = (value: string): string =>
  new Date(value)
    .toISOString()
    .replace(/[-:]/gu, '')
    .replace(/\.\d{3}/u, '');

export const buildGoogleCalendarUrl = (event: CalendarEventButtonEvent): string | null => {
  if (!event.start) return null;

  const start = formatDateForCalendar(event.start);
  const endDate = new Date(event.start);
  endDate.setMinutes(endDate.getMinutes() + (event.durationMinutes ?? 60));
  const end = formatDateForCalendar(endDate.toISOString());
  const title = encodeURIComponent(event.title);
  const details = encodeURIComponent(event.details ?? '');
  const location = encodeURIComponent(event.location ?? '');

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&location=${location}`;
};

const CalendarEventButton = (props: Props<CalendarEventButtonProps>) => {
  const size = () => props.size ?? 'sm';
  const handleOpen = () => {
    const url = buildGoogleCalendarUrl(props.event);
    if (!url) return;

    if (props.onOpen) {
      props.onOpen(url);
      return;
    }

    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <Show
      when={props.event.synced}
      fallback={
        <IconButton
          class={props.class}
          icon={FaRegularCalendarPlus}
          label={props.addLabel}
          size={size()}
          variant="subtle"
          disabled={!props.event.start}
          onClick={handleOpen}
        />
      }
    >
      <span
        class={classNames(
          styles.status,
          styles[`size${size().charAt(0).toUpperCase()}${size().slice(1)}`],
          props.class
        )}
      >
        <Icon icon={FiCheck} size={size()} variant="success" label={props.syncedLabel} />
      </span>
    </Show>
  );
};

export default CalendarEventButton;
