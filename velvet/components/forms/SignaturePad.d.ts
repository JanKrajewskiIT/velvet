import * as React from 'react';
/**
 * Draw-to-sign field for contracts, delivery confirmations and consent forms. Smoothed strokes with speed (mouse / touch) or pressure (pen) width; ink follows --fg-primary and redraws on theme change.
 * onValueChange gets a PNG data URL (null when cleared) plus the raw strokes. Undo / Clear appear once there is ink.
 * Drawing is not keyboard-accessible — always offer an alternative (typed full name Input + consent Checkbox).
 */
export interface SignaturePoint { x: number; y: number; w: number }
export interface SignaturePadProps {
  label?: React.ReactNode;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  optional?: boolean;
  required?: boolean;
  /** px. @default 180 */
  height?: number;
  /** Base stroke width px. @default 2.5 */
  penWidth?: number;
  /** @default 'Sign here' */
  placeholder?: string;
  onValueChange?: (dataUrl: string | null, strokes: SignaturePoint[][]) => void;
  disabled?: boolean;
  id?: string;
  className?: string;
}
export declare function SignaturePad(props: SignaturePadProps): JSX.Element;
