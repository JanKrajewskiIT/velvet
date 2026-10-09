import type { Accessor } from 'solid-js';

import type { SchedulerCalendar } from './createSchedulerCalendar';
import type { SchedulerConfig } from './schedulerTypes';

/** Everything the Scheduler parts share: resolved props plus the state owned by the scheduler hooks. */
export interface SchedulerController {
  config: SchedulerConfig;
  calendar: SchedulerCalendar;
  now: Accessor<Date>;
  locale: Accessor<string>;
  formatTime: (d: Date) => string;
  hours: () => number;
  pxPerMinute: () => number;
  gridHeight: () => number;
}
