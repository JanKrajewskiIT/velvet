import * as React from 'react';
export interface CalendarEvent { id?: string | number; /** Date or 'YYYY-MM-DD' */ date: Date | string; title: React.ReactNode; /** 'HH:mm' — also the sort key. Omit for all-day. */ time?: string; description?: React.ReactNode; tone?: 'brand' | 'success' | 'warning' | 'danger' | 'info' }
/** Compact month grid (days with events get a dot) + agenda for the selected day. Built on Calendar. Sizes to the month grid (~252px) instead of filling its container — drop it into a sidebar or card as-is. */
export interface EventCalendarProps {
  events: CalendarEvent[];
  value?: Date;
  defaultValue?: Date;
  onValueChange?: (date: Date) => void;
  /** @default 'en-US' */
  locale?: string;
  /** @default 1 (Monday) */
  weekStartsOn?: 0 | 1;
  /** Shown when the selected day has no events */
  emptyText?: string;
  /** stacked = agenda under the grid, as wide as the grid · split = agenda to the right (≤300px), stacks under 620px. @default 'stacked' */
  layout?: 'stacked' | 'split';
  className?: string;
}
export declare function EventCalendar(props: EventCalendarProps): JSX.Element;
