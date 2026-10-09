import type { Accessor } from 'solid-js';

import { sameDay } from '../../utils/date';
import type { SchedulerController } from './schedulerController';

const MINUTE_MS = 60_000;
const DEFAULT_CREATE_HOUR = 9;

export const createSchedulerSlots = (controller: Accessor<SchedulerController>) => {
  const createSlot = (day: Date, minutes: number) => {
    const { config } = controller();
    const start = new Date(day.getFullYear(), day.getMonth(), day.getDate(), Math.floor(minutes / 60), minutes % 60);
    config.onSlotClick?.(start, new Date(+start + config.slotMinutes * MINUTE_MS));
  };

  const onClick = (day: Date, e: MouseEvent & { currentTarget: HTMLElement }) => {
    const { config, pxPerMinute } = controller();
    if (!config.onSlotClick || (e.target instanceof Element && e.target.closest('.vui-sched__evt'))) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const offset = Math.floor((e.clientY - rect.top) / pxPerMinute() / config.slotMinutes) * config.slotMinutes;
    createSlot(day, offset + config.startHour * 60);
  };

  const onKeyDown = (day: Date, e: KeyboardEvent & { currentTarget: HTMLElement }) => {
    if (e.target !== e.currentTarget || (e.key !== 'Enter' && e.key !== ' ')) return;
    e.preventDefault();
    const { config, now } = controller();
    const current = now();
    const hour = sameDay(day, current)
      ? Math.min(config.endHour - 1, Math.max(config.startHour, current.getHours() + 1))
      : Math.max(config.startHour, DEFAULT_CREATE_HOUR);
    createSlot(day, hour * 60);
  };

  return { onClick, onKeyDown } as const;
};
