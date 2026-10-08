import * as React from 'react';
/**
 * Incremental "Show more" footer for feeds and card lists — a quiet progress bar ("Showing 20 of 120") over a dashed
 * button; replaced by "All N shown" at the end. Use Pagination when users need to jump to a page or share a URL to one.
 */
export interface LoadMoreProps {
  /** Items currently rendered */
  shown: number;
  /** Items available. Renders nothing when 0 */
  total: number;
  /** Page size — the button reads "Show 20 more" (capped at what's left) */
  step?: number;
  onLoadMore?: () => void;
  /** Spinner on the button while the next page loads */
  loading?: boolean;
  /** Button text override */
  label?: React.ReactNode;
  /** End text. @default 'All {total} shown' */
  doneLabel?: React.ReactNode;
  /** @default (shown, total) => 'Showing ' + shown + ' of ' + total */
  format?: (shown: number, total: number) => React.ReactNode;
  className?: string;
}
export declare function LoadMore(props: LoadMoreProps): JSX.Element | null;
