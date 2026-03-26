import { IoCheckmarkDone, IoTrash } from 'solid-icons/io';
import { createMemo, For, Show, splitProps } from 'solid-js';

import Button from '~/components/buttons/Button/Button';
import IconButton from '~/components/buttons/IconButton/IconButton';
import Tooltip from '~/components/overlays/Tooltip/Tooltip';
import Heading from '~/components/typography/Heading/Heading';
import Text from '~/components/typography/Text/Text';
import { useI18n } from '~/i18n/I18nProvider';
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
  emptyMessage?: string;
  markAllLabel?: string;
  clearAllLabel?: string;
  removeLabel?: string;
  maxItems?: number;
}

const NotificationCenter = (props: Props<NotificationCenterOwnProps>) => {
  const { t } = useI18n();
  const [local, rest] = splitProps(props, [
    'label',
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
    return new Date(timestamp).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  };

  const readLabel = () => local.markAllLabel ?? t('notification.markAllRead');
  const clearLabel = () => local.clearAllLabel ?? t('notification.clearAll');
  const dismissLabel = () => local.removeLabel ?? t('common.dismiss');
  const markReadLabel = () => t('notification.markRead');
  const hasNotifications = createMemo(() => notifications().length > 0);
  const handleItemRead = (id: string) => markNotificationRead(id);
  const handleItemRemove = (id: string) => removeNotification(id);

  return (
    <div {...rest} class={classNames(styles.wrapper, local.class)}>
      <div class={styles.header}>
        <div class={styles.titleRow}>
          <Heading as="h3" level={5}>
            {local.label ?? t('common.notifications')}
          </Heading>
          <Show when={unreadCount() > 0}>
            <Badge content={unreadCount()} variant="primarySoft" inline>
              <span class={styles.badgeAnchor} />
            </Badge>
          </Show>
        </div>
        <div class={styles.actions}>
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
        </div>
      </div>

      <Show
        when={items().length > 0}
        fallback={
          <Text as="p" variant="bodySm" tone="muted" class={styles.empty}>
            {local.emptyMessage ?? t('notification.empty')}
          </Text>
        }
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
                  <Text as="span" variant="caption" tone="muted">
                    {formatDate(item.createdAt)}
                  </Text>
                </button>
                <div class={styles.itemActions}>
                  <Tooltip content={markReadLabel()}>
                    <IconButton
                      icon={IoCheckmarkDone}
                      label={markReadLabel()}
                      onClick={() => handleItemRead(item.id)}
                      size="sm"
                      variant="subtle"
                    />
                  </Tooltip>
                  <Tooltip content={dismissLabel()}>
                    <IconButton
                      icon={IoTrash}
                      label={dismissLabel()}
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
