import { useI18n } from '@jankrajewskiit/i18n';
import { createMemo } from 'solid-js';

import type { SchedulerConfig } from './schedulerTypes';

export const createSchedulerFormat = (config: SchedulerConfig) => {
  const i18n = useI18n();
  const locale = () => config.locale ?? i18n.locale();
  const timeFormat = createMemo(
    () =>
      new Intl.DateTimeFormat(locale(), {
        hour: config.hour12 ? 'numeric' : '2-digit',
        minute: '2-digit',
        hour12: config.hour12,
      }),
  );
  const formatTime = (d: Date) => timeFormat().format(d);
  return { locale, formatTime } as const;
};
