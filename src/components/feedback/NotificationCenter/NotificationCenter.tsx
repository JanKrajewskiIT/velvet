import { IoCheckmarkDone, IoTrash } from 'solid-icons/io';
import { createMemo, For, type JSX, Show, splitProps } from 'solid-js';

import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import IconButton from '../../inputs/IconButton/IconButton';
import Heading from '../../typography/Heading/Heading';
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
          <button type="button" class={styles.action} onClick={markAllNotificationsRead} disabled={unreadCount() === 0}>
            {readLabel()}
          </button>
          <button
            type="button"
            class={styles.action}
            onClick={clearNotifications}
            disabled={notifications().length === 0}
          >
            {clearLabel()}
          </button>
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
                  onClick={() => markNotificationRead(item.id)}
                  aria-label="Mark as read"
                >
                  <span class={classNames(styles.dot, item.read && styles.dotRead)} />
                  <span class={styles.message}>{item.message}</span>
                  <span class={styles.time}>{formatDate(item.createdAt)}</span>
                </button>
                <div class={styles.itemActions}>
                  <IconButton
                    icon={<IoCheckmarkDone />}
                    title="Mark as read"
                    class={styles.iconButton}
                    onClick={() => markNotificationRead(item.id)}
                  />
                  <IconButton
                    icon={<IoTrash />}
                    title={dismissLabel()}
                    class={styles.iconButton}
                    onClick={() => removeNotification(item.id)}
                  />
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
