import { createMemo, mergeProps, Show, splitProps } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import type { HtmlProps } from '../../utils/polymorphic';
import { Button } from '../actions/Button';
import { buttonClass } from '../actions/buttonClass';
import { Badge } from '../primitives/Badge';
import { Count } from '../primitives/Count';
import { Glyph } from '../primitives/Glyph';
import { Text } from '../primitives/Text';
import { typographyClass } from '../primitives/typography';
import styles from './NotificationCenter.module.css';
import type { NotificationItem } from './NotificationItem';
import { NotificationList } from './NotificationList';
import { Popover } from './Popover';

const MAX_BADGE_COUNT = 9;

export interface NotificationCenterProps extends HtmlProps<HTMLSpanElement, 'title' | 'onClick'> {
  items: readonly NotificationItem[];
  onItemClick?: (item: NotificationItem) => void;
  onMarkAllRead?: () => void;
  onViewAll?: () => void;
  /** Popover heading and bell label. @default localized "Notifications" */
  title?: string;
  /** Controlled open state. */
  open?: boolean;
  /** @default false */
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** @default 'end' */
  align?: 'start' | 'end';
}

/** Bell button with unread count → popover list with unread dots, colour-coded icons, "Mark all read" and a footer link. Put it in the app header, right side. */
export const NotificationCenter = (props: NotificationCenterProps) => {
  const merged = mergeProps({ defaultOpen: false, align: 'end' } satisfies Partial<NotificationCenterProps>, props);
  const [local, rest] = splitProps(merged, [
    'items',
    'onItemClick',
    'onMarkAllRead',
    'onViewAll',
    'title',
    'open',
    'defaultOpen',
    'onOpenChange',
    'align',
    'class',
  ]);
  const unread = createMemo(() => local.items.filter((item) => item.unread).length);
  const translate = useTranslate();
  const title = () => local.title ?? translate('velvet.feedback.notificationCenter.title');
  return (
    <Popover
      {...rest}
      open={local.open}
      defaultOpen={local.defaultOpen}
      onOpenChange={local.onOpenChange}
      align={local.align}
      label={title()}
      bare
      panelClassName={styles.notif}
      class={local.class}
      trigger={(triggerProps) => (
        <button
          {...triggerProps}
          type="button"
          class={cx(buttonClass({ variant: 'ghost', icon: true }), styles.notifPartBell)}
          aria-label={
            unread() > 0
              ? translate('velvet.feedback.notificationCenter.unreadLabel', { title: title(), count: unread() })
              : title()
          }
        >
          <Glyph name="bell" />
          <Show when={unread() > 0}>
            <Count
              value={unread()}
              max={MAX_BADGE_COUNT}
              size="sm"
              class={styles.indicatorPartItem}
              aria-hidden="true"
            />
          </Show>
        </button>
      )}
    >
      <div class={styles.notifPartHead}>
        <Text as="span" variant="title" tone="inherit" class={styles.notifPartHeading}>
          {title()}
          <Show when={unread() > 0}>
            <Badge size="sm" tone="brand">
              {translate('velvet.feedback.notificationCenter.newCount', { count: unread() })}
            </Badge>
          </Show>
        </Text>
        <Show when={local.onMarkAllRead && unread() > 0}>
          <Button variant="link" size="sm" onClick={() => local.onMarkAllRead?.()}>
            {translate('velvet.feedback.notificationCenter.markAllRead')}
          </Button>
        </Show>
      </div>
      <NotificationList items={local.items} onItemClick={local.onItemClick} />
      <Show when={local.onViewAll}>
        <button
          type="button"
          class={cx(styles.notifPartFoot, typographyClass('caption'))}
          onClick={() => local.onViewAll?.()}
        >
          {translate('velvet.feedback.notificationCenter.viewAll')}
          <Glyph name="arrow-right" />
        </button>
      </Show>
    </Popover>
  );
};
