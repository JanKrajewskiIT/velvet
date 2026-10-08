import type { JSX } from 'solid-js';

export type AccordionVariant = 'separated' | 'flush' | 'elevated';

export interface AccordionItem {
  /** Stable key for `value` / `defaultValue`. Defaults to the item's index. */
  value?: string;
  title: JSX.Element;
  subtitle?: JSX.Element;
  /** Velvet icon name. */
  icon?: string;
  meta?: JSX.Element;
  content: JSX.Element;
  disabled?: boolean;
  /** elevated: 3px tone stripe on the left + tone glow when open */
  tone?: 'brand' | 'success' | 'warning' | 'danger' | 'info';
}
