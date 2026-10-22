import { createEffect, createMemo, createSignal, createUniqueId, on, untrack } from 'solid-js';

import { createOperation } from '../../hooks/createOperation';
import { useTranslate } from '../../i18n/useTranslate';
import { createId } from '../../utils/id';
import { type ColorLabel, nextLabelColor, normalizeLabelText } from './colorLabel';
import type { ColorLabelManagerConfig, LabelDraft } from './colorLabelManagerTypes';

export const createColorLabelManager = (p: ColorLabelManagerConfig) => {
  const translate = useTranslate();
  const [draft, setDraft] = createSignal<LabelDraft | null>(null);
  const [confirming, setConfirming] = createSignal<string | null>(null);
  const [nameError, setNameError] = createSignal<string | null>(null);
  const [failed, setFailed] = createSignal(false);
  const operation = createOperation({ concurrency: 'single-flight' });
  const busy = operation.busy;
  const nameId = createUniqueId();
  const colorId = `${nameId}-color`;
  let nameInput: HTMLInputElement | undefined;
  const nameInputRef = (el: HTMLInputElement) => {
    nameInput = el;
  };

  /** Changes when a different label (or a new one) is being edited, not on every keystroke. */
  const draftIdentity = createMemo(() => {
    const current = draft();
    return current ? (current.id ?? '') : null;
  });

  createEffect(on(draftIdentity, (identity) => identity !== null && nameInput?.focus({ preventScroll: true })));
  createEffect(
    on(
      () => p.open,
      (open) => {
        operation.invalidate();
        if (open) return;
        setDraft(null);
        setConfirming(null);
        setNameError(null);
        setFailed(false);
      },
    ),
  );

  const nameTaken = (name: string, ownId: string | undefined) =>
    p.labels.some((label) => label.id !== ownId && normalizeLabelText(label.name) === normalizeLabelText(name));

  const isOpen = () => p.open;
  const commit = async (next: ColorLabel[], onCommitted: () => void): Promise<void> => {
    if (!isOpen()) return;
    const run = operation.begin();
    if (!run) return;
    setFailed(false);
    try {
      await p.onChange?.(next);
      if (run.isCurrent() && isOpen()) onCommitted();
    } catch (error) {
      if (!run.isCurrent() || !isOpen()) return;
      setFailed(true);
      p.onError?.(error);
    } finally {
      run.finish();
    }
  };

  const startAdd = () => {
    if (!p.open || busy()) return;
    setConfirming(null);
    setNameError(null);
    setDraft({ id: undefined, name: '', color: nextLabelColor(p.colors, p.labels.length) });
  };
  const startEdit = (label: ColorLabel) => {
    if (!p.open || busy()) return;
    setConfirming(null);
    setNameError(null);
    setDraft({ id: label.id, name: label.name, color: label.color });
  };
  const clearDraft = () => {
    setDraft(null);
    setNameError(null);
  };
  const cancelDraft = () => {
    if (!busy()) clearDraft();
  };
  const patchDraft = (patch: Partial<LabelDraft>) => {
    if (busy()) return;
    setDraft((current) => (current ? { ...current, ...patch } : current));
  };
  const rename = (name: string) => {
    patchDraft({ name });
    setNameError(null);
  };

  const save = async () => {
    const current = draft();
    const name = current?.name.trim();
    if (!p.open || !current || !name || busy()) return;
    if (nameTaken(name, current.id)) {
      setNameError(translate('velvet.patterns.colorLabelManager.nameExists', { name }));
      return;
    }
    const next = current.id
      ? p.labels.map((label) => (label.id === current.id ? { ...label, name, color: current.color } : label))
      : [...p.labels, { id: createId('l'), name, color: current.color }];
    await commit(next, () => {
      if (untrack(draft) === current) clearDraft();
    });
  };

  const remove = async (label: ColorLabel) => {
    await commit(
      p.labels.filter((other) => other.id !== label.id),
      () => setConfirming(null),
    );
  };

  const toggleConfirm = (label: ColorLabel) => {
    if (!p.open || busy()) return;
    setDraft(null);
    setConfirming(confirming() === label.id ? null : label.id);
  };
  const cancelConfirm = () => {
    if (!busy()) setConfirming(null);
  };

  return {
    draft,
    confirming,
    nameError,
    failed,
    busy,
    nameId,
    colorId,
    nameInputRef,
    startAdd,
    startEdit,
    cancelDraft,
    patchDraft,
    rename,
    save,
    remove,
    toggleConfirm,
    cancelConfirm,
  } as const;
};

export type ColorLabelManagerController = ReturnType<typeof createColorLabelManager>;
