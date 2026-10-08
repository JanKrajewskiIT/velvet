import { createEffect, createMemo, createSignal, createUniqueId, For, mergeProps, on, Show } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { Button } from '../actions/Button';
import { IconButton } from '../actions/IconButton';
import { Dialog } from '../feedback/Dialog';
import { Control } from '../primitives/Control';
import { EmptyText } from '../primitives/EmptyText';
import { FieldLabel } from '../primitives/Field';
import { Glyph } from '../primitives/Glyph';
import { ListItem } from '../primitives/ListItem';
import { type ColorLabel, LABEL_COLORS, nextLabelColor, normalizeLabelText } from './colorLabel';

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

interface LabelDraft {
  id: string | undefined;
  name: string;
  color: string;
}

let nextLabelSeq = 0;

/** Compact dialog listing labels as dot + name with edit / delete; edit and "Add label" open a Name + Color form; delete confirms inline. */
export const ColorLabelManager = (props: ColorLabelManagerProps) => {
  const p = mergeProps({ colors: LABEL_COLORS } satisfies Partial<ColorLabelManagerProps>, props);
  const translate = useTranslate();
  const title = () => p.title ?? translate('velvet.patterns.colorLabelManager.title');
  const errorText = () => p.errorText ?? translate('velvet.patterns.colorLabelManager.errorText');
  const [draft, setDraft] = createSignal<LabelDraft | null>(null);
  const [confirming, setConfirming] = createSignal<string | null>(null);
  const [nameError, setNameError] = createSignal<string | null>(null);
  const [failed, setFailed] = createSignal(false);
  const [busy, setBusy] = createSignal(false);
  const nameId = createUniqueId();
  const colorId = `${nameId}-color`;
  let nameInput: HTMLInputElement | undefined;

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
      : [...p.labels, { id: `l${Date.now()}-${nextLabelSeq++}`, name, color: current.color }];
    if (await commit(next)) cancelDraft();
  };

  const remove = async (label: ColorLabel) => {
    if (await commit(p.labels.filter((other) => other.id !== label.id))) setConfirming(null);
  };

  const footer = () => (
    <Show
      when={draft()}
      fallback={
        <Button variant="secondary" iconLeft="plus" class="vui-clm__add" onClick={startAdd}>
          {translate('velvet.patterns.colorLabelManager.addLabel')}
        </Button>
      }
    >
      {(current) => (
        <>
          <Button variant="secondary" onClick={cancelDraft}>
            {translate('velvet.common.cancel')}
          </Button>
          <Button onClick={() => void save()} disabled={!current().name.trim() || busy()} loading={busy()}>
            {busy() ? translate('velvet.patterns.colorLabelManager.saving') : translate('velvet.common.save')}
          </Button>
        </>
      )}
    </Show>
  );

  return (
    <Dialog open={p.open} onClose={p.onClose} title={title()} size="sm" class="vui-clm" footer={footer()}>
      <Show when={failed()}>
        <div class="vui-confirm__err" role="alert" style={{ 'margin-bottom': 'var(--space-3)' }}>
          <Glyph name="alert-circle" />
          {errorText()}
        </div>
      </Show>
      <ul class="vui-clm__list">
        <For each={p.labels}>
          {(label) => (
            <li class="vui-clm__item">
              <ListItem
                size="sm"
                class={cx('vui-clm__row', draft()?.id === label.id && 'vui-clm__row--editing')}
                leading={<span class="vui-clm__dot" style={{ background: label.color }} aria-hidden="true" />}
                title={label.name}
                trailing={
                  <>
                    <Show when={label.count != null}>
                      <span class="vui-clm__count">{label.count}</span>
                    </Show>
                    <IconButton
                      icon="pencil"
                      label={translate('velvet.patterns.colorLabelManager.edit', { name: label.name })}
                      size="xs"
                      onClick={() => startEdit(label)}
                    />
                    <IconButton
                      icon="trash-2"
                      label={translate('velvet.patterns.colorLabelManager.delete', { name: label.name })}
                      size="xs"
                      class="vui-clm__del"
                      aria-expanded={confirming() === label.id}
                      onClick={() => {
                        setDraft(null);
                        setConfirming(confirming() === label.id ? null : label.id);
                      }}
                    />
                  </>
                }
              />
              <Show when={confirming() === label.id}>
                <div class="vui-clm__confirm" role="alert">
                  <span class="vui-clm__q">
                    {label.count
                      ? translate('velvet.patterns.colorLabelManager.deleteQuestionUsed', {
                          name: label.name,
                          count: label.count,
                        })
                      : translate('velvet.patterns.colorLabelManager.deleteQuestion', { name: label.name })}
                  </span>
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => setConfirming(null)}
                    ref={(el: HTMLButtonElement) => queueMicrotask(() => el.focus())}
                  >
                    {translate('velvet.common.cancel')}
                  </Button>
                  <Button variant="danger" size="xs" loading={busy()} onClick={() => void remove(label)}>
                    {translate('velvet.common.delete')}
                  </Button>
                </div>
              </Show>
            </li>
          )}
        </For>
        <Show when={p.labels.length === 0}>
          <EmptyText as="li" class="vui-clm__empty">
            {translate('velvet.patterns.colorLabelManager.empty')}
          </EmptyText>
        </Show>
      </ul>
      <Show when={draft()}>
        {(current) => (
          <div class="vui-clm__form">
            <div class="vui-field">
              <FieldLabel htmlFor={nameId}>
                {current().id
                  ? translate('velvet.patterns.colorLabelManager.rename')
                  : translate('velvet.patterns.colorLabelManager.name')}
              </FieldLabel>
              <Control invalid={!!nameError()}>
                <input
                  ref={nameInput}
                  id={nameId}
                  class="vui-control__input"
                  placeholder={translate('velvet.patterns.colorLabelManager.namePlaceholder')}
                  value={current().name}
                  onInput={(e) => {
                    patchDraft({ name: e.currentTarget.value });
                    setNameError(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') void save();
                  }}
                  aria-invalid={!!nameError() || undefined}
                />
              </Control>
              <Show when={nameError()}>
                <span class="vui-hint vui-hint--error" role="alert">
                  {nameError()}
                </span>
              </Show>
            </div>
            <div class="vui-field">
              <FieldLabel id={colorId}>{translate('velvet.patterns.colorLabelManager.color')}</FieldLabel>
              <div class="vui-clm__swatches" role="radiogroup" aria-labelledby={colorId}>
                <For each={p.colors}>
                  {(color, index) => (
                    <button
                      type="button"
                      role="radio"
                      aria-checked={color === current().color}
                      aria-label={translate('velvet.patterns.colorLabelManager.colorOption', { index: index() + 1 })}
                      class="vui-clm__sw"
                      style={{ background: color }}
                      onClick={() => patchDraft({ color })}
                    />
                  )}
                </For>
              </div>
            </div>
          </div>
        )}
      </Show>
    </Dialog>
  );
};
