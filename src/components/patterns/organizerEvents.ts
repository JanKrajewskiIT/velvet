import { addDays, DAY_MS, startOfDay, toDate, ymd } from '../../utils/date';

export interface OrganizerEvent {
  id: string | number;
  date: Date | string;
  /** Last day of a multi-day event, inclusive. Defaults to `date`. */
  endDate?: Date | string;
  title: string;
  /** "09:30" — sorts the day */
  time?: string;
  location?: string;
  description?: string;
  color?: string;
}

/** Form values of an event being edited; dates are `yyyy-mm-dd` strings as `<input type="date">` produces them. */
export interface EventDraft {
  id: OrganizerEvent['id'];
  title: string;
  date: string;
  endDate: string;
  time: string;
  description: string;
}

const MAX_SPAN_DAYS = 366;
const UNTIMED_SORT_KEY = '99';

let nextEventSeq = 0;

export const createEventId = (): string => `e${Date.now()}-${nextEventSeq++}`;

export const dayDistance = (from: Date, to: Date): number =>
  Math.round((startOfDay(to).getTime() - startOfDay(from).getTime()) / DAY_MS);

const isValidDate = (d: Date): boolean => !Number.isNaN(d.getTime());

export const eventStart = (event: OrganizerEvent): Date => startOfDay(toDate(event.date));

export const eventEnd = (event: OrganizerEvent): Date => {
  const start = eventStart(event);
  if (!event.endDate) return start;
  const end = startOfDay(toDate(event.endDate));
  return end < start ? start : end;
};

/** Keeps the representation the consumer used: ISO date strings stay strings. */
const likeOriginal = (original: Date | string, next: Date): Date | string =>
  typeof original === 'string' ? ymd(next) : next;

/** Events keyed by `yyyy-mm-dd`; a multi-day event appears under each of its days, each day sorted by time. */
export const eventsByDay = (events: readonly OrganizerEvent[]): Map<string, OrganizerEvent[]> => {
  const days = new Map<string, OrganizerEvent[]>();
  for (const event of events) {
    const start = eventStart(event);
    const length = Math.min(MAX_SPAN_DAYS, dayDistance(start, eventEnd(event)));
    for (let offset = 0; offset <= length; offset++) {
      const key = ymd(addDays(start, offset));
      days.set(key, [...(days.get(key) ?? []), event]);
    }
  }
  for (const list of days.values())
    list.sort((a, b) => (a.time ?? UNTIMED_SORT_KEY).localeCompare(b.time ?? UNTIMED_SORT_KEY));
  return days;
};

/** Number of events that touch the month starting at `first`. */
export const countInMonth = (events: readonly OrganizerEvent[], first: Date): number => {
  const last = new Date(first.getFullYear(), first.getMonth() + 1, 0);
  return events.filter((event) => eventStart(event) <= last && eventEnd(event) >= first).length;
};

export const draftFromEvent = (event: OrganizerEvent): EventDraft => ({
  id: event.id,
  title: event.title,
  date: ymd(eventStart(event)),
  endDate: event.endDate ? ymd(eventEnd(event)) : '',
  time: event.time ?? '',
  description: event.description ?? '',
});

/** The events with the draft applied, plus the draft's start date; undefined when the draft has no title or a invalid date. */
export const applyDraft = (
  events: readonly OrganizerEvent[],
  draft: EventDraft,
): { events: OrganizerEvent[]; date: Date } | undefined => {
  const title = draft.title.trim();
  const start = toDate(draft.date);
  if (!title || !isValidDate(start)) return undefined;
  const requestedEnd = draft.endDate ? toDate(draft.endDate) : undefined;
  const end = requestedEnd && isValidDate(requestedEnd) && requestedEnd > start ? requestedEnd : undefined;
  return {
    date: start,
    events: events.map((event) =>
      event.id === draft.id
        ? {
            ...event,
            title,
            date: likeOriginal(event.date, start),
            endDate: end ? likeOriginal(event.endDate ?? event.date, end) : undefined,
            time: draft.time || undefined,
            description: draft.description.trim() || undefined,
          }
        : event,
    ),
  };
};

/** The events with one moved so it starts on `target`, keeping its length; undefined when nothing changes. */
export const moveEvent = (
  events: readonly OrganizerEvent[],
  id: OrganizerEvent['id'],
  target: Date,
): OrganizerEvent[] | undefined => {
  const moved = events.find((event) => event.id === id);
  if (!moved) return undefined;
  const delta = dayDistance(eventStart(moved), target);
  if (delta === 0) return undefined;
  return events.map((event) =>
    event.id === id
      ? {
          ...event,
          date: likeOriginal(event.date, addDays(eventStart(event), delta)),
          endDate: event.endDate ? likeOriginal(event.endDate, addDays(eventEnd(event), delta)) : undefined,
        }
      : event,
  );
};
