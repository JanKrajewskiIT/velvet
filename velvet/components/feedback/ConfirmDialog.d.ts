import * as React from 'react';
/** Second-thought dialog. primary for routine confirmations, danger for destructive (warning icon, red button, focus starts on Cancel). requireText gates irreversible actions behind typing a name. onConfirm may be async — spinner, dialog locked meanwhile, double submit blocked; if it rejects the dialog stays open with the error message inline. Prefer Toast undo for reversible actions. */
export interface ConfirmDialogProps {
  open: boolean;
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  tone?: 'primary' | 'danger';
  confirmLabel?: string;
  cancelLabel?: string;
  /** e.g. the workspace name */
  requireText?: string;
  children?: React.ReactNode;
}
export declare function ConfirmDialog(props: ConfirmDialogProps): JSX.Element;
/** Trigger + ConfirmDialog in one — owns open state; closes after onConfirm resolves. For lists of repeated destructive actions. */
export interface ConfirmActionProps extends Omit<ConfirmDialogProps, 'open' | 'onCancel'> { trigger: React.ReactNode }
export declare function ConfirmAction(props: ConfirmActionProps): JSX.Element;
