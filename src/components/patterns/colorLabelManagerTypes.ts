import type { ColorLabel } from './colorLabel';

export interface ColorLabelManagerProps {
  open: boolean;
  onClose?: () => void;
  labels: ColorLabel[];
  /** Editing locks while pending. Rejections keep the current session open with errorText; stale completions are ignored. */
  onChange?: (labels: ColorLabel[]) => void | Promise<void>;
  /** Receives the error `onChange` rejected with. */
  onError?: (error: unknown) => void;
  /** Colours offered for a label. @default LABEL_COLORS */
  colors?: readonly string[];
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
