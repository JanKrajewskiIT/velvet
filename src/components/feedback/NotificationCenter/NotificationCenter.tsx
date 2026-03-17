import { IoCheckmarkDone, IoTrash } from 'solid-icons/io';
import { createMemo, For, type JSX, Show, splitProps } from 'solid-js';

import Button from '~/components/buttons/Button/Button';
import IconButton from '~/components/buttons/IconButton/IconButton';
import Tooltip from '~/components/overlays/Tooltip/Tooltip';
import Heading from '~/components/typography/Heading/Heading';
import Text from '~/components/typography/Text/Text';
import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import Badge from '../Badge/Badge';
import {
  clearNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  notifications,
  removeNotification,
} from '../Toast/Toast';
import styles from './NotificationCenter.module.css';

interface NotificationCenterOwnProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  title?: string;
  emptyMessage?: string;
  markAllLabel?: string;
  clearAllLabel?: string;
  removeLabel?: string;
  maxItems?: number;
}

const NotificationCenter = (props: Props<NotificationCenterOwnProps>) => {
  const [local, rest] = splitProps(props, [
    'title',
    'emptyMessage',
    'markAllLabel',
    'clearAllLabel',
    'removeLabel',
    'maxItems',
    'class',
  ]);

  const items = createMemo(() => {
    const list = notifications();
    const max = local.maxItems;
    if (!max || max <= 0) return list;
    return list.slice(0, max);
  });

  const unreadCount = createMemo(() => notifications().filter((item) => !item.read).length);

  const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const readLabel = () => local.markAllLabel ?? 'Mark all as read';
  const clearLabel = () => local.clearAllLabel ?? 'Clear all';
  const dismissLabel = () => local.removeLabel ?? 'Dismiss';
  const markReadLabel = () => 'Mark as read';
  const hasNotifications = createMemo(() => notifications().length > 0);
  const handleItemRead = (id: string) => markNotificationRead(id);
  const handleItemRemove = (id: string) => removeNotification(id);

  return (
    <div {...rest} class={classNames(styles.wrapper, local.class)}>
      <div class={styles.header}>
        <div class={styles.titleRow}>
          <Heading as="h3" level={3} class={styles.title}>
            {local.title ?? 'Notifications'}
          </Heading>
          <Show when={unreadCount() > 0}>
            <span class={styles.badge}>{unreadCount()}</span>
          </Show>
        </div>
        <div class={styles.actions}>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            class={styles.actionButton}
            onClick={markAllNotificationsRead}
            disabled={unreadCount() === 0}
          >
            {readLabel()}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            class={styles.actionButton}
            onClick={clearNotifications}
            disabled={!hasNotifications()}
          >
            {clearLabel()}
          </Button>
        </div>
      </div>

      <Show
        when={items().length > 0}
        fallback={<div class={styles.empty}>{local.emptyMessage ?? 'No notifications yet.'}</div>}
      >
        <ul class={styles.list}>
          <For each={items()}>
            {(item) => (
              <li class={classNames(styles.item, !item.read && styles.itemUnread)}>
                <button
                  type="button"
                  class={styles.itemMain}
                  onClick={() => handleItemRead(item.id)}
                  aria-label={markReadLabel()}
                >
                  <Show when={!item.read} fallback={<span class={styles.dotPlaceholder} />}>
                    <Badge dot class={styles.dotBadge}>
                      <span class={styles.dotAnchor} />
                    </Badge>
                  </Show>
                  <Text
                    as="span"
                    variant="bodySm"
                    class={classNames(styles.message, !item.read && styles.messageWithBadge)}
                  >
                    {item.message}
                  </Text>
                  <Text as="span" variant="caption" tone="muted" class={styles.time}>
                    {formatDate(item.createdAt)}
                  </Text>
                </button>
                <div class={styles.itemActions}>
                  <Tooltip content={markReadLabel()}>
                    <IconButton
                      icon={<IoCheckmarkDone />}
                      title={markReadLabel()}
                      class={styles.iconButton}
                      onClick={() => handleItemRead(item.id)}
                      size="sm"
                      variant="subtle"
                    />
                  </Tooltip>
                  <Tooltip content={dismissLabel()}>
                    <IconButton
                      icon={<IoTrash />}
                      title={dismissLabel()}
                      class={styles.iconButton}
                      onClick={() => handleItemRemove(item.id)}
                      size="sm"
                      variant="subtle"
                    />
                  </Tooltip>
                </div>
              </li>
            )}
          </For>
        </ul>
      </Show>
    </div>
  );
};

export default NotificationCenter;
