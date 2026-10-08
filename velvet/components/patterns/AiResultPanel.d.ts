import * as React from 'react';
/** Surface for a structured (non-chat) model answer: provenance header (model · time), optional score ring with auto tone, headline, summary, titled finding lists in a responsive grid, numbered sources, disclaimer, and a footer with Copy (plain text), Regenerate, Helpful? Yes / No and token / cost meta. status: streaming shows skeletons (or the partial content + a writing line); error shows an inline alert with Retry. Always show what produced the result and what it cost. */
export interface AiSection { title: string; icon?: string; tone?: 'neutral' | 'brand' | 'success' | 'warning' | 'danger' | 'info'; items: React.ReactNode[] }
export interface AiSource { label: string; href?: string; detail?: string }
export interface AiResultPanelProps {
  /** @default 'AI analysis' */
  title?: string;
  model?: string;
  elapsed?: string;
  /** @default 'done' */
  status?: 'streaming' | 'done' | 'error';
  error?: React.ReactNode;
  score?: number;
  /** @default 100 */
  scoreMax?: number;
  /** Default: ≥75% success, ≥50% warning, else danger */
  scoreTone?: 'brand' | 'success' | 'warning' | 'danger' | 'neutral';
  headline?: React.ReactNode;
  subline?: React.ReactNode;
  summary?: React.ReactNode;
  sections?: AiSection[];
  sources?: AiSource[];
  tokens?: number;
  /** Preformatted, e.g. "$0.0021" */
  cost?: string;
  /** Pass '' to hide */
  disclaimer?: string;
  onRegenerate?: () => void;
  /** Shows Helpful? Yes / No; null when un-voted */
  onFeedback?: (v: 'up' | 'down' | null) => void;
  feedback?: 'up' | 'down' | null;
  onCopy?: (text: string) => void;
  className?: string;
}
export declare function AiResultPanel(props: AiResultPanelProps): JSX.Element;
