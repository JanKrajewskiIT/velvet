import { createEffect, createSignal, type JSX, mergeProps, on, Show, untrack } from 'solid-js';

import { createOperation } from '../../hooks/createOperation';
import { useTranslate } from '../../i18n/useTranslate';
import { reportAsyncError } from '../../utils/reportAsyncError';
import { Button } from '../actions/Button';
import { Dialog } from '../feedback/Dialog';
import { Glyph } from '../primitives/Glyph';
import { Text } from '../primitives/Text';
import { createModifierLabel } from './createModifierLabel';
import styles from './MarkdownEditDialog.module.css';
import { MarkdownEditor, type MarkdownEditorMode } from './MarkdownEditor';

/**
 * Edit a Markdown field in a modal. Works on a draft: Save is disabled until something changed; closing a dirty draft asks
 * "Discard unsaved changes?"; the modifier + Enter shortcut saves. `onSave` may return a Promise — while pending the editor locks
 * and Save shows a spinner; if it rejects the dialog stays open, the draft is kept and a generic error shows inline
 * (the rejection itself is passed to `onSaveError`).
 */
export interface MarkdownEditDialogProps {
  open: boolean;
  onClose?: () => void;
  /** @default localized "Edit" */
  title?: JSX.Element;
  description?: JSX.Element;
  /** Initial value — the draft resets to it every time the dialog opens. @default '' */
  value?: string;
  onSave?: (value: string) => void | Promise<void>;
  /** Receives the reason `onSave` failed, for logging. The dialog itself only shows a generic message. */
  onSaveError?: (error: unknown) => void;
  /** @default localized "Save" */
  saveLabel?: string;
  /** @default localized "Cancel" */
  cancelLabel?: string;
  /** @default 'split' */
  defaultMode?: MarkdownEditorMode;
  /** @default 340 */
  height?: number | string;
  maxLength?: number;
  placeholder?: string;
  /** @default 'lg' */
  size?: 'sm' | 'md' | 'lg';
  /** @default true */
  confirmDiscard?: boolean;
}

export const MarkdownEditDialog = (props: MarkdownEditDialogProps) => {
  const merged = mergeProps(
    {
      value: '',
      defaultMode: 'split',
      height: 340,
      size: 'lg',
      confirmDiscard: true,
    } satisfies Partial<MarkdownEditDialogProps>,
    props,
  );
  const translate = useTranslate();
  const title = () => merged.title ?? translate('velvet.common.edit');
  const saveLabel = () => merged.saveLabel ?? translate('velvet.common.save');
  const cancelLabel = () => merged.cancelLabel ?? translate('velvet.common.cancel');
  const modifierLabel = createModifierLabel();
  const [draft, setDraft] = createSignal(untrack(() => merged.value));
  const operation = createOperation();
  const busy = operation.busy;
  const [failed, setFailed] = createSignal(false);
  const [asking, setAsking] = createSignal(false);
  const dirty = () => draft() !== merged.value;

  createEffect(
    on(
      () => merged.open,
      (open) => {
        operation.invalidate();
        if (!open) return;
        setDraft(merged.value);
        setFailed(false);
        setAsking(false);
      },
    ),
  );

  const close = () => {
    if (busy()) return;
    if (dirty() && merged.confirmDiscard && !asking()) {
      setAsking(true);
      return;
    }
    merged.onClose?.();
  };

  const save = async () => {
    if (!merged.open || !dirty()) return;
    const run = operation.begin();
    if (!run) return;
    setFailed(false);
    try {
      await merged.onSave?.(draft());
    } catch (error) {
      if (!run.isCurrent()) return;
      run.finish();
      setFailed(true);
      merged.onSaveError?.(error);
      return;
    } finally {
      if (!run.isCurrent()) run.finish();
    }
    if (!run.isCurrent()) return;
    run.finish();
    merged.onClose?.();
  };

  const focusOnMount = (element: HTMLElement) =>
    queueMicrotask(() => {
      if (untrack(() => merged.open) && element.isConnected) element.focus();
    });

  return (
    <Dialog
      open={merged.open}
      onClose={close}
      title={title()}
      description={merged.description}
      size={merged.size}
      footerClass={styles.dialogFooter}
      footer={
        <Show
          when={asking()}
          fallback={
            <>
              <Show when={failed()}>
                <Text as="span" variant="body-sm" tone="danger" class={styles.mdeDlgPartErr} role="alert">
                  <Glyph name="alert-circle" />
                  {translate('velvet.display.markdownEditDialog.saveError')}
                </Text>
              </Show>
              <Text as="span" variant="caption" tone="tertiary" class={styles.mdeDlgPartKbd}>
                {translate('velvet.display.markdownEditDialog.saveShortcut', { modifier: modifierLabel() })}
              </Text>
              <Button variant="secondary" onClick={close} disabled={busy()}>
                {cancelLabel()}
              </Button>
              <Button onClick={() => void save().catch(reportAsyncError)} disabled={!dirty()} loading={busy()}>
                {busy() ? translate('velvet.display.markdownEditDialog.saving') : saveLabel()}
              </Button>
            </>
          }
        >
          <Text as="div" variant="body-sm" tone="primary" class={styles.mdeDlgPartAsk} role="alert">
            <Text as="span" variant="body-sm" tone="inherit">
              {translate('velvet.display.markdownEditDialog.discardPrompt')}
            </Text>
            <Button variant="ghost" size="sm" ref={focusOnMount} onClick={() => setAsking(false)}>
              {translate('velvet.display.markdownEditDialog.keepEditing')}
            </Button>
            <Button variant="danger" size="sm" onClick={() => merged.onClose?.()}>
              {translate('velvet.display.markdownEditDialog.discard')}
            </Button>
          </Text>
        </Show>
      }
    >
      <MarkdownEditor
        value={draft()}
        onChange={(next) => {
          setDraft(next);
          setAsking(false);
        }}
        defaultMode={merged.defaultMode}
        height={merged.height}
        maxLength={merged.maxLength}
        placeholder={merged.placeholder}
        disabled={busy()}
        // eslint-disable-next-line jsx-a11y/no-autofocus -- the editor opens inside a dialog the user just requested, so it takes initial focus
        autoFocus
        onKeyDown={(e) => {
          if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
            e.preventDefault();
            void save().catch(reportAsyncError);
          }
        }}
      />
    </Dialog>
  );
};
