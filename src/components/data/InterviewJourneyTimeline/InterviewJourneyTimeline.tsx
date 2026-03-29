import { createMemo, type JSX, Show } from 'solid-js';

import Timeline from '~/components/data/Timeline/Timeline';
import EmptyState from '~/components/feedback/EmptyState/EmptyState';
import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './InterviewJourneyTimeline.module.css';

type InterviewJourneyTimelineStatusTone = 'default' | 'success' | 'danger' | 'muted';

interface InterviewJourneyTimelineItem {
  key: string;
  statusTone?: InterviewJourneyTimelineStatusTone;
  content: JSX.Element;
}

interface InterviewJourneyTimelineProps {
  items: readonly InterviewJourneyTimelineItem[];
  emptyMessage: string;
  emptyHint?: string;
  action?: JSX.Element;
}

const dotClassMap: Record<Exclude<InterviewJourneyTimelineStatusTone, 'default'>, string | undefined> = {
  success: styles.statusSuccess,
  danger: styles.statusDanger,
  muted: styles.statusMuted,
};

const InterviewJourneyTimeline = (props: Props<InterviewJourneyTimelineProps>) => {
  const timelineItems = createMemo(() =>
    props.items.map((item) => ({
      key: item.key,
      dotClass: item.statusTone && item.statusTone !== 'default' ? dotClassMap[item.statusTone] : undefined,
      content: item.content,
    }))
  );

  return (
    <div class={classNames(styles.wrapper, props.class)}>
      <Show
        when={props.items.length > 0}
        fallback={<EmptyState message={props.emptyMessage} hint={props.emptyHint} action={props.action} />}
      >
        <Timeline items={timelineItems()} trailing={props.action} />
      </Show>
    </div>
  );
};

export type { InterviewJourneyTimelineItem, InterviewJourneyTimelineProps, InterviewJourneyTimelineStatusTone };
export default InterviewJourneyTimeline;
