import * as React from 'react';
/** Star rating. Hover previews, click commits (click the current star again to clear), ←→ / Home / End by keyboard. readOnly renders a static, labelled image for reviews and lists. */
export interface RatingProps {
  value?: number;
  /** @default 0 */
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  /** @default 5 */
  max?: number;
  readOnly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  /** "4.0 / 5" after the stars */
  showValue?: boolean;
  /** Accessible group name. @default 'Rating' */
  label?: string;
  className?: string;
}
export declare function Rating(props: RatingProps): JSX.Element;
