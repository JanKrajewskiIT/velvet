import { createMemo, mergeProps, Show, splitProps } from 'solid-js';

import { createControllable } from '../../hooks/createControllable';
import { createDismiss } from '../../hooks/createDismiss';
import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import type { HtmlProps } from '../../utils/polymorphic';
import { Button } from '../actions/Button';
import { buttonClass } from '../actions/buttonClass';
import { Badge } from '../display/Badge';
import { Count } from '../primitives/Count';
import { Glyph } from '../primitives/Glyph';
import type { NotificationItem } from './NotificationItem';
import { NotificationList } from './NotificationList';

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
  const [isOpen, setOpen] = createControllable({
    value: () => local.open,
    defaultValue: local.defaultOpen,
    onChange: (next) => local.onOpenChange?.(next),
  });
  const unread = createMemo(() => local.items.filter((item) => item.unread).length);
  const translate = useTranslate();
  const title = () => local.title ?? translate('velvet.feedback.notificationCenter.title');
  let wrap: HTMLSpanElement | undefined;

  createDismiss(
    isOpen,
    () => setOpen(false),
    () => wrap,
  );

  return (
    <span {...rest} ref={wrap} class={cx('vui-popover-wrap', local.class)}>
      <button
        type="button"
        class={cx(buttonClass({ variant: 'ghost', icon: true }), 'vui-notif__bell')}
        aria-label={
          unread() > 0
            ? translate('velvet.feedback.notificationCenter.unreadLabel', { title: title(), count: unread() })
            : title()
        }
        aria-haspopup="dialog"
        aria-expanded={isOpen()}
        onClick={() => setOpen(!isOpen())}
      >
        <Glyph name="bell" />
        <Count value={unread()} max={MAX_BADGE_COUNT} size="sm" class="vui-indicator__item" aria-hidden="true" />
      </button>
      <Show when={isOpen()}>
        <div
          role="dialog"
          aria-label={title()}
          class={cx('vui-popover', 'vui-notif', local.align === 'end' && 'vui-popover--end')}
        >
          <div class="vui-notif__head">
            <span class="vui-notif__heading">
              {title()}
              <Show when={unread() > 0}>
                <Badge size="sm" tone="brand">
                  {translate('velvet.feedback.notificationCenter.newCount', { count: unread() })}
                </Badge>
              </Show>
            </span>
            <Show when={local.onMarkAllRead && unread() > 0}>
              <Button variant="link" size="sm" onClick={() => local.onMarkAllRead?.()}>
                {translate('velvet.feedback.notificationCenter.markAllRead')}
              </Button>
            </Show>
          </div>
          <NotificationList items={local.items} onItemClick={local.onItemClick} />
          <Show when={local.onViewAll}>
            <button type="button" class="vui-notif__foot" onClick={() => local.onViewAll?.()}>
              {translate('velvet.feedback.notificationCenter.viewAll')}
              <Glyph name="arrow-right" />
            </button>
          </Show>
        </div>
      </Show>
    </span>
  );
};
