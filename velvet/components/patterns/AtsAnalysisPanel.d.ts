import * as React from 'react';
export type AtsSeverity = 'critical' | 'warning' | 'suggestion';
export interface AtsCategory { label: string; /** 0–100; non-finite → 0 */ score: number; /** Shown as ×weight */ weight?: number; note?: React.ReactNode }
export interface AtsRecommendation { severity: AtsSeverity; title: React.ReactNode; message?: React.ReactNode; /** Quote from the source that supports the finding */ evidence?: { quote: string; source?: string } }
export interface AtsResult {
  /** Overall 0–100 */
  score: number;
  /** One-line headline, e.g. "Strong on systems work, light on people leadership" */
  verdict?: React.ReactNode;
  summary?: React.ReactNode;
  categories?: AtsCategory[];
  keywords?: { matched?: string[]; partial?: string[]; missing?: string[] };
  strengths?: React.ReactNode[];
  gaps?: React.ReactNode[];
  recommendations?: AtsRecommendation[];
}
export interface ScoreBand { min: number; label: string; short: string; tone: 'success' | 'brand' | 'warning' | 'danger' }
/**
 * Result of a candidate ↔ role (or CV ↔ ATS) analysis. Score ring with band (≥86 Excellent · ≥71 Strong · ≥51 Partial · else Weak —
 * same thresholds as the legacy VelvetUi panel), verdict + summary, weighted category bars, keyword coverage (found / partial / missing),
 * strengths vs gaps, and recommendations sorted critical → warning → suggestion with optional evidence quotes. Footer: copy as text,
 * export, re-run, accuracy feedback. Pair with <AnalysisRequest> for the input side.
 */
export interface AtsAnalysisPanelProps {
  /** @default 'done' */
  status?: 'empty' | 'loading' | 'done' | 'error';
  result?: AtsResult | null;
  /** e.g. candidate name */
  subject?: React.ReactNode;
  /** e.g. role title */
  target?: React.ReactNode;
  title?: string;
  model?: string;
  generatedAt?: string;
  /** Loading progress labels + current index */
  steps?: string[];
  step?: number;
  error?: React.ReactNode;
  onRetry?: () => void;
  onRerun?: () => void;
  onExport?: () => void;
  onFeedback?: (v: 'up' | 'down' | null) => void;
  /** Override thresholds / labels */
  bands?: ScoreBand[];
  disclaimer?: React.ReactNode;
  className?: string;
}
export declare function AtsAnalysisPanel(props: AtsAnalysisPanelProps): JSX.Element;
export declare const SCORE_BANDS: ScoreBand[];
export declare function scoreBand(score: number, bands?: ScoreBand[]): ScoreBand;
