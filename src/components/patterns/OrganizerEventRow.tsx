import { Show } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { fmtDate } from '../../utils/date';
import { IconButton } from '../actions/IconButton';
import { OrganizerDeleteConfirm } from './OrganizerDeleteConfirm';
import { eventEnd, eventStart, type OrganizerEvent } from './organizerEvents';

const RANGE_DAY: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };

export interface OrganizerEventRowProps {
  event: OrganizerEvent;
  locale: string;
  /** Shows the edit and delete buttons. */
  editable: boolean;
  draggable: boolean;
  dragging: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
  confirmingDelete: boolean;
  onCancelDelete: () => void;
  onConfirmDelete: () => void;
  onDragStart: (dataTransfer: DataTransfer | null) => void;
  onDragEnd: () => void;
}

/** One event in the day panel: summary button plus edit and delete, draggable onto another day. */
export const OrganizerEventRow = (props: OrganizerEventRowProps) => {
  const translate = useTranslate();
  const range = () =>
    props.event.endDate
      ? translate('velvet.patterns.calendarOrganizer.dateRange', {
          start: fmtDate(eventStart(props.event), props.locale, RANGE_DAY),
          end: fmtDate(eventEnd(props.event), props.locale, RANGE_DAY),
        })
      : undefined;

  return (
    <li
      data-event-id={props.event.id}
      class={cx('vui-organizer__ev', props.dragging && 'vui-organizer__ev--drag')}
      style={{ '--ec': props.event.color ?? 'var(--dv-1)' }}
      draggable={props.draggable && !props.confirmingDelete}
      onDragStart={(e) => props.onDragStart(e.dataTransfer)}
      onDragEnd={() => props.onDragEnd()}
    >
      <button type="button" class="vui-organizer__evb" onClick={() => props.onSelect()}>
        <span class="vui-organizer__evt">{props.event.title}</span>
        <span class="vui-organizer__evm">
          {props.event.time || translate('velvet.patterns.calendarOrganizer.allDay')}
          {range() ? ` · ${range()}` : ''}
          {props.event.location ? ` · ${props.event.location}` : ''}
        </span>
        <Show when={props.event.description}>
          <span class="vui-organizer__evd">{props.event.description}</span>
        </Show>
      </button>
      <Show when={props.editable}>
        <Show
          when={!props.confirmingDelete}
          fallback={
            <OrganizerDeleteConfirm
              title={props.event.title}
              onCancel={props.onCancelDelete}
              onConfirm={props.onConfirmDelete}
            />
          }
        >
          <IconButton
            icon="pencil"
            label={translate('velvet.patterns.calendarOrganizer.editEvent', { title: props.event.title })}
            size="sm"
            onClick={() => props.onEdit()}
          />
          <IconButton
            data-delete=""
            icon="trash-2"
            label={translate('velvet.patterns.calendarOrganizer.deleteEvent', { title: props.event.title })}
            size="sm"
            onClick={() => props.onDelete()}
          />
        </Show>
      </Show>
    </li>
  );
};
