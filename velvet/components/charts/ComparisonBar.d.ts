import * as React from 'react';
export interface ComparisonItem {
  id: string;
  label: string;
  description?: string;
  /** Initials / <img>; defaults to initials of label */
  avatar?: React.ReactNode;
  /** Series colour; defaults to --dv-N in order (same as RadarChart) */
  color?: string;
  /** Headline score shown in the column header */
  score?: React.ReactNode;
  /** Radar values keyed by axis key, 0–100 */
  scores?: Record<string, number>;
}
/**
 * Selection tray for "pick 2–4 things, then compare" (candidates, offers, plans). Slides up from the bottom when something is selected
 * (floating) or sits inline. Shows removable chips, empty slots up to min, a live hint ("Select 1 more…", "Compare up to 4…") and
 * Compare — disabled outside min…max.
 */
export interface ComparisonBarProps {
  items: ComparisonItem[];
  /** @default 2 */
  min?: number;
  /** @default 4 */
  max?: number;
  onRemove?: (id: string) => void;
  onClear?: () => void;
  onCompare?: () => void;
  compareLabel?: string;
  /** Singular / plural noun for the button. @default ['item', 'items'] */
  noun?: [string, string];
  /** Fixed to the viewport bottom, centred. @default true */
  floating?: boolean;
  className?: string;
}
export declare function ComparisonBar(props: ComparisonBarProps): JSX.Element;
export interface ComparisonRow {
  label: string;
  hint?: string;
  values: (string | number | null)[];
  /** Star the best value(s) — numeric rows only; ties for everyone are not starred */
  best?: 'max' | 'min';
  format?: (v: string | number | null) => React.ReactNode;
}
/**
 * Side-by-side comparison in a dialog: colour-keyed column headers, RadarChart across axes (≥3 axes with item.scores),
 * criteria table with best-value stars, and an optional AI insights block (generate on demand).
 */
export interface ComparisonDialogProps {
  open: boolean;
  onClose?: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  items: ComparisonItem[];
  axes?: { key: string; label: string }[];
  rows?: ComparisonRow[];
  /** Rendered insights (e.g. <Markdown>) — replaces the generate prompt */
  insights?: React.ReactNode;
  onGenerateInsights?: () => void;
  /** @default 'idle' */
  insightsStatus?: 'idle' | 'loading';
  insightsLabel?: string;
  /** @default 'done' */
  status?: 'loading' | 'done' | 'error';
  error?: React.ReactNode;
  onRetry?: () => void;
  /** @default 'lg' */
  size?: 'sm' | 'md' | 'lg';
  footer?: React.ReactNode;
}
export declare function ComparisonDialog(props: ComparisonDialogProps): JSX.Element;
