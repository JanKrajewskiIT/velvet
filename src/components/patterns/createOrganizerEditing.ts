import { type Accessor, batch, createSignal } from 'solid-js';

import type { OrganizerCalendar } from './createOrganizerCalendar';
import {
  applyDraft,
  createEventId,
  draftFromEvent,
  type EventDraft,
  type OrganizerEvent,
  type OrganizerEventsSource,
} from './organizerEvents';

const SERIES_COUNT = 8;

export interface OrganizerEditing {
  draft: Accessor<EventDraft | undefined>;
  pendingDelete: Accessor<OrganizerEvent | undefined>;
  addEvent: (title: string, time: string) => void;
  startEdit: (event: OrganizerEvent) => void;
  cancelEdit: () => void;
  patchDraft: (patch: Partial<EventDraft>) => void;
  saveDraft: () => void;
  askDelete: (event: OrganizerEvent) => void;
  cancelDelete: () => void;
  confirmDelete: () => void;
}

export const createOrganizerEditing = (
  source: OrganizerEventsSource,
  calendar: OrganizerCalendar,
): OrganizerEditing => {
  const [draft, setDraft] = createSignal<EventDraft>();
  const [pendingDelete, setPendingDelete] = createSignal<OrganizerEvent>();

  const addEvent = (title: string, time: string) => {
    const color = `var(--dv-${(source.events.length % SERIES_COUNT) + 1})`;
    source.onEventsChange?.([
      ...source.events,
      { id: createEventId(), date: calendar.selected(), title, time: time || undefined, color },
    ]);
  };
  const startEdit = (event: OrganizerEvent) => setDraft(draftFromEvent(event));
  const cancelEdit = () => setDraft(undefined);
  const patchDraft = (patch: Partial<EventDraft>) => setDraft((current) => current && { ...current, ...patch });
  const saveDraft = () => {
    const current = draft();
    const applied = current && applyDraft(source.events, current);
    if (!applied) return;
    source.onEventsChange?.(applied.events);
    batch(() => {
      setDraft(undefined);
      calendar.pick(applied.date);
    });
  };
  const askDelete = (event: OrganizerEvent) => setPendingDelete(event);
  const cancelDelete = () => setPendingDelete(undefined);
  const confirmDelete = () => {
    const target = pendingDelete();
    setPendingDelete(undefined);
    if (target) source.onEventsChange?.(source.events.filter((event) => event.id !== target.id));
  };

  return {
    draft,
    pendingDelete,
    addEvent,
    startEdit,
    cancelEdit,
    patchDraft,
    saveDraft,
    askDelete,
    cancelDelete,
    confirmDelete,
  };
};
