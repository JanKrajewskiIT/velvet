import * as React from 'react';
import type { ColorLabel } from './ColorLabelManager';
/**
 * Assign colour labels to one item (candidate, task, file). Chips toggle on/off (max=1 → single choice, radio semantics);
 * search appears for long lists or when onCreate is set, and "Create “…”" adds a new label inline (Enter). Works on a draft:
 * Apply is disabled until the selection changes; onSubmit may return a Promise — dialog locks while pending, on reject the
 * selection is kept and the error shows inline. Pair with ColorLabelManager via onManage for rename / recolour / delete.
 */
export interface ColorLabelSelectionDialogProps {
  open: boolean;
  onClose?: () => void;
  labels: ColorLabel[];
  /** Currently assigned label ids — the draft resets to this on open */
  value?: string[];
  onSubmit?: (ids: string[]) => void | Promise<void>;
  /** Enable inline creation. Return the new label (with id) to auto-select it. */
  onCreate?: (draft: { name: string; color: string }) => ColorLabel | void | Promise<ColorLabel | void>;
  /** Shows a "Manage labels" footer button */
  onManage?: () => void;
  /** Max labels per item; 1 = single choice */
  max?: number;
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** @default 'Apply' */
  submitLabel?: string;
  cancelLabel?: string;
  /** @default auto — more than 7 labels or onCreate set */
  searchable?: boolean;
  /** Colours cycled for new labels. @default LABEL_COLORS */
  colors?: string[];
  emptyText?: React.ReactNode;
}
export declare function ColorLabelSelectionDialog(props: ColorLabelSelectionDialogProps): JSX.Element;
