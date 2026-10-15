import { For, Show } from 'solid-js';

import { variantClass } from '../../utils/cssModule';
import { cx } from '../../utils/cx';
import { Badge } from '../display/Badge';
import { Glyph } from '../primitives/Glyph';
import { Marker, type MarkerProps } from '../primitives/Marker';
import { RailItem } from '../primitives/RailItem';
import { Text } from '../primitives/Text';
import { typographyClass } from '../primitives/typography';
import { TimelineActions } from './TimelineActions';
import { TimelineConfirm } from './TimelineConfirm';
import styles from './TimelineEntry.module.css';
import type { TimelineAction, TimelineItem } from './timelineTypes';

const TIMELINE_PART_ITEM_CLASSES = {
  actionable: styles.timelinePartItemVariantActionable,
  confirming: styles.timelinePartItemVariantConfirming,
  's-current': styles.timelinePartItemVariantSCurrent,
  's-upcoming': styles.timelinePartItemVariantSUpcoming,
} as const;

const TIMELINE_PART_ITEM_VARIANT_CLASSES = {
  current: styles.timelinePartItemVariantSCurrent,
  upcoming: styles.timelinePartItemVariantSUpcoming,
} as const;

export interface TimelineEntryProps {
  item: TimelineItem;
  compact: boolean;
  /** Id of the action awaiting confirmation on this item. */
  confirmingId: string | undefined;
  busy: boolean;
  error: string | undefined;
  onActivate: (action: TimelineAction) => void;
  onCancel: () => void;
  onConfirm: (action: TimelineAction) => void;
}

const markerFor = (item: TimelineItem, compact: boolean): MarkerProps => {
  const tone = item.tone && item.tone !== 'neutral' ? item.tone : undefined;
  return {
    size: compact ? 'sm' : 'lg',
    gap: !compact,
    appearance: item.status === 'current' ? 'solid' : item.status === 'upcoming' ? 'outline' : 'soft',
    tone:
      item.status === 'done'
        ? 'success'
        : item.status === 'current'
          ? (tone ?? 'brand')
          : item.status === 'upcoming'
            ? undefined
            : tone,
    ring: item.status === 'current',
  };
};

/** One event of a Timeline: marker, head (title, badge, time, actions), description, facts, content and inline confirmation. */
export const TimelineEntry = (props: TimelineEntryProps) => {
  const confirming = () => props.item.actions?.find((action) => action.id === props.confirmingId);
  const railState = () =>
    props.item.status === 'done' ? 'done' : props.item.status === 'upcoming' ? 'dashed' : undefined;
  return (
    <RailItem
      state={railState()}
      class={cx(
        styles.timelinePartItem,
        variantClass(TIMELINE_PART_ITEM_CLASSES, props.item.tone ?? 'neutral'),
        props.item.status && variantClass(TIMELINE_PART_ITEM_VARIANT_CLASSES, props.item.status),
        !!props.item.actions?.length && styles.timelinePartItemVariantActionable,
        !!confirming() && styles.timelinePartItemVariantConfirming,
      )}
    >
      <Marker
        class="vui-timeline__marker"
        aria-hidden="true"
        {...markerFor(props.item, props.compact)}
        dot={!props.item.avatar && !props.item.icon && props.item.status !== 'done'}
      >
        <Show when={props.item.avatar} fallback={<Glyph name={props.item.icon || 'check'} />}>
          {props.item.avatar}
        </Show>
      </Marker>
      <div class={styles.timelinePartBody}>
        <div class={styles.timelinePartHead}>
          <Text
            as="span"
            variant={props.item.status === 'current' ? 'label' : 'body-sm'}
            tone="primary"
            class={styles.timelinePartTitle}
          >
            {props.item.title}
          </Text>
          <Show when={props.item.badge}>
            {(badge) => (
              <Badge size="sm" tone={badge().tone ?? 'neutral'} icon={badge().icon} class="vui-timeline__badge">
                {badge().label}
              </Badge>
            )}
          </Show>
          <Show when={props.item.time}>
            {(time) => (
              <Text
                as="time"
                variant="caption"
                tone="tertiary"
                class={styles.timelinePartTime}
                dateTime={props.item.datetime}
              >
                {time()}
              </Text>
            )}
          </Show>
          <TimelineActions item={props.item} confirmingId={props.confirmingId} onActivate={props.onActivate} />
        </div>
        <Show when={props.item.description}>
          {(description) => (
            <Text
              as="div"
              variant={props.compact ? 'caption' : 'body-sm'}
              tone={props.compact ? 'tertiary' : 'secondary'}
              class={styles.timelinePartDesc}
            >
              {description()}
            </Text>
          )}
        </Show>
        <Show when={props.item.meta?.length}>
          <ul class={cx(styles.timelinePartMeta, typographyClass('caption'))}>
            <For each={props.item.meta}>
              {(fact) => (
                <Text as="li" variant="caption" tone="inherit">
                  <Show when={fact.icon}>{(icon) => <Glyph name={icon()} />}</Show>
                  {fact.label}
                </Text>
              )}
            </For>
          </ul>
        </Show>
        <Show when={props.item.content}>
          {(content) => (
            <Text as="div" variant="body-sm" tone="secondary" class={styles.timelinePartContent}>
              {content()}
            </Text>
          )}
        </Show>
        <Show when={confirming()}>
          {(action) => (
            <TimelineConfirm
              action={action()}
              busy={props.busy}
              error={props.error}
              onCancel={props.onCancel}
              onConfirm={() => props.onConfirm(action())}
            />
          )}
        </Show>
      </div>
    </RailItem>
  );
};
