import { createEffect, createSignal, type JSX, mergeProps, on, Show } from 'solid-js';

import { createOperation } from '../../hooks/createOperation';
import { useTranslate, useTranslateRich } from '../../i18n/useTranslate';
import { reportAsyncError } from '../../utils/reportAsyncError';
import { Button } from '../actions/Button';
import { Control } from '../primitives/Control';
import { ControlInput } from '../primitives/ControlInput';
import { Field } from '../primitives/Field';
import { Glyph } from '../primitives/Glyph';
import { IconTile } from '../primitives/IconTile';
import { Text } from '../primitives/Text';
import styles from './ConfirmDialog.module.css';
import { Dialog } from './Dialog';

export interface ConfirmDialogProps {
  open: boolean;
  /** May be async: the dialog is locked and shows a spinner until it settles; a rejection keeps it open with `errorMessage`. */
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void;
  /** Receives a rejection from the current open dialog; results after close or disposal are ignored. */
  onError?: (error: unknown) => void;
  /** @default localized "Are you sure?" */
  title?: JSX.Element;
  description?: JSX.Element;
  /** primary for routine confirmations, danger for destructive ones (warning icon, red button, focus starts on Cancel). @default 'primary' */
  tone?: 'primary' | 'danger';
  /** @default localized "Confirm" */
  confirmLabel?: string;
  /** @default localized "Cancel" */
  cancelLabel?: string;
  /** Gates the confirm button behind typing this text, e.g. the workspace name. */
  requireText?: string;
  /** Inline message shown when `onConfirm` rejects. @default localized "Something went wrong — try again." */
  errorMessage?: string;
  children?: JSX.Element;
}

/** Second-thought dialog. Prefer a Toast with undo for reversible actions. */
export const ConfirmDialog = (props: ConfirmDialogProps) => {
  const p = mergeProps({ tone: 'primary' } satisfies Partial<ConfirmDialogProps>, props);
  const translate = useTranslate();
  const title = () => (p.title === undefined ? translate('velvet.feedback.confirmDialog.title') : p.title);
  const confirmLabel = () => p.confirmLabel ?? translate('velvet.common.confirm');
  const cancelLabel = () => p.cancelLabel ?? translate('velvet.common.cancel');
  const errorMessage = () => p.errorMessage ?? translate('velvet.feedback.confirmDialog.errorMessage');
  const translateRich = useTranslateRich();
  const [typed, setTyped] = createSignal('');
  const operation = createOperation();
  const busy = operation.busy;
  const [failed, setFailed] = createSignal(false);
  const danger = () => p.tone === 'danger';
  const confirmed = () => !p.requireText || typed().trim() === p.requireText;
  createEffect(
    on(
      () => p.open,
      (open) => {
        operation.invalidate();
        if (!open) return;
        setTyped('');
        setFailed(false);
      },
    ),
  );

  const confirm = async () => {
    if (!p.open || !confirmed()) return;
    const run = operation.begin();
    if (!run) return;
    setFailed(false);
    try {
      await p.onConfirm?.();
    } catch (error) {
      if (!run.isCurrent()) return;
      setFailed(true);
      p.onError?.(error);
    } finally {
      run.finish();
    }
  };

  return (
    <Dialog
      open={p.open}
      onClose={busy() ? undefined : p.onCancel}
      size="sm"
      dismissible={!busy()}
      title={
        <Text as="span" variant="title-lg" tone="inherit" class={styles.confirmPartTitle}>
          <Show when={danger()}>
            <IconTile icon="triangle-alert" tone="danger" shape="circle" size="sm" />
          </Show>
          {title()}
        </Text>
      }
      description={p.description}
      footer={
        <>
          <Button variant="secondary" disabled={busy()} autofocus={danger()} onClick={() => p.onCancel?.()}>
            {cancelLabel()}
          </Button>
          <Button
            variant={danger() ? 'danger' : 'primary'}
            loading={busy()}
            disabled={!confirmed()}
            autofocus={!danger()}
            onClick={() => void confirm().catch(reportAsyncError)}
          >
            {confirmLabel()}
          </Button>
        </>
      }
    >
      {p.children}
      <Show when={failed()}>
        <Text as="div" variant="body-sm" tone="danger" class={styles.confirmPartErr} role="alert">
          <Glyph name="alert-circle" />
          {errorMessage()}
        </Text>
      </Show>
      <Show when={p.requireText}>
        {(requireText) => (
          <Field
            label={translateRich('velvet.feedback.confirmDialog.typeToConfirm', {
              text: requireText(),
              code: (children) => (
                <Text as="b" variant="label" tone="inherit" class={styles.confirmPartCode}>
                  {children}
                </Text>
              ),
            })}
          >
            {(control) => (
              <Control>
                <ControlInput
                  id={control.id}
                  value={typed()}
                  onInput={(e) => setTyped(e.currentTarget.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') void confirm().catch(reportAsyncError);
                  }}
                  autocomplete="off"
                  spellcheck={false}
                  autofocus
                />
              </Control>
            )}
          </Field>
        )}
      </Show>
    </Dialog>
  );
};
