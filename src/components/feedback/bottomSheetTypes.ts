import type { JSX } from 'solid-js';

export interface BottomSheetProps {
  open: boolean;
  onClose?: () => void;
  title?: JSX.Element;
  description?: JSX.Element;
  footer?: JSX.Element;
  /** Accessible name when there is no `title`. @default localized "Sheet" */
  label?: string;
  class?: string;
  children?: JSX.Element;
}
