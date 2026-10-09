import type { ColorLabel } from './colorLabel';

export interface ColorLabelManagerProps {
  open: boolean;
  onClose?: () => void;
  labels: ColorLabel[];
  /** May return a Promise — Save / Delete lock while pending; on reject the form stays open and `errorText` shows inline. */
  onChange?: (labels: ColorLabel[]) => void | Promise<void>;
  /** Receives the error `onChange` rejected with. */
  onError?: (error: unknown) => void;
  /** Colours offered for a label. @default LABEL_COLORS */
  colors?: string[];
  /** @default localized "Manage labels" */
  title?: string;
  /** Shown when `onChange` rejects. @default localized "Couldn’t save labels — try again." */
  errorText?: string;
}

export type ColorLabelManagerConfig = ColorLabelManagerProps & Required<Pick<ColorLabelManagerProps, 'colors'>>;

export interface LabelDraft {
  id: string | undefined;
  name: string;
  color: string;
}
