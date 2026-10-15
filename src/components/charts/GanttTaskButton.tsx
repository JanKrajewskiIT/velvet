import { Show } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { clamp } from '../../utils/math';
import { Text } from '../primitives/Text';
import { typographyClass } from '../primitives/typography';
import type { GanttFormat } from './createGanttFormat';
import type { GanttTimeline } from './createGanttTimeline';
import { daysBetween, type GanttTask, type PlacedTask } from './ganttLayout';
import styles from './GanttTaskButton.module.css';

const BAR_HEIGHT = 24;
const OUTSIDE_NAME_MAX_PX = 160;
const NAME_CHAR_PX = 7;
const NAME_PADDING_PX = 20;

export interface GanttTaskButtonProps {
  placed: PlacedTask;
  timeline: GanttTimeline;
  format: GanttFormat;
  onClick?: (task: GanttTask) => void;
}

export const GanttTaskButton = (props: GanttTaskButtonProps) => {
  const translate = useTranslate();
  const barWidth = () => (daysBetween(props.placed.start, props.placed.end) + 1) * props.timeline.px();
  const rowTop = () => props.timeline.rowTop(props.placed.key);
  const spoken = () => props.format.taskLabel(props.placed);
  const nameOutside = () =>
    barWidth() < Math.min(OUTSIDE_NAME_MAX_PX, props.placed.task.name.length * NAME_CHAR_PX + NAME_PADDING_PX);

  return (
    <Show
      when={props.placed.task.milestone}
      fallback={
        <button
          type="button"
          class={cx(typographyClass('label-sm'), styles.ganttPartBar, nameOutside() && styles.ganttPartBarVariantOut)}
          style={{
            left: `${props.timeline.x(props.placed.start) + 1}px`,
            width: `${barWidth() - 2}px`,
            top: `${rowTop() + (props.timeline.rowHeight() - BAR_HEIGHT) / 2}px`,
            '--c': props.placed.color,
          }}
          aria-label={spoken()}
          title={spoken()}
          onClick={() => props.onClick?.(props.placed.task)}
        >
          <Show when={props.placed.task.progress}>
            {(progress) => <span class={styles.ganttPartProg} style={{ width: `${clamp(progress(), 0, 100)}%` }} />}
          </Show>
          <Text as="span" variant="label-sm" tone="inherit" class={styles.ganttPartName}>
            {props.placed.task.name}
          </Text>
        </button>
      }
    >
      <button
        type="button"
        class={styles.ganttPartMs}
        style={{
          left: `${props.timeline.x(props.placed.start) + props.timeline.px() / 2}px`,
          top: `${rowTop() + props.timeline.rowHeight() / 2}px`,
          '--c': props.placed.color,
        }}
        aria-label={translate('velvet.charts.gantt.milestone', { description: spoken() })}
        title={spoken()}
        onClick={() => props.onClick?.(props.placed.task)}
      >
        <Text as="span" variant="label-sm" tone="inherit">
          {props.placed.task.name}
        </Text>
      </button>
    </Show>
  );
};
