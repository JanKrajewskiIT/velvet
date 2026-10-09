import { createMemo } from 'solid-js';

import { addDays, startOfDay, toDate, ymd } from '../../utils/date';
import { clamp } from '../../utils/math';
import type { HeatmapConfig } from './heatmapTypes';

export const DAYS_PER_WEEK = 7;

type HeatmapGridConfig = Pick<HeatmapConfig, 'data' | 'end' | 'weeks' | 'weekStart' | 'colors' | 'thresholds'>;

const toDay = (value: string | Date): Date =>
  startOfDay(toDate(typeof value === 'string' ? value.slice(0, 10) : value));

export const createHeatmapGrid = (config: HeatmapGridConfig) => {
  const byDay = createMemo(() => {
    const totals = new Map<string, number>();
    for (const point of config.data) {
      const key = ymd(toDay(point.date));
      totals.set(key, (totals.get(key) ?? 0) + (point.value || 0));
    }
    return totals;
  });

  const lastDay = createMemo(() => {
    if (config.end) return toDay(config.end);
    let latest: Date | undefined;
    for (const point of config.data) {
      const day = toDay(point.date);
      if (!latest || day > latest) latest = day;
    }
    return latest ?? startOfDay(new Date());
  });

  const firstDay = () => addDays(lastDay(), -offset() - (config.weeks - 1) * DAYS_PER_WEEK);
  const offset = () => (lastDay().getDay() - config.weekStart + DAYS_PER_WEEK) % DAYS_PER_WEEK;
  const lastIndex = () => (config.weeks - 1) * DAYS_PER_WEEK + offset();

  const grid = createMemo(() => {
    const start = firstDay();
    const last = lastIndex();
    const cells: { index: number; date: Date; value: number }[] = [];
    let total = 0;
    let max = 0;
    for (let i = 0; i < config.weeks * DAYS_PER_WEEK; i++) {
      const date = addDays(start, i);
      const value = i > last ? 0 : (byDay().get(ymd(date)) ?? 0);
      if (i <= last) {
        total += value;
        max = Math.max(max, value);
      }
      cells.push({ index: i, date, value });
    }
    return { cells, total, max };
  });

  const level = (v: number): number => {
    const top = config.colors.length - 1;
    if (v <= 0) return 0;
    if (config.thresholds) return Math.min(top, 1 + config.thresholds.filter((t) => v >= t).length);
    return clamp(Math.ceil((v / (grid().max || 1)) * top), 1, top);
  };
  const colorOf = (v: number) => config.colors[level(v)];

  return { firstDay, lastIndex, grid, colorOf } as const;
};
