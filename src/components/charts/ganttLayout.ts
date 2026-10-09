import { addDays, DAY_MS, startOfDay, toDate } from '../../utils/date';
import { seriesColor } from './chartScale';

export const PX_PER_DAY = { day: 36, week: 16, month: 5 } as const;

export type GanttScale = keyof typeof PX_PER_DAY;

type GanttDate = Date | string;
type GanttTaskId = string | number;

export interface GanttTask {
  id?: GanttTaskId;
  name: string;
  /** Date or 'YYYY-MM-DD'. */
  start: GanttDate;
  /** Inclusive. Defaults to start. */
  end?: GanttDate;
  /** 0–100 */
  progress?: number;
  group?: string;
  /** Overrides the group colour. */
  color?: string;
  /** Diamond on `start`. */
  milestone?: boolean;
  /** Task id(s) that must finish first — draws an arrow. */
  dependsOn?: GanttTaskId | GanttTaskId[];
}

export interface PlacedTask {
  task: GanttTask;
  key: GanttTaskId;
  start: Date;
  end: Date;
  color: string;
}

export interface GanttGroupRow {
  kind: 'group';
  group: string;
}

export interface GanttTaskRow {
  kind: 'task';
  placed: PlacedTask;
}

export type GanttRow = GanttGroupRow | GanttTaskRow;

export const toDay = (value: GanttDate): Date => startOfDay(toDate(value));

export const daysBetween = (from: Date, to: Date): number => Math.round((to.getTime() - from.getTime()) / DAY_MS);

export const isWeekend = (d: Date): boolean => d.getDay() === 0 || d.getDay() === 6;

export interface GanttMonth {
  id: number;
  index: number;
  date: Date;
}

export const buildMonths = (days: Date[]): GanttMonth[] => {
  const list: GanttMonth[] = [];
  days.forEach((date, index) => {
    const id = date.getFullYear() * 12 + date.getMonth();
    if (list.at(-1)?.id !== id) list.push({ id, index, date });
  });
  return list;
};

export const placeTasks = (tasks: GanttTask[]): PlacedTask[] => {
  const groups = [...new Set(tasks.map((t) => t.group).filter((g): g is string => !!g))];
  return tasks.map((task, i) => ({
    task,
    key: task.id ?? i,
    start: toDay(task.start),
    end: toDay(task.end ?? task.start),
    color: task.color ?? seriesColor(task.group ? groups.indexOf(task.group) : 0),
  }));
};

/** Task rows in order, with a group row inserted whenever the group changes. */
export const buildRows = (placed: PlacedTask[]): GanttRow[] => {
  const rows: GanttRow[] = [];
  let current: string | undefined;
  for (const p of placed) {
    const group = p.task.group;
    if (group && group !== current) {
      current = group;
      rows.push({ kind: 'group', group });
    }
    rows.push({ kind: 'task', placed: p });
  }
  return rows;
};

const DEFAULT_PAD_BEFORE_DAYS = 2;
const DEFAULT_PAD_AFTER_DAYS = 3;
const EMPTY_BEFORE_DAYS = 7;
const EMPTY_AFTER_DAYS = 21;

/** Axis range: explicit bounds win, otherwise the tasks padded by a few days (or around today when empty). */
export const axisRange = (
  placed: PlacedTask[],
  start: GanttDate | undefined,
  end: GanttDate | undefined,
  today: Date,
): { from: Date; to: Date } => {
  const earliest = Math.min(...placed.map((p) => p.start.getTime()));
  const latest = Math.max(...placed.map((p) => p.end.getTime()));
  const hasTasks = placed.length > 0;
  return {
    from: start
      ? toDay(start)
      : addDays(hasTasks ? new Date(earliest) : today, hasTasks ? -DEFAULT_PAD_BEFORE_DAYS : -EMPTY_BEFORE_DAYS),
    to: end
      ? toDay(end)
      : addDays(hasTasks ? new Date(latest) : today, hasTasks ? DEFAULT_PAD_AFTER_DAYS : EMPTY_AFTER_DAYS),
  };
};

export const asArray = <T>(value: T | T[] | undefined): T[] =>
  value === undefined ? [] : Array.isArray(value) ? value : [value];

/** Elbow connector from the end of a predecessor (x1, y1) to the start of its successor (x2, y2). */
export const dependencyPath = (x1: number, y1: number, x2: number, y2: number, rowHeight: number): string =>
  x2 - x1 >= 14
    ? `M${x1},${y1}H${x1 + 7}V${y2}H${x2 - 1}`
    : `M${x1},${y1}h7V${y2 - rowHeight / 2}H${x2 - 9}V${y2}H${x2 - 1}`;
