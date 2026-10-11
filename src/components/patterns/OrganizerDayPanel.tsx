import { For, Show } from 'solid-js';

import { createFrameFocus } from '../../hooks/createFrameFocus';
import { useTranslate } from '../../i18n/useTranslate';
import { fmtDate } from '../../utils/date';
import { EmptyText } from '../primitives/EmptyText';
import type { OrganizerCalendar } from './createOrganizerCalendar';
import type { OrganizerDrag } from './createOrganizerDrag';
import type { OrganizerEditing } from './createOrganizerEditing';
import { OrganizerEventForm } from './OrganizerEventForm';
import { OrganizerEventRow } from './OrganizerEventRow';
import type { OrganizerEvent } from './organizerEvents';
import { OrganizerQuickAdd } from './OrganizerQuickAdd';

export interface OrganizerDayPanelProps {
  calendar: OrganizerCalendar;
  editing: OrganizerEditing;
  drag: OrganizerDrag;
  /** Events of the selected day. */
  events: OrganizerEvent[];
  /** Enables add, edit and delete. */
  editable: boolean;
  draggableEvents: boolean;
  confirmDelete: boolean;
  onEventClick?: (event: OrganizerEvent) => void;
}

/** Detail panel for the selected day: its events with edit, delete and drag, and the quick-add form. */
export const OrganizerDayPanel = (props: OrganizerDayPanelProps) => {
  const translate = useTranslate();
  let panel: HTMLElement | undefined;
  const focusAfterRender = createFrameFocus(() => panel);
  const removeEvent = (event: OrganizerEvent) => {
    props.editing.deleteEvent(event);
    focusAfterRender('.vui-organizer__evb, .vui-organizer__add input');
  };
  const cancelDelete = (event: OrganizerEvent) => {
    props.editing.cancelDelete();
    focusAfterRender(`[data-event-id="${CSS.escape(String(event.id))}"] [data-delete]`);
  };
  return (
    <aside
      ref={(element) => {
        panel = element;
      }}
      class="vui-organizer__panel"
      aria-live="polite"
    >
      <div class="vui-organizer__pday">
        {fmtDate(props.calendar.selected(), props.calendar.locale(), { weekday: 'long' })}
      </div>
      <div class="vui-organizer__pdate">
        {fmtDate(props.calendar.selected(), props.calendar.locale(), { month: 'long', day: 'numeric' })}
      </div>
      <Show
        when={props.events.length > 0}
        fallback={
          <EmptyText icon="sun" class="vui-organizer__empty">
            <b>{translate('velvet.patterns.calendarOrganizer.emptyTitle')}</b>
            <span>{translate('velvet.patterns.calendarOrganizer.emptyDescription')}</span>
          </EmptyText>
        }
      >
        <ul class="vui-organizer__list">
          <For each={props.events}>
            {(event) => (
              <Show
                when={props.editing.draft()?.id === event.id ? props.editing.draft() : undefined}
                fallback={
                  <OrganizerEventRow
                    event={event}
                    locale={props.calendar.locale()}
                    editable={props.editable}
                    draggable={props.editable && props.draggableEvents}
                    dragging={props.drag.dragId() === event.id}
                    onSelect={() => props.onEventClick?.(event)}
                    onEdit={() => props.editing.startEdit(event)}
                    onDelete={() => (props.confirmDelete ? props.editing.askDelete(event) : removeEvent(event))}
                    confirmingDelete={props.editing.pendingDelete()?.id === event.id}
                    onCancelDelete={() => cancelDelete(event)}
                    onConfirmDelete={() => removeEvent(event)}
                    onDragStart={(dataTransfer) => props.drag.startDrag(event.id, dataTransfer)}
                    onDragEnd={props.drag.endDrag}
                  />
                }
              >
                {(current) => (
                  <OrganizerEventForm
                    draft={current()}
                    color={event.color}
                    onChange={props.editing.patchDraft}
                    onSave={props.editing.saveDraft}
                    onCancel={props.editing.cancelEdit}
                  />
                )}
              </Show>
            )}
          </For>
        </ul>
      </Show>
      <Show when={props.editable}>
        <OrganizerQuickAdd onAdd={props.editing.addEvent} />
      </Show>
    </aside>
  );
};
