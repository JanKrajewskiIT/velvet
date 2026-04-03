import { addDays, getDateDiffInDays } from '~/utils/datetime';

import type { SchedulerEvent } from './Scheduler';

interface SchedulerEventDraft {
  date: string;
  title: string;
  time?: string;
  description?: string;
}

interface SchedulerEventEditDraft extends SchedulerEventDraft {
  endDate?: string;
}

export const createSchedulerEventId = () =>
  typeof crypto !== 'undefined' ? crypto.randomUUID() : `event-${Date.now()}`;

export const createSchedulerEvent = (draft: SchedulerEventDraft): SchedulerEvent => ({
  id: createSchedulerEventId(),
  title: draft.title,
  date: draft.date,
  time: draft.time || undefined,
  description: draft.description || undefined,
});

export const buildSchedulerEventsByDate = (events: readonly SchedulerEvent[]) => {
  const map = new Map<string, SchedulerEvent[]>();

  for (const event of events) {
    const endDate = event.endDate ?? event.date;
    const startDate = event.date <= endDate ? event.date : endDate;
    const finishDate = event.date <= endDate ? endDate : event.date;
    const spanInDays = Math.max(0, getDateDiffInDays(startDate, finishDate));

    for (let offset = 0; offset <= spanInDays; offset += 1) {
      const dayIso = addDays(startDate, offset);
      if (!map.has(dayIso)) {
        map.set(dayIso, []);
      }
      map.get(dayIso)?.push(event);
    }
  }

  return map;
};

export const saveSchedulerEventEdit = (
  events: readonly SchedulerEvent[],
  eventId: string,
  draft: SchedulerEventEditDraft,
): SchedulerEvent[] => {
  const source = events.find((item) => item.id === eventId);
  if (!source) return [...events];

  const nextDate = draft.date || source.date;
  const dateOffset = getDateDiffInDays(source.date, nextDate);
  const nextEndDate = source.endDate ? addDays(source.endDate, dateOffset) : undefined;

  return events.map((item) =>
    item.id === eventId
      ? {
          ...item,
          date: nextDate,
          title: draft.title,
          time: draft.time || undefined,
          endDate: nextEndDate,
          description: draft.description || undefined,
        }
      : item,
  );
};

export const deleteSchedulerEvent = (events: readonly SchedulerEvent[], eventId: string) =>
  events.filter((item) => item.id !== eventId);

export const moveSchedulerEvent = (
  events: readonly SchedulerEvent[],
  eventId: string,
  targetDate: string,
): SchedulerEvent[] => {
  const event = events.find((item) => item.id === eventId);
  if (!event || event.date === targetDate) return [...events];

  const offset = getDateDiffInDays(event.date, targetDate);
  const nextEndDate = event.endDate ? addDays(event.endDate, offset) : undefined;

  return events.map((item) =>
    item.id === eventId
      ? {
          ...item,
          date: targetDate,
          endDate: nextEndDate,
        }
      : item,
  );
};

export const resizeSchedulerEventEnd = (
  events: readonly SchedulerEvent[],
  eventId: string,
  targetDate: string,
): SchedulerEvent[] => {
  const event = events.find((item) => item.id === eventId);
  if (!event) return [...events];

  const nextEndDate = targetDate < event.date ? event.date : targetDate;

  return events.map((item) =>
    item.id === eventId
      ? {
          ...item,
          endDate: nextEndDate === item.date ? undefined : nextEndDate,
        }
      : item,
  );
};

export const getSchedulerEventLabel = (event: SchedulerEvent): string => {
  if (!event.endDate || event.endDate === event.date) return event.date;
  return `${event.date} - ${event.endDate}`;
};
