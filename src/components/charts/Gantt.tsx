import { mergeProps, onMount } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { createGanttFormat } from './createGanttFormat';
import { createGanttTimeline } from './createGanttTimeline';
import { GanttCanvas } from './GanttCanvas';
import { GanttHeader } from './GanttHeader';
import { GanttLabels } from './GanttLabels';
import type { GanttScale, GanttTask } from './ganttLayout';

const SCROLL_LEAD_DAYS = 4;

export interface GanttProps {
  tasks: GanttTask[];
  /** day 36 px · week 16 px · month 5 px per day. @default 'day' */
  scale?: GanttScale;
  /** Axis range. Defaults to the tasks ±2–3 days. */
  start?: Date | string;
  end?: Date | string;
  /** @default new Date() */
  today?: Date | string;
  /** px. @default 220 */
  labelWidth?: number;
  /** px. @default 40 */
  rowHeight?: number;
  /** Max height before the body scrolls. */
  height?: number | string;
  /** @default true */
  showDependencies?: boolean;
  onTaskClick?: (task: GanttTask) => void;
  /** Month and date names. @default the active locale */
  locale?: string;
  /** Accessible name. @default localized "Project timeline" */
  label?: string;
  class?: string;
}

/** Timeline of tasks on a date axis — sticky task column and header, month + day / week scale, weekend shading, today line, progress strip, milestones and finish-to-start dependency arrows. Bars are buttons whose label carries name, dates and progress. Scrolls to today on mount. */
export const Gantt = (props: GanttProps) => {
  const merged = mergeProps(
    { scale: 'day', labelWidth: 220, rowHeight: 40, showDependencies: true } satisfies Partial<GanttProps>,
    props,
  );
  const translate = useTranslate();
  const label = () => merged.label ?? translate('velvet.charts.gantt.label');
  let scroller: HTMLDivElement | undefined;

  const timeline = createGanttTimeline({
    tasks: () => merged.tasks,
    scale: () => merged.scale,
    start: () => merged.start,
    end: () => merged.end,
    today: () => merged.today,
    rowHeight: () => merged.rowHeight,
  });
  const format = createGanttFormat({ locale: () => merged.locale, px: timeline.px });

  onMount(() => {
    const at = timeline.todayX();
    if (scroller && at !== undefined) scroller.scrollLeft = Math.max(0, at - timeline.px() * SCROLL_LEAD_DAYS);
  });

  return (
    <div
      class={cx('vui-gantt', `vui-gantt--${merged.scale}`, merged.class)}
      style={{ '--gantt-label': `${merged.labelWidth}px`, '--row': `${merged.rowHeight}px` }}
      role="group"
      aria-label={label()}
    >
      <div
        ref={(element) => {
          scroller = element;
        }}
        class="vui-gantt__scroll"
        style={{ 'max-height': typeof merged.height === 'number' ? `${merged.height}px` : merged.height }}
      >
        <div style={{ width: `${merged.labelWidth + timeline.canvasWidth()}px` }}>
          <GanttHeader timeline={timeline} format={format} />
          <div class="vui-gantt__body">
            <GanttLabels timeline={timeline} />
            <GanttCanvas
              timeline={timeline}
              format={format}
              showDependencies={merged.showDependencies}
              onTaskClick={merged.onTaskClick}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
