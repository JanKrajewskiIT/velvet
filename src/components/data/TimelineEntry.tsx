import { For, Show } from 'solid-js';

import { cx } from '../../utils/cx';
import { Badge } from '../display/Badge';
import { Glyph } from '../primitives/Glyph';
import { Marker, type MarkerProps } from '../primitives/Marker';
import { RailItem } from '../primitives/RailItem';
import { TimelineActions } from './TimelineActions';
import { TimelineConfirm } from './TimelineConfirm';
import type { TimelineAction, TimelineItem } from './timelineTypes';

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
        'vui-timeline__item',
        `vui-timeline__item--${props.item.tone ?? 'neutral'}`,
        props.item.status && `vui-timeline__item--s-${props.item.status}`,
        !!props.item.actions?.length && 'vui-timeline__item--actionable',
        !!confirming() && 'vui-timeline__item--confirming',
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
      <div class="vui-timeline__body">
        <div class="vui-timeline__head">
          <span class="vui-timeline__title">{props.item.title}</span>
          <Show when={props.item.badge}>
            {(badge) => (
              <Badge size="sm" tone={badge().tone ?? 'neutral'} icon={badge().icon} class="vui-timeline__badge">
                {badge().label}
              </Badge>
            )}
          </Show>
          <Show when={props.item.time}>
            {(time) => (
              <time class="vui-timeline__time" dateTime={props.item.datetime}>
                {time()}
              </time>
            )}
          </Show>
          <TimelineActions item={props.item} confirmingId={props.confirmingId} onActivate={props.onActivate} />
        </div>
        <Show when={props.item.description}>
          {(description) => <div class="vui-timeline__desc">{description()}</div>}
        </Show>
        <Show when={props.item.meta?.length}>
          <ul class="vui-timeline__meta">
            <For each={props.item.meta}>
              {(fact) => (
                <li>
                  <Show when={fact.icon}>{(icon) => <Glyph name={icon()} />}</Show>
                  {fact.label}
                </li>
              )}
            </For>
          </ul>
        </Show>
        <Show when={props.item.content}>{(content) => <div class="vui-timeline__content">{content()}</div>}</Show>
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
