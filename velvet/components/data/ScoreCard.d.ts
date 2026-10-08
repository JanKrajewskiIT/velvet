import * as React from 'react';
import type { CardProps } from '../display/Card';
export interface ScoreCriterion { label: React.ReactNode; /** 0–100 */ value: number; tone?: 'brand' | 'success' | 'warning' | 'danger' | 'info' }
/** Result card built on Card for a computed score (ATS match, quiz result, health check): ring + verdict badge + per-criterion bars. Tone follows the score (≥75 success, ≥50 warning, else danger) unless set; it also drives the Card's accent strip / tonal hover. For a single KPI use Stat. */
export interface ScoreCardProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  label: React.ReactNode;
  /** 0–100 */
  score: number;
  /** Short verdict, e.g. 'Strong match' */
  verdict?: string;
  hint?: React.ReactNode;
  criteria?: ScoreCriterion[];
  tone?: 'brand' | 'success' | 'warning' | 'danger' | 'info';
  /** Card pass-through */
  padding?: CardProps['padding'];
  variant?: CardProps['variant'];
  accent?: CardProps['accent'];
  hoverable?: CardProps['hoverable'];
  tonal?: CardProps['tonal'];
  reveal?: CardProps['reveal'];
}
export declare function ScoreCard(props: ScoreCardProps): JSX.Element;
