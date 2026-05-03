import { createMemo, type JSX, Show } from 'solid-js';

import Timeline from '~/components/data/Timeline/Timeline';
import EmptyState from '~/components/feedback/EmptyState/EmptyState';
import { useI18n } from '~/i18n';
import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './StatusTimeline.module.css';

type StatusTimelineStatusTone = 'default' | 'success' | 'danger' | 'muted';

interface StatusTimelineItem {
  key: string;
  statusTone?: StatusTimelineStatusTone;
  content: JSX.Element;
}

interface StatusTimelineProps {
  items: readonly StatusTimelineItem[];
  emptyMessage: string;
  action?: JSX.Element;
}

const dotClassMap: Record<Exclude<StatusTimelineStatusTone, 'default'>, string | undefined> = {
  success: styles.dotSuccess,
  danger: styles.dotDanger,
  muted: styles.dotMuted,
};

const StatusTimeline = (props: Props<StatusTimelineProps>) => {
  const { ts } = useI18n();
  const timelineItems = createMemo(() =>
    props.items.map((item) => ({
      key: item.key,
      dotClass: item.statusTone && item.statusTone !== 'default' ? dotClassMap[item.statusTone] : undefined,
      content: item.content,
    })),
  );

  return (
    <div class={classNames(styles.wrapper, props.class)}>
      <Show
        when={props.items.length > 0}
        fallback={<EmptyState message={props.emptyMessage} hint={ts('common.noItems')} action={props.action} />}
      >
        <Timeline items={timelineItems()} trailing={props.action} />
      </Show>
    </div>
  );
};

export type { StatusTimelineItem, StatusTimelineProps, StatusTimelineStatusTone };
export default StatusTimeline;
