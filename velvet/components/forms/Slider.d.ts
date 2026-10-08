import * as React from 'react';
/** Range control with filled track. Pass a number for one thumb or [lo, hi] for two — thumbs can never cross. Drag, click the track, or ←→ / PageUp/Down / Home/End. Optional marks (thresholds) with labels; snapToMarks restricts values to them. */
export interface SliderProps {
  label?: string;
  value?: number | [number, number];
  defaultValue?: number | [number, number];
  onValueChange?: (value: any) => void;
  /** @default 0 */
  min?: number;
  /** @default 100 */
  max?: number;
  /** @default 1 */
  step?: number;
  /** Display + aria-valuetext — e.g. v => v + '%' or v => '$' + v */
  format?: (value: number) => string;
  /** Live value right of the label. @default true */
  showValue?: boolean;
  /** min / max captions under the track */
  showBounds?: boolean;
  /** Thresholds on the track. true = a labelled mark on every step; number[] = dots; {value,label}[] = labelled thresholds (e.g. Junior / Mid / Senior). */
  marks?: boolean | Array<number | { value: number; label?: React.ReactNode }>;
  /** Value can only land on a mark; arrows jump mark to mark. @default false */
  snapToMarks?: boolean;
  disabled?: boolean;
  id?: string;
  className?: string;
}
export declare function Slider(props: SliderProps): JSX.Element;
