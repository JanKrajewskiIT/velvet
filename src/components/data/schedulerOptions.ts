import type { SchedulerConfig } from './schedulerTypes';

export const schedulerOptions = (config: SchedulerConfig) => {
  const { startHour, endHour, slotMinutes, hourHeight, weekStartsOn } = config;
  if (
    !Number.isInteger(startHour) ||
    !Number.isInteger(endHour) ||
    startHour < 0 ||
    endHour > 24 ||
    startHour >= endHour
  )
    throw new RangeError('Scheduler hours must be ordered integers between 0 and 24.');
  if (!Number.isInteger(slotMinutes) || slotMinutes <= 0 || slotMinutes > (endHour - startHour) * 60)
    throw new RangeError('Scheduler slotMinutes must fit within the visible day.');
  if (!Number.isFinite(hourHeight) || hourHeight <= 0)
    throw new RangeError('Scheduler hourHeight must be positive and finite.');
  if (!Number.isInteger(weekStartsOn) || weekStartsOn < 0 || weekStartsOn > 6)
    throw new RangeError('Scheduler weekStartsOn must be between 0 and 6.');
  return { startHour, endHour, slotMinutes, hourHeight, weekStartsOn };
};
