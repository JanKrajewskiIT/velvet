import * as React from 'react';
export interface SchedulerEvent { id: string | number; title: string; start: Date; end: Date; /** Status or label tone. @default 'brand' */ tone?: string; /** Shown after the time — room, owner */ meta?: string; }
/**
 * Day / week time grid for bookings, shifts and meetings. Overlapping events split into lanes, a now-line marks the current time,
 * clicking an empty slot reports the slot (snap to slotMinutes) so you can open a create dialog. Use EventCalendar for a month
 * overview, Timeline for sequences without a clock.
 */
export interface SchedulerProps {
  events?: SchedulerEvent[];
  view?: 'day' | 'week';
  /** @default 'week' */
  defaultView?: 'day' | 'week';
  onViewChange?: (view: 'day' | 'week') => void;
  date?: Date;
  defaultDate?: Date;
  onDateChange?: (date: Date) => void;
  /** @default 8 */
  startHour?: number;
  /** @default 19 */
  endHour?: number;
  /** Initial scroll position of the grid — e.g. startHour={0} endHour={24} scrollToHour={8} shows the full day but opens on working hours */
  scrollToHour?: number;
  /** Snap for slot clicks. @default 30 */
  slotMinutes?: number;
  /** px per hour. @default 52 */
  hourHeight?: number;
  /** 0 = Sunday, 1 = Monday. @default 1 */
  weekStartsOn?: number;
  hideWeekends?: boolean;
  hour12?: boolean;
  locale?: string;
  /** Makes events buttons */
  onEventClick?: (event: SchedulerEvent) => void;
  onSlotClick?: (start: Date, end: Date) => void;
  /** Scroll height of the grid. @default 520 */
  maxHeight?: number | string;
  className?: string;
}
export declare function Scheduler(props: SchedulerProps): JSX.Element;
