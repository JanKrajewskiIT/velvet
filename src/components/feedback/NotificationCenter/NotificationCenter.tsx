import { IoCheckmarkDone, IoTrash } from 'solid-icons/io';
import { createMemo, For, Show, splitProps } from 'solid-js';

import Button from '~/components/buttons/Button/Button';
import IconButton from '~/components/buttons/IconButton/IconButton';
import Tooltip from '~/components/overlays/Tooltip/Tooltip';
import Stack from '~/components/surfaces/Stack/Stack';
import Heading from '~/components/typography/Heading/Heading';
import Text from '~/components/typography/Text/Text';
import { useI18n } from '~/i18n';
import type Props from '~/models/Props';
import type { DivCoreNativeProps } from '~/models/Props';
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

interface NotificationCenterOwnProps extends Omit<DivCoreNativeProps, 'onChange'> {
  label?: string;
  maxItems?: number;
}

const NotificationCenter = (props: Props<NotificationCenterOwnProps>) => {
  const { ts } = useI18n();
  const [local, rest] = splitProps(props, ['label', 'maxItems', 'role', 'aria-label', 'aria-labelledby', 'class']);

  const items = createMemo(() => {
    const list = notifications();
    const max = local.maxItems;
    if (!max || max <= 0) return list;
    return list.slice(0, max);
  });

  const unreadCount = createMemo(() => notifications().filter((item) => !item.read).length);

  const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  };

  const panelLabel = createMemo(() => local.label ?? ts('common.notifications'));
  const readLabel = createMemo(() => ts('notification.markAllRead'));
  const clearLabel = createMemo(() => ts('notification.clearAll'));
  const dismissLabel = createMemo(() => ts('common.dismiss'));
  const markReadLabel = createMemo(() => ts('notification.markRead'));
  const emptyMessage = createMemo(() => ts('notification.empty'));
  const hasNotifications = createMemo(() => notifications().length > 0);

  return (
    <Stack
      {...rest}
      gap="md"
      role={local.role ?? 'region'}
      aria-label={local['aria-labelledby'] ? undefined : (local['aria-label'] ?? panelLabel())}
      aria-labelledby={local['aria-labelledby']}
      aria-live="polite"
      class={classNames(styles.wrapper, local.class)}
    >
      <Stack direction="horizontal" align="center" justify="between" gap="md" wrap>
        <Stack direction="horizontal" align="center" gap="xs">
          <Heading as="h3" level={5}>
            {panelLabel()}
          </Heading>
          <Show when={unreadCount() > 0}>
            <Badge content={unreadCount()} variant="primarySoft" inline>
              <span class={styles.badgeAnchor} />
            </Badge>
          </Show>
        </Stack>
        <Stack direction="horizontal" gap="xs" wrap>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={markAllNotificationsRead}
            disabled={unreadCount() === 0}
          >
            {readLabel()}
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={clearNotifications} disabled={!hasNotifications()}>
            {clearLabel()}
          </Button>
        </Stack>
      </Stack>

      <Show
        when={items().length > 0}
        fallback={
          <div class={styles.empty} role="status">
            <Text as="p" variant="bodySm" tone="muted">
              {emptyMessage()}
            </Text>
          </div>
        }
      >
        <ul class={styles.list}>
          <For each={items()}>
            {(item) => (
              <li class={classNames(styles.item, !item.read && styles.itemUnread)}>
                <button type="button" class={styles.itemMain} onClick={() => markNotificationRead(item.id)}>
                  <Show when={!item.read} fallback={<span class={styles.dotPlaceholder} />}>
                    <Badge dot class={styles.dotBadge}>
                      <span class={styles.dotAnchor} />
                    </Badge>
                  </Show>
                  <div class={styles.itemCopy}>
                    <Text
                      as="span"
                      variant="bodySm"
                      class={classNames(styles.message, !item.read && styles.messageWithBadge)}
                    >
                      {item.message}
                    </Text>
                    <Text as="span" variant="caption" tone="muted" class={styles.timestamp}>
                      {formatDate(item.createdAt)}
                    </Text>
                  </div>
                </button>
                <Stack direction="horizontal" align="center" gap="2xs" class={styles.itemActions}>
                  <Show when={!item.read}>
                    <Tooltip content={markReadLabel()}>
                      <IconButton
                        icon={IoCheckmarkDone}
                        label={markReadLabel()}
                        onClick={() => markNotificationRead(item.id)}
                        size="sm"
                        variant="subtle"
                      />
                    </Tooltip>
                  </Show>
                  <Tooltip content={dismissLabel()}>
                    <IconButton
                      icon={IoTrash}
                      label={dismissLabel()}
                      onClick={() => removeNotification(item.id)}
                      size="sm"
                      variant="subtle"
                    />
                  </Tooltip>
                </Stack>
              </li>
            )}
          </For>
        </ul>
      </Show>
    </Stack>
  );
};

export default NotificationCenter;
