import * as React from 'react';
/** Live countdown to a date — launches, offers, auction ends. Digits tick with a small drop animation; screen readers get one summary label (not per-second chatter). */
export interface CountdownProps {
  to: Date | string | number;
  onComplete?: () => void;
  /** @default ['days','hours','minutes','seconds'] */
  units?: Array<'days' | 'hours' | 'minutes' | 'seconds'>;
  labels?: Partial<Record<'days' | 'hours' | 'minutes' | 'seconds', string>>;
  /** boxes = tiles with labels · inline = 02:14:09 */
  variant?: 'boxes' | 'inline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}
export declare function Countdown(props: CountdownProps): JSX.Element;
