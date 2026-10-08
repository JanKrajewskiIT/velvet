import type { JSX } from 'solid-js';

import type { StatusTone } from '../../utils/tone';

export type TimelineStatus = 'done' | 'current' | 'upcoming';

export interface TimelineAction {
  id: string;
  label: string;
  /** Velvet icon — renders an icon button; without it the label is shown. */
  icon?: string;
  tone?: 'default' | 'danger';
  disabled?: boolean;
  /** Ask inline before running. true = "<label>?" or pass the question text. */
  confirm?: boolean | string;
  confirmLabel?: string;
  /** Per-action handler (else Timeline.onAction). May return a Promise — the confirm row shows a busy button and stays open on reject. */
  onClick?: (item: TimelineItem) => void | Promise<void>;
}

export interface TimelineBadge {
  label: JSX.Element;
  icon?: string;
  tone?: StatusTone;
}

export interface TimelineMeta {
  icon?: string;
  label: JSX.Element;
}

export interface TimelineItem {
  id?: string | number;
  title: JSX.Element;
  description?: JSX.Element;
  /** Extra block — quote, attachment, diff, <Markdown> notes. */
  content?: JSX.Element;
  time?: string;
  datetime?: string;
  icon?: string;
  avatar?: JSX.Element;
  /** Pipeline progress: done (green check + solid rail), current (brand, ringed), upcoming (hollow, muted). */
  status?: TimelineStatus;
  tone?: StatusTone;
  /** Small status pill next to the title, e.g. `{ label: 'Synced', icon: 'check', tone: 'success' }`. */
  badge?: TimelineBadge;
  /** Icon + text facts under the description — date, duration, location. */
  meta?: TimelineMeta[];
  /** Row actions — revealed on hover / focus (always visible on touch). */
  actions?: TimelineAction[];
}
