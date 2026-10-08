import type { IconName } from './VelvetIcons';

/** Legacy alias name to canonical Velvet name. Prefer canonical names in new code. */
export const IconAliases = {
  close: 'x',
  trash: 'trash-2',
  edit: 'pencil',
  'alert-triangle': 'triangle-alert',
  'check-circle': 'circle-check',
  'x-circle': 'circle-x',
  'help-circle': 'circle-help',
  grid: 'layout-grid',
  attach: 'paperclip',
  badge: 'id-card',
  chat: 'message-square',
  message: 'message-square',
  warning: 'triangle-alert',
  success: 'circle-check',
  error: 'circle-x',
  help: 'circle-help',
  logout: 'log-out',
  expand: 'maximize',
} as const satisfies Record<string, IconName>;

export type IconAlias = keyof typeof IconAliases;
