import { type Accessor, createSignal } from 'solid-js';

import type { SchedulerController } from './schedulerController';

const MINUTE_MS = 60_000;

export const createSchedulerSlots = (controller: Accessor<SchedulerController>) => {
  const [active, setActive] = createSignal<number>();
  const dateAtMinute = (day: Date, minutes: number) =>
    new Date(day.getFullYear(), day.getMonth(), day.getDate(), Math.floor(minutes / 60), minutes % 60);
  const available = (day: Date) => {
    const { config } = controller();
    const values: number[] = [];
    const end = +dateAtMinute(day, config.endHour * 60);
    for (
      let minute = config.startHour * 60;
      minute + config.slotMinutes <= config.endHour * 60;
      minute += config.slotMinutes
    ) {
      const date = dateAtMinute(day, minute);
      if (date.getHours() * 60 + date.getMinutes() === minute && +date + config.slotMinutes * MINUTE_MS <= end)
        values.push(minute);
    }
    return values;
  };
  const minutes = (day: Date) => {
    const slots = available(day);
    const value = active() ?? controller().config.startHour * 60;
    return slots.reduce(
      (best, next) => (Math.abs(next - value) < Math.abs(best - value) ? next : best),
      slots[0] ?? value,
    );
  };
  const dateAt = (day: Date) => dateAtMinute(day, minutes(day));
  const createSlot = (day: Date, minutes: number) => {
    const { config } = controller();
    if (!available(day).includes(minutes)) return;
    setActive(minutes);
    const start = dateAtMinute(day, minutes);
    config.onSlotClick?.(start, new Date(+start + config.slotMinutes * MINUTE_MS));
  };

  const onClick = (day: Date, e: MouseEvent & { currentTarget: HTMLElement }) => {
    const { config, pxPerMinute } = controller();
    if (!config.onSlotClick || (e.target instanceof Element && e.target.closest('.vui-sched__evt'))) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const offset = Math.floor((e.clientY - rect.top) / pxPerMinute() / config.slotMinutes) * config.slotMinutes;
    const requested = offset + config.startHour * 60;
    const slots = available(day);
    const nearest = slots.reduce<number | undefined>(
      (best, minute) =>
        best === undefined || Math.abs(minute - requested) < Math.abs(best - requested) ? minute : best,
      undefined,
    );
    if (nearest !== undefined) createSlot(day, nearest);
  };

  const onKeyDown = (day: Date, e: KeyboardEvent & { currentTarget: HTMLElement }) => {
    const slots = available(day);
    const index = slots.indexOf(minutes(day));
    const { config } = controller();
    const step =
      e.key === 'ArrowDown'
        ? 1
        : e.key === 'ArrowUp'
          ? -1
          : e.key === 'PageDown'
            ? Math.max(1, Math.round(60 / config.slotMinutes))
            : e.key === 'PageUp'
              ? -Math.max(1, Math.round(60 / config.slotMinutes))
              : 0;
    if (!step && e.key !== 'Home' && e.key !== 'End') return;
    e.preventDefault();
    const next =
      slots[
        e.key === 'Home'
          ? 0
          : e.key === 'End'
            ? slots.length - 1
            : Math.max(0, Math.min(slots.length - 1, index + step))
      ];
    if (next !== undefined) setActive(next);
  };

  return { onClick, onKeyDown, createSlot, minutes, dateAt } as const;
};
