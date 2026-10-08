import { For, type JSX, Show, splitProps } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import type { HtmlProps } from '../../utils/polymorphic';
import { toneIcon } from '../../utils/tone';
import { Dot } from '../primitives/Dot';
import { EmptyText } from '../primitives/EmptyText';
import { IconTile } from '../primitives/IconTile';
import { ListItem } from '../primitives/ListItem';
import type { NotificationItem } from './NotificationItem';

export interface NotificationListProps extends HtmlProps<HTMLUListElement, 'onClick'> {
  items: readonly NotificationItem[];
  onItemClick?: (item: NotificationItem) => void;
  /** @default localized "You’re all caught up." */
  emptyText?: string;
}

const leadingOf = (item: NotificationItem): JSX.Element =>
  item.avatar ?? (
    <IconTile
      size="sm"
      shape="circle"
      tone={item.tone && item.tone !== 'neutral' ? item.tone : undefined}
      icon={item.icon ?? toneIcon(item.tone)}
    />
  );

/** `ListItem` shows its trailing slot whenever it is not null, so a read item passes nothing. */
const unreadMarker = (item: NotificationItem, label: string): JSX.Element => {
  if (!item.unread) return undefined;
  return <Dot size="lg" tone="brand" label={label} class="vui-notif__dot" />;
};

/** The bare notification list (for a full activity page). */
export const NotificationList = (props: NotificationListProps) => {
  const [local, rest] = splitProps(props, ['items', 'onItemClick', 'emptyText', 'class']);
  const translate = useTranslate();
  const emptyText = () => local.emptyText ?? translate('velvet.feedback.notificationList.emptyText');
  return (
    <Show
      when={local.items.length > 0}
      fallback={
        <EmptyText icon="circle-check" class="vui-notif__empty">
          {emptyText()}
        </EmptyText>
      }
    >
      <ul {...rest} class={cx('vui-notif__list', local.class)}>
        <For each={local.items}>
          {(item) => (
            <li>
              <ListItem
                as="button"
                align="start"
                clamp={2}
                class={cx('vui-notif__item', item.unread && 'vui-notif__item--unread')}
                onClick={() => local.onItemClick?.(item)}
                leading={leadingOf(item)}
                title={item.title}
                description={item.body}
                meta={item.time}
                trailing={unreadMarker(item, translate('velvet.feedback.notificationList.unread'))}
              />
            </li>
          )}
        </For>
      </ul>
    </Show>
  );
};
