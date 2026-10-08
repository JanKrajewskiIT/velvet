import * as React from 'react';
/**
 * Timeline of tasks on a date axis — sticky task column and header, month + day / week scale, weekend shading, today line, progress strip, milestones and finish-to-start dependency arrows.
 * Tasks sharing `group` get a group row and a data-viz colour. Bars are buttons (name, dates and progress in the label). Scrolls to today on mount.
 * Use Scheduler for hour-level calendars, Timeline for an activity feed.
 */
export interface GanttTask {
  id?: string | number;
  name: string;
  /** Date or 'YYYY-MM-DD' */
  start: Date | string;
  /** Inclusive. Defaults to start. */
  end?: Date | string;
  /** 0–100 */
  progress?: number;
  group?: string;
  /** Overrides the group colour */
  color?: string;
  /** Diamond on `start` */
  milestone?: boolean;
  /** Task id(s) that must finish first — draws an arrow */
  dependsOn?: string | number | Array<string | number>;
}
export interface GanttProps {
  tasks: GanttTask[];
  /** day 36 px · week 16 px · month 5 px per day. @default 'day' */
  scale?: 'day' | 'week' | 'month';
  /** Axis range. Defaults to the tasks ±2–3 days. */
  start?: Date | string;
  end?: Date | string;
  /** @default new Date() */
  today?: Date | string;
  /** @default 220 */
  labelWidth?: number;
  /** @default 40 */
  rowHeight?: number;
  /** Max height before the body scrolls */
  height?: number | string;
  /** @default true */
  showDependencies?: boolean;
  onTaskClick?: (task: GanttTask) => void;
  /** @default 'en-US' */
  locale?: string;
  label?: string;
  className?: string;
}
export declare function Gantt(props: GanttProps): JSX.Element;
