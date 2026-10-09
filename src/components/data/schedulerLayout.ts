import type { JSX } from 'solid-js';

import { minutesOfDay } from '../../utils/date';

const MINUTES_PER_DAY = 1440;
const MIN_EVENT_HEIGHT = 20;
const SHORT_EVENT_HEIGHT = 40;

export const WEEKDAY_LONG: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'long', day: 'numeric' };

export const isWeekend = (d: Date): boolean => d.getDay() === 0 || d.getDay() === 6;

export interface TimedEvent {
  start: Date;
  end: Date;
}

export interface LaidOutEvent<E extends TimedEvent> {
  event: E;
  /** Zero-based column inside its overlap cluster. */
  lane: number;
  /** Number of columns in the overlap cluster. */
  lanes: number;
}

/** Splits overlapping events into side-by-side lanes; events that do not overlap share the full width. */
export const layoutEvents = <E extends TimedEvent>(events: E[]): LaidOutEvent<E>[] => {
  const sorted = [...events].sort((a, b) => +a.start - +b.start || +b.end - +a.end);
  const out: LaidOutEvent<E>[] = [];
  let cluster: E[] = [];
  let clusterEnd = -Infinity;

  const flush = () => {
    const laneEnds: number[] = [];
    const placed = cluster.map((event) => {
      let lane = laneEnds.findIndex((end) => end <= +event.start);
      if (lane < 0) lane = laneEnds.length;
      laneEnds[lane] = +event.end;
      return { event, lane };
    });
    placed.forEach((p) => out.push({ ...p, lanes: laneEnds.length }));
    cluster = [];
  };

  sorted.forEach((event) => {
    if (+event.start >= clusterEnd && cluster.length) flush();
    cluster.push(event);
    clusterEnd = Math.max(clusterEnd, +event.end);
  });
  if (cluster.length) flush();
  return out;
};

export interface SchedulerGrid {
  startHour: number;
  endHour: number;
  pxPerMinute: number;
}

export const eventStyle = (e: TimedEvent, lane: number, lanes: number, grid: SchedulerGrid) => {
  const startMinutes = minutesOfDay(e.start);
  const top = Math.max(0, (startMinutes - grid.startHour * 60) * grid.pxPerMinute);
  const visibleEnd = Math.min(minutesOfDay(e.end) || MINUTES_PER_DAY, grid.endHour * 60);
  const height = Math.max(
    MIN_EVENT_HEIGHT,
    (visibleEnd - Math.max(startMinutes, grid.startHour * 60)) * grid.pxPerMinute - 2,
  );
  const style: JSX.CSSProperties = {
    top: `${top}px`,
    height: `${height}px`,
    left: `calc(${(lane / lanes) * 100}% + 2px)`,
    width: `calc(${100 / lanes}% - 4px)`,
  };
  return { style, short: height < SHORT_EVENT_HEIGHT };
};
