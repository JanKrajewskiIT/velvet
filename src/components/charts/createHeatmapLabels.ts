import { createMemo } from 'solid-js';

import { addDays } from '../../utils/date';
import { DAYS_PER_WEEK } from './createHeatmapGrid';
import type { HeatmapConfig } from './heatmapTypes';

export const MIN_MONTH_LABEL_GAP = 3;

export const createHeatmapLabels = (
  config: Pick<HeatmapConfig, 'weeks'>,
  locale: () => string,
  firstDay: () => Date,
) => {
  const monthFormat = createMemo(() => new Intl.DateTimeFormat(locale(), { month: 'short' }));
  const weekdayFormat = createMemo(() => new Intl.DateTimeFormat(locale(), { weekday: 'short' }));
  const dateFormat = createMemo(
    () => new Intl.DateTimeFormat(locale(), { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }),
  );

  const monthLabels = createMemo(() => {
    const start = firstDay();
    const labels: { week: number; label: string }[] = [];
    for (let w = 0; w < config.weeks; w++) {
      const date = addDays(start, w * DAYS_PER_WEEK);
      if (!w || date.getMonth() !== addDays(start, (w - 1) * DAYS_PER_WEEK).getMonth())
        labels.push({ week: w, label: monthFormat().format(date) });
    }
    const [first, second] = labels;
    if (first && second && second.week - first.week < MIN_MONTH_LABEL_GAP) labels.shift();
    return labels;
  });

  const weekdayLabels = () => {
    const first = firstDay();
    const formatter = weekdayFormat();
    return Array.from({ length: DAYS_PER_WEEK }, (_, r) =>
      r % 2 === 0 && r < 6 ? formatter.format(addDays(first, r)) : '',
    );
  };

  return { dateFormat, monthLabels, weekdayLabels } as const;
};
