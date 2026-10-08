import * as React from 'react';
/**
 * Atom. One row: leading (Avatar / IconTile / Checkbox / Swatch) · title · description · meta · trailing (Badge, Count, IconButton…).
 * List renders it; NotificationCenter, ImportSourcesDialog, ColorLabelManager and other pattern rows compose it instead of hand-rolled flex rows.
 * Interactive when it renders as button / a / label (hover, pressed, focus ring).
 */
export interface ListItemProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  /** Element — defaults to a (href), button (onClick) or div. 'label' wraps a Checkbox so the whole row toggles it. */
  as?: 'div' | 'button' | 'a' | 'label' | 'li';
  leading?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** Third line — timestamp, size, source */
  meta?: React.ReactNode;
  trailing?: React.ReactNode;
  selected?: boolean;
  disabled?: boolean;
  /** sm 40 · md 56 min-height. @default 'md' */
  size?: 'sm' | 'md';
  /** start = top-align leading/trailing for multi-line rows. @default 'center' */
  align?: 'center' | 'start';
  /** Description line clamp. @default 1 */
  clamp?: number;
  href?: string;
}
export declare function ListItem(props: ListItemProps): JSX.Element;
