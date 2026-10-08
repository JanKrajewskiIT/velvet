import * as React from 'react';
export interface NotificationItem {
  id: string | number;
  title: React.ReactNode;
  body?: React.ReactNode;
  /** "2m ago" */
  time?: string;
  unread?: boolean;
  tone?: 'neutral' | 'brand' | 'info' | 'success' | 'warning' | 'danger';
  icon?: string;
  /** Replaces the tone icon — e.g. an <Avatar size="sm"> */
  avatar?: React.ReactNode;
}
/** Bell button with unread count → popover list with unread dots, colour-coded icons, "Mark all read" and a footer link. Put it in the app header, right side. */
export interface NotificationCenterProps {
  items: NotificationItem[];
  onItemClick?: (item: NotificationItem) => void;
  onMarkAllRead?: () => void;
  onViewAll?: () => void;
  title?: string;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  align?: 'start' | 'end';
  className?: string;
}
export declare function NotificationCenter(props: NotificationCenterProps): JSX.Element;
/** The bare list (for a full activity page). */
export interface NotificationListProps { items: NotificationItem[]; onItemClick?: (item: NotificationItem) => void; emptyText?: string }
export declare function NotificationList(props: NotificationListProps): JSX.Element;
