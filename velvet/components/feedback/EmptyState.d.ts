import * as React from 'react';
export type StateTone = 'brand' | 'danger' | 'warning' | 'info' | 'success' | 'neutral';
/** No-data placeholder: tinted icon circle + title + description + actions (use size="sm" buttons). sm = inline (card, table, list) · md = section · lg = whole page. Always offer the next action. */
export interface EmptyStateProps { icon?: string | null; title?: React.ReactNode; description?: React.ReactNode; actions?: React.ReactNode; size?: 'sm' | 'md' | 'lg'; /** Icon circle colour. @default 'brand' */ tone?: StateTone; className?: string; /** Extra content under the actions */ children?: React.ReactNode }
export declare function EmptyState(props: EmptyStateProps): JSX.Element;
/** Failed-to-load placeholder with Retry and optional collapsible technical details. */
export interface ErrorStateProps { title?: React.ReactNode; description?: React.ReactNode; onRetry?: () => void; retryLabel?: string; /** Error text / stack, hidden behind "Show details" */ details?: string; icon?: string; size?: 'sm' | 'md' | 'lg'; className?: string }
export declare function ErrorState(props: ErrorStateProps): JSX.Element;
/**
 * The end of a page or flow — errors (404 / 403 / 500 / offline) and outcomes (success / warning / info, e.g. "Payment received").
 * Same layout as EmptyState. size lg = full page with a code watermark; md / sm = inside a section, card or dialog, error code as an
 * "Error 404" overline. Default copy + tone per status — override title/description. children = details under the actions (receipt, error id).
 * Use EmptyState for "nothing here yet", ErrorState for a section that failed to load.
 */
export interface StatusPageProps {
  /** Error code or outcome. @default 404 */
  code?: 404 | 403 | 500 | 'offline' | 'success' | 'warning' | 'info';
  /** Alias of code — reads better for outcomes: status="success" */
  status?: 404 | 403 | 500 | 'offline' | 'success' | 'warning' | 'info';
  title?: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  icon?: string;
  tone?: StateTone;
  /** @default 'lg' */
  size?: 'sm' | 'md' | 'lg';
  /** Details under the actions */
  children?: React.ReactNode;
  className?: string;
}
export declare function StatusPage(props: StatusPageProps): JSX.Element;
