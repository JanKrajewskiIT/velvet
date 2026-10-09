import { createEffect, createMemo, createSignal, createUniqueId, on } from 'solid-js';

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
  const [busy, setBusy] = createSignal(false);
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

  const commit = async (next: ColorLabel[]): Promise<boolean> => {
    if (busy()) return false;
    setBusy(true);
    setFailed(false);
    try {
      await p.onChange?.(next);
      return true;
    } catch (error) {
      setFailed(true);
      p.onError?.(error);
      return false;
    } finally {
      setBusy(false);
    }
  };

  const startAdd = () => {
    setConfirming(null);
    setNameError(null);
    setDraft({ id: undefined, name: '', color: nextLabelColor(p.colors, p.labels.length) });
  };
  const startEdit = (label: ColorLabel) => {
    setConfirming(null);
    setNameError(null);
    setDraft({ id: label.id, name: label.name, color: label.color });
  };
  const cancelDraft = () => {
    setDraft(null);
    setNameError(null);
  };
  const patchDraft = (patch: Partial<LabelDraft>) =>
    setDraft((current) => (current ? { ...current, ...patch } : current));
  const rename = (name: string) => {
    patchDraft({ name });
    setNameError(null);
  };

  const save = async () => {
    const current = draft();
    const name = current?.name.trim();
    if (!current || !name || busy()) return;
    if (nameTaken(name, current.id)) {
      setNameError(translate('velvet.patterns.colorLabelManager.nameExists', { name }));
      return;
    }
    const next = current.id
      ? p.labels.map((label) => (label.id === current.id ? { ...label, name, color: current.color } : label))
      : [...p.labels, { id: createId('l'), name, color: current.color }];
    if (await commit(next)) cancelDraft();
  };

  const remove = async (label: ColorLabel) => {
    if (await commit(p.labels.filter((other) => other.id !== label.id))) setConfirming(null);
  };

  const toggleConfirm = (label: ColorLabel) => {
    setDraft(null);
    setConfirming(confirming() === label.id ? null : label.id);
  };
  const cancelConfirm = () => setConfirming(null);

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
