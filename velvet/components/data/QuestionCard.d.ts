import * as React from 'react';
import type { CardProps } from '../display/Card';
/** Interview / quiz question card built on Card: category + level badges, question text, difficulty stars, time, tags, optional upvote, save and expandable model answer. Put several in a responsive grid. Without `answer` it renders a plain heading instead of an expander. Other Card / Surface props pass through. */
export interface QuestionCardProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  question: React.ReactNode;
  category?: string;
  /** @default 'brand' */
  categoryTone?: 'neutral' | 'brand' | 'success' | 'warning' | 'danger' | 'info';
  /** e.g. 'Senior' */
  level?: string;
  /** 1–5 stars, read-only */
  difficulty?: number;
  /** e.g. '15 min' */
  time?: string;
  tags?: string[];
  /** Model answer; adds the Show / Hide answer control */
  answer?: React.ReactNode;
  votes?: number;
  voted?: boolean;
  /** Shows the upvote button */
  onVote?: () => void;
  starred?: boolean;
  /** Shows the save (star) button */
  onStar?: () => void;
  expanded?: boolean;
  defaultExpanded?: boolean;
  onExpandedChange?: (open: boolean) => void;
  /** Card padding. @default 'sm' */
  padding?: CardProps['padding'];
  /** Card pass-through */
  variant?: CardProps['variant'];
  tone?: CardProps['tone'];
  accent?: CardProps['accent'];
  hoverable?: CardProps['hoverable'];
  reveal?: CardProps['reveal'];
  selected?: CardProps['selected'];
}
export declare function QuestionCard(props: QuestionCardProps): JSX.Element;
