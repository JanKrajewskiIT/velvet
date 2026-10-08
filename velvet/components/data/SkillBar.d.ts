import * as React from 'react';
/** Competency meter: label, optional level word, and a bar that grows in once on mount with a single shimmer sweep. Use for skills, proficiency, profile completeness — not task progress (use Progress). */
export interface SkillBarProps {
  label: React.ReactNode;
  /** 0–100 */
  value: number;
  /** Text shown at right, e.g. 'Advanced'. Keep it a word, not a number. */
  level?: string;
  /** @default 'brand' */
  tone?: 'brand' | 'success' | 'warning' | 'danger' | 'info';
  /** Grow-in + shimmer on mount. Off for static lists / print. @default true */
  animate?: boolean;
  className?: string;
}
export declare function SkillBar(props: SkillBarProps): JSX.Element;
