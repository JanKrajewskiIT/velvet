import * as React from 'react';
/** Multi-line text field. Grows with content between `rows` and `maxRows` (autoResize), then scrolls. Same label/hint/error/validate/counter API as Input. */
export interface TextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
  label?: string;
  hint?: string;
  error?: string;
  optional?: boolean;
  /** Minimum visible rows. Default 3. */
  rows?: number;
  /** Grow height with content. Default true. */
  autoResize?: boolean;
  /** Height cap when autoResize; scrolls beyond. Default 10. */
  maxRows?: number;
  /** Manual resize handle. Default 'none' when autoResize, else 'vertical'. */
  resize?: 'none' | 'vertical' | 'both';
  size?: 'sm' | 'md' | 'lg';
  readOnly?: boolean;
  validate?: (value: string) => string | undefined | null | false;
  reserveHint?: boolean;
  /** Live "n / maxLength" counter. Requires maxLength. */
  showCount?: boolean;
  maxLength?: number;
}
export declare function Textarea(props: TextareaProps): JSX.Element;
