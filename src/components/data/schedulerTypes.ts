export type SchedulerView = 'day' | 'week';

export interface SchedulerEvent {
  id: string | number;
  title: string;
  start: Date;
  end: Date;
  /** Status or label tone. @default 'brand' */
  tone?: string;
  /** Shown after the time — room, owner. */
  meta?: string;
}

export interface SchedulerProps {
  events?: SchedulerEvent[];
  view?: SchedulerView;
  /** @default 'week' */
  defaultView?: SchedulerView;
  onViewChange?: (view: SchedulerView) => void;
  date?: Date;
  defaultDate?: Date;
  onDateChange?: (date: Date) => void;
  /** @default 8 */
  startHour?: number;
  /** @default 19 */
  endHour?: number;
  /** Initial scroll position of the grid — e.g. `startHour={0} endHour={24} scrollToHour={8}` shows the full day but opens on working hours. */
  scrollToHour?: number;
  /** Snap for slot clicks. @default 30 */
  slotMinutes?: number;
  /** px per hour. @default 52 */
  hourHeight?: number;
  /** 0 = Sunday, 1 = Monday. @default 1 */
  weekStartsOn?: number;
  hideWeekends?: boolean;
  hour12?: boolean;
  /** @default the active i18n locale */
  locale?: string;
  /** Makes events buttons. */
  onEventClick?: (event: SchedulerEvent) => void;
  onSlotClick?: (start: Date, end: Date) => void;
  /** Scroll height of the grid. @default 520 */
  maxHeight?: number | string;
  class?: string;
}

export type SchedulerConfig = SchedulerProps &
  Required<
    Pick<
      SchedulerProps,
      | 'events'
      | 'defaultView'
      | 'startHour'
      | 'endHour'
      | 'slotMinutes'
      | 'hourHeight'
      | 'weekStartsOn'
      | 'hideWeekends'
      | 'hour12'
      | 'maxHeight'
    >
  >;
