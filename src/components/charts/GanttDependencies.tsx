import { createUniqueId, For } from 'solid-js';

import { createGanttDependencies } from './createGanttDependencies';
import type { GanttTimeline } from './createGanttTimeline';
import styles from './GanttDependencies.module.css';

export interface GanttDependenciesProps {
  timeline: GanttTimeline;
  enabled: boolean;
}

export const GanttDependencies = (props: GanttDependenciesProps) => {
  const arrowId = createUniqueId();
  const dependencies = createGanttDependencies(
    () => props.timeline,
    () => props.enabled,
  );
  return (
    <svg
      class={styles.ganttPartDeps}
      width={props.timeline.canvasWidth()}
      height={props.timeline.canvasHeight()}
      aria-hidden="true"
    >
      <defs>
        <marker id={arrowId} viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0,0L8,4L0,8z" class={styles.ganttPartArrow} />
        </marker>
      </defs>
      <For each={dependencies()}>
        {(dep) => <path d={dep.d} class={styles.ganttPartDep} marker-end={`url(#${arrowId})`} />}
      </For>
    </svg>
  );
};
