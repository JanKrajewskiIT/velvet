import * as React from 'react';
export interface TimelineAction {
  id: string;
  label: string;
  /** Velvet icon — renders an icon button; without it the label is shown */
  icon?: string;
  tone?: 'default' | 'danger';
  disabled?: boolean;
  /** Ask inline before running. true = "<label>?" or pass the question text. */
  confirm?: boolean | string;
  confirmLabel?: string;
  /** Per-action handler (else Timeline.onAction). May return a Promise — the confirm row shows Working… and keeps open with the error on reject. */
  onClick?: (item: TimelineItem) => void | Promise<void>;
}
export interface TimelineItem {
  id?: string | number;
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Extra block — quote, attachment, diff, <Markdown> notes */
  content?: React.ReactNode;
  time?: string;
  datetime?: string;
  icon?: string;
  avatar?: React.ReactNode;
  /** Pipeline progress: done (green check + solid rail), current (brand, ringed), upcoming (hollow, muted). */
  status?: 'done' | 'current' | 'upcoming';
  tone?: 'neutral' | 'brand' | 'success' | 'warning' | 'danger' | 'info';
  /** Small status pill next to the title, e.g. { label: 'Synced', icon: 'check', tone: 'success' } */
  badge?: { label: React.ReactNode; icon?: string; tone?: 'neutral' | 'brand' | 'success' | 'warning' | 'danger' };
  /** Icon + text facts under the description — date, duration, location */
  meta?: { icon?: string; label: React.ReactNode }[];
  /** Row actions — revealed on hover / focus (always visible on touch) */
  actions?: TimelineAction[];
}
/**
 * Vertical activity/history feed. default = connecting rail + 32px markers (history, audit trail, interview schedule).
 * compact = no rail, 24px markers, one line per event. Items can carry a badge, meta facts and actions (edit / add to calendar /
 * delete) — destructive actions confirm inline; async handlers are awaited. onAdd appends a dashed "Add event" row.
 */
export interface TimelineProps {
  items: TimelineItem[];
  /** @default 'default' */
  variant?: 'default' | 'compact';
  /** Hairline between events */
  divided?: boolean;
  /** Fallback handler for actions without onClick */
  onAction?: (actionId: string, item: TimelineItem) => void | Promise<void>;
  onAdd?: () => void;
  /** @default 'Add event' */
  addLabel?: string;
  className?: string;
}
export declare function Timeline(props: TimelineProps): JSX.Element;
