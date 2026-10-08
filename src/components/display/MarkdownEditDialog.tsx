import { createEffect, createSignal, type JSX, mergeProps, on, Show, untrack } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { Button } from '../actions/Button';
import { Dialog } from '../feedback/Dialog';
import { Glyph } from '../primitives/Glyph';
import { createModifierLabel } from './createModifierLabel';
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
  const [busy, setBusy] = createSignal(false);
  const [failed, setFailed] = createSignal(false);
  const [asking, setAsking] = createSignal(false);
  const dirty = () => draft() !== merged.value;

  createEffect(
    on(
      () => merged.open,
      (open) => {
        if (!open) return;
        setDraft(merged.value);
        setFailed(false);
        setAsking(false);
        setBusy(false);
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
    if (busy() || !dirty()) return;
    setBusy(true);
    setFailed(false);
    try {
      await merged.onSave?.(draft());
    } catch (error) {
      setBusy(false);
      setFailed(true);
      merged.onSaveError?.(error);
      return;
    }
    setBusy(false);
    merged.onClose?.();
  };

  const focusOnMount = (element: HTMLElement) => queueMicrotask(() => element.focus());

  return (
    <Dialog
      open={merged.open}
      onClose={close}
      title={title()}
      description={merged.description}
      size={merged.size}
      class="vui-mde-dlg"
      footer={
        <Show
          when={asking()}
          fallback={
            <>
              <Show when={failed()}>
                <span class="vui-mde-dlg__err" role="alert">
                  <Glyph name="alert-circle" />
                  {translate('velvet.display.markdownEditDialog.saveError')}
                </span>
              </Show>
              <span class="vui-mde-dlg__kbd">
                {translate('velvet.display.markdownEditDialog.saveShortcut', { modifier: modifierLabel() })}
              </span>
              <Button variant="secondary" onClick={close} disabled={busy()}>
                {cancelLabel()}
              </Button>
              <Button onClick={() => void save()} disabled={!dirty()} loading={busy()}>
                {busy() ? translate('velvet.display.markdownEditDialog.saving') : saveLabel()}
              </Button>
            </>
          }
        >
          <div class="vui-mde-dlg__ask" role="alert">
            <span>{translate('velvet.display.markdownEditDialog.discardPrompt')}</span>
            <Button variant="ghost" size="sm" ref={focusOnMount} onClick={() => setAsking(false)}>
              {translate('velvet.display.markdownEditDialog.keepEditing')}
            </Button>
            <Button variant="danger" size="sm" onClick={() => merged.onClose?.()}>
              {translate('velvet.display.markdownEditDialog.discard')}
            </Button>
          </div>
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
            void save();
          }
        }}
      />
    </Dialog>
  );
};
