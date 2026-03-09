import { For, type JSX } from 'solid-js';

import type Props from '../../../models/Props';
import styles from './Timeline.module.css';

interface TimelineItem {
  key: string;
  dotClass?: string;
  content: JSX.Element;
}

interface TimelineProps {
  items: TimelineItem[];
  trailing?: JSX.Element;
}

const Timeline = (props: Props<TimelineProps>) => {
  return (
    <div class={`${styles.timeline} ${props.class ?? ''}`}>
      <For each={props.items}>
        {(item, index) => (
          <div class={styles.timelineItem} style={{ '--item-index': index() }}>
            <span class={`${styles.timelineDot} ${item.dotClass ?? ''}`} />
            {item.content}
          </div>
        )}
      </For>
      {props.trailing && (
        <div
          class={styles.addRow}
          style={{ '--item-count': props.items.length }}
        >
          <span class={styles.addDot} />
          {props.trailing}
        </div>
      )}
    </div>
  );
};

export default Timeline;
