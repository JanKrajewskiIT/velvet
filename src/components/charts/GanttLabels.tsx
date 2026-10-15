import { For, Match, Show, Switch } from 'solid-js';

import { cx } from '../../utils/cx';
import { Text } from '../primitives/Text';
import { typographyClass } from '../primitives/typography';
import type { GanttTimeline } from './createGanttTimeline';
import styles from './GanttLabels.module.css';

export interface GanttLabelsProps {
  timeline: GanttTimeline;
}

export const GanttLabels = (props: GanttLabelsProps) => (
  <div class={styles.ganttPartLabels}>
    <For each={props.timeline.rows()}>
      {(row) => (
        <Switch>
          <Match when={row.kind === 'group' && row}>
            {(g) => (
              <Text
                as="div"
                variant="section"
                tone="inherit"
                class={cx(styles.ganttPartLabel, styles.ganttPartLabelVariantGroup)}
              >
                {g().group}
              </Text>
            )}
          </Match>
          <Match when={row.kind === 'task' && row}>
            {(t) => (
              <div class={cx(styles.ganttPartLabel, typographyClass('body-sm'))}>
                <i style={{ background: t().placed.color }} />
                <Text as="span" variant="body-sm" tone="inherit" title={t().placed.task.name}>
                  {t().placed.task.name}
                </Text>
                <Show when={t().placed.task.progress !== undefined && !t().placed.task.milestone}>
                  <Text as="small" variant="caption" tone="inherit">
                    {t().placed.task.progress}%
                  </Text>
                </Show>
              </div>
            )}
          </Match>
        </Switch>
      )}
    </For>
  </div>
);
