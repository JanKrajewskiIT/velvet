import { type Accessor, batch, createSignal } from 'solid-js';

import { ymd } from '../../utils/date';
import { moveEvent, type OrganizerEvent, type OrganizerEventsSource } from './organizerEvents';

export interface OrganizerDrag {
  dragId: Accessor<OrganizerEvent['id'] | undefined>;
  dropKey: Accessor<string | undefined>;
  startDrag: (id: OrganizerEvent['id'], dataTransfer: DataTransfer | null) => void;
  endDrag: () => void;
  dragOverDay: (e: DragEvent, day: Date) => void;
  dragLeaveDay: (day: Date) => void;
  dropOnDay: (e: DragEvent, day: Date) => void;
}

export const createOrganizerDrag = (source: OrganizerEventsSource): OrganizerDrag => {
  const [dragId, setDragId] = createSignal<OrganizerEvent['id']>();
  const [dropKey, setDropKey] = createSignal<string>();

  const endDrag = () =>
    batch(() => {
      setDragId(undefined);
      setDropKey(undefined);
    });
  const dropOn = (day: Date) => {
    const id = dragId();
    const moved = id === undefined ? undefined : moveEvent(source.events, id, day);
    if (moved) source.onEventsChange?.(moved);
    endDrag();
  };
  const startDrag = (id: OrganizerEvent['id'], dataTransfer: DataTransfer | null) => {
    setDragId(id);
    dataTransfer?.setData('text/plain', String(id));
    if (dataTransfer) dataTransfer.effectAllowed = 'move';
  };
  const dragOverDay = (e: DragEvent, day: Date) => {
    if (dragId() === undefined) return;
    e.preventDefault();
    setDropKey(ymd(day));
  };
  const dragLeaveDay = (day: Date) => {
    if (dropKey() === ymd(day)) setDropKey(undefined);
  };
  const dropOnDay = (e: DragEvent, day: Date) => {
    e.preventDefault();
    dropOn(day);
  };

  return { dragId, dropKey, startDrag, endDrag, dragOverDay, dragLeaveDay, dropOnDay };
};
