import type { JSX } from 'solid-js';

import type { StatusTone } from '../../utils/tone';

export interface NotificationItem {
  id: string | number;
  title: JSX.Element;
  body?: JSX.Element;
  /** Relative time, e.g. "2m ago". */
  time?: string;
  unread?: boolean;
  tone?: StatusTone;
  icon?: string;
  /** Replaces the tone icon — e.g. an `<Avatar size="sm">`. */
  avatar?: JSX.Element;
}
