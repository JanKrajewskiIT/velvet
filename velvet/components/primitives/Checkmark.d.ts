import * as React from 'react';
/** Atom. The check / indeterminate / radio glyph box, for rows that aren't native inputs (MultiSelect, TransferList). Native inputs use Checkbox / Radio. */
export interface CheckmarkProps extends React.HTMLAttributes<HTMLSpanElement> {
  checked?: boolean;
  /** Wins over checked */
  indeterminate?: boolean;
  /** Round, dot glyph */
  radio?: boolean;
  /** Circular box with a tick — selectable cards and source rows (not a radio: still multi-select). */
  round?: boolean;
  /** sm 16px · md 18px. @default 'md' */
  size?: 'sm' | 'md';
  disabled?: boolean;
}
export declare function Checkmark(props: CheckmarkProps): JSX.Element;
