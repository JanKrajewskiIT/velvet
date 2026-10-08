import { createEffect, createMemo, createSignal, For, type JSX, mergeProps, on, Show, untrack } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { Button } from '../actions/Button';
import { Dialog } from '../feedback/Dialog';
import { Spinner } from '../feedback/Spinner';
import { Chip } from '../forms/Chip';
import { SearchInput } from '../forms/SearchInput';
import { EmptyText } from '../primitives/EmptyText';
import { Glyph } from '../primitives/Glyph';
import { type ColorLabel, LABEL_COLORS, nextLabelColor, normalizeLabelText } from './colorLabel';

export interface ColorLabelSelectionDialogProps {
  open: boolean;
  onClose?: () => void;
  labels: ColorLabel[];
  /** Currently assigned label ids — the draft resets to this on open */
  value?: string[];
  /** May return a Promise — the dialog locks while pending; on reject the selection is kept and `submitErrorText` shows inline. */
  onSubmit?: (ids: string[]) => void | Promise<void>;
  /** Enable inline creation. Return the new label (with id) to auto-select it. */
  onCreate?: (draft: { name: string; color: string }) => ColorLabel | undefined | Promise<ColorLabel | undefined>;
  /** Receives the error `onSubmit` or `onCreate` rejected with. */
  onError?: (error: unknown) => void;
  /** Shows a "Manage labels" footer button */
  onManage?: () => void;
  /** Max labels per item; 1 = single choice */
  max?: number;
  /** @default localized "Labels" */
  title?: JSX.Element;
  description?: JSX.Element;
  /** @default localized "Apply" */
  submitLabel?: string;
  /** @default localized "Cancel" */
  cancelLabel?: string;
  /** @default auto — more than 7 labels or onCreate set */
  searchable?: boolean;
  /** Colours cycled for new labels. @default LABEL_COLORS */
  colors?: string[];
  /** @default localized "No labels yet." */
  emptyText?: JSX.Element;
  /** Shown when `onSubmit` rejects. @default localized "Couldn’t apply labels — your selection is kept." */
  submitErrorText?: string;
  /** Shown when `onCreate` rejects. @default localized name ⇒ "Couldn’t create “name”." */
  createErrorText?: (name: string) => string;
}

const SEARCH_THRESHOLD = 7;
const NO_IDS: readonly string[] = [];

/** Assign colour labels to one item: toggle chips (max 1 = single choice), search, inline create, and a draft that Apply commits. */
export const ColorLabelSelectionDialog = (props: ColorLabelSelectionDialogProps) => {
  const p = mergeProps({ colors: LABEL_COLORS } satisfies Partial<ColorLabelSelectionDialogProps>, props);
  const translate = useTranslate();
  const title = () => p.title ?? translate('velvet.patterns.colorLabelSelectionDialog.title');
  const submitLabel = () => p.submitLabel ?? translate('velvet.common.apply');
  const cancelLabel = () => p.cancelLabel ?? translate('velvet.common.cancel');
  const emptyText = () => p.emptyText ?? translate('velvet.patterns.colorLabelSelectionDialog.emptyText');
  const submitErrorText = () =>
    p.submitErrorText ?? translate('velvet.patterns.colorLabelSelectionDialog.submitErrorText');
  const createErrorText = (name: string) =>
    p.createErrorText?.(name) ?? translate('velvet.patterns.colorLabelSelectionDialog.createErrorText', { name });
  const [selection, setSelection] = createSignal<readonly string[]>(untrack(() => p.value ?? NO_IDS));
  const [query, setQuery] = createSignal('');
  const [busy, setBusy] = createSignal(false);
  const [creating, setCreating] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);
  let searchInput: HTMLInputElement | undefined;
  /** Bumped on every open so a completion from an earlier session cannot touch the new one. */
  let session = 0;

  createEffect(
    on(
      () => p.open,
      (open) => {
        if (!open) return;
        session++;
        setSelection(p.value ?? NO_IDS);
        setQuery('');
        setError(null);
        setBusy(false);
        setCreating(false);
      },
    ),
  );

  const showSearch = () => p.searchable ?? (p.labels.length > SEARCH_THRESHOLD || !!p.onCreate);
  const trimmedQuery = () => query().trim();
  const visible = createMemo(() => {
    const needle = normalizeLabelText(query());
    return needle ? p.labels.filter((label) => normalizeLabelText(label.name).includes(needle)) : p.labels;
  });
  const exactMatch = () => p.labels.some((label) => normalizeLabelText(label.name) === normalizeLabelText(query()));
  const single = () => p.max === 1;
  const full = () => p.max != null && selection().length >= p.max;
  const dirty = () => {
    const initial = p.value ?? NO_IDS;
    return selection().length !== initial.length || selection().some((id) => !initial.includes(id));
  };
  const canCreate = () => !!p.onCreate && trimmedQuery() !== '' && !exactMatch();
  const selectedCount = () => {
    const count = selection().length;
    const max = p.max != null && p.max > 1 ? p.max : undefined;
    const key = count
      ? max === undefined
        ? 'velvet.patterns.colorLabelSelectionDialog.selected'
        : 'velvet.patterns.colorLabelSelectionDialog.selectedMax'
      : max === undefined
        ? 'velvet.patterns.colorLabelSelectionDialog.none'
        : 'velvet.patterns.colorLabelSelectionDialog.noneMax';
    return translate(key, { count, max });
  };

  const toggle = (id: string) => {
    if (busy()) return;
    setError(null);
    setSelection((current) =>
      current.includes(id) ? current.filter((x) => x !== id) : single() ? [id] : full() ? current : [...current, id],
    );
  };

  const create = async () => {
    const name = trimmedQuery();
    const onCreate = p.onCreate;
    if (!name || exactMatch() || !onCreate || creating()) return;
    const current = session;
    setCreating(true);
    setError(null);
    try {
      const created = await onCreate({ name, color: nextLabelColor(p.colors, p.labels.length) });
      if (current !== session) return;
      if (created && created.id && (single() || !full())) {
        const id = created.id;
        setSelection((selected) => (single() ? [id] : [...selected, id]));
      }
      setQuery('');
      searchInput?.focus();
    } catch (failure) {
      if (current !== session) return;
      setError(createErrorText(name));
      p.onError?.(failure);
    } finally {
      if (current === session) setCreating(false);
    }
  };

  const submit = async () => {
    if (busy() || !dirty()) return;
    const current = session;
    setBusy(true);
    setError(null);
    try {
      await p.onSubmit?.([...selection()]);
      if (current !== session) return;
      setBusy(false);
      p.onClose?.();
    } catch (failure) {
      if (current !== session) return;
      setBusy(false);
      setError(submitErrorText());
      p.onError?.(failure);
    }
  };

  const onSearchKeyDown: JSX.EventHandler<HTMLInputElement, KeyboardEvent> = (e) => {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    const [first] = visible();
    const onlyMatch = visible().length === 1 ? first : undefined;
    if (onlyMatch && !p.onCreate) toggle(onlyMatch.id);
    else if (!exactMatch() && trimmedQuery()) void create();
    else if (onlyMatch) toggle(onlyMatch.id);
  };

  const createChipIcon = (): JSX.Element => {
    if (creating()) return <Spinner size="inline" tone="current" />;
    return 'plus';
  };

  const footer = () => (
    <>
      <Show when={p.onManage}>
        <Button
          variant="ghost"
          size="sm"
          iconLeft="settings"
          class="vui-cls__manage"
          disabled={busy()}
          onClick={() => p.onManage?.()}
        >
          {translate('velvet.patterns.colorLabelSelectionDialog.manage')}
        </Button>
      </Show>
      <Button variant="secondary" disabled={busy()} onClick={() => p.onClose?.()}>
        {cancelLabel()}
      </Button>
      <Button loading={busy()} disabled={!dirty()} onClick={() => void submit()}>
        {busy() ? translate('velvet.patterns.colorLabelSelectionDialog.applying') : submitLabel()}
      </Button>
    </>
  );

  return (
    <Dialog
      open={p.open}
      onClose={busy() ? undefined : p.onClose}
      dismissible={!busy()}
      title={title()}
      description={p.description}
      size="sm"
      class="vui-cls"
      footer={footer()}
    >
      <Show when={showSearch()}>
        <div class="vui-cls__search">
          <SearchInput
            size="sm"
            inputRef={(el: HTMLInputElement) => (searchInput = el)}
            value={query()}
            onValueChange={setQuery}
            placeholder={
              p.onCreate
                ? translate('velvet.patterns.colorLabelSelectionDialog.searchOrCreate')
                : translate('velvet.patterns.colorLabelSelectionDialog.search')
            }
            aria-label={translate('velvet.patterns.colorLabelSelectionDialog.searchLabel')}
            disabled={busy()}
            onKeyDown={onSearchKeyDown}
          />
        </div>
      </Show>
      <div class="vui-cls__meta">
        <span>{selectedCount()}</span>
        <Show when={selection().length > 0 && !single()}>
          <Button variant="link" size="xs" disabled={busy()} onClick={() => setSelection(NO_IDS)}>
            {translate('velvet.common.clear')}
          </Button>
        </Show>
      </div>
      <div
        class="vui-cls__chips"
        role="group"
        aria-label={
          typeof p.title === 'string' ? p.title : translate('velvet.patterns.colorLabelSelectionDialog.title')
        }
      >
        <For each={visible()}>
          {(label) => {
            const on = () => selection().includes(label.id);
            const atLimit = () => !on() && full() && !single();
            return (
              <Chip
                role={single() ? 'radio' : 'checkbox'}
                selected={on()}
                color={label.color}
                count={label.count}
                disabled={busy() || atLimit()}
                title={
                  atLimit()
                    ? translate('velvet.patterns.colorLabelSelectionDialog.limitReached', { max: p.max })
                    : undefined
                }
                onClick={() => toggle(label.id)}
              >
                {label.name}
              </Chip>
            );
          }}
        </For>
        <Show when={canCreate()}>
          <Chip
            dashed
            check={false}
            icon={createChipIcon()}
            disabled={creating() || busy()}
            onClick={() => void create()}
          >
            {translate('velvet.patterns.colorLabelSelectionDialog.create', { name: trimmedQuery() })}
          </Chip>
        </Show>
        <Show when={visible().length === 0 && !canCreate()}>
          <EmptyText as="p" align="start" class="vui-cls__empty">
            {query() ? translate('velvet.patterns.colorLabelSelectionDialog.noMatch', { query: query() }) : emptyText()}
          </EmptyText>
        </Show>
      </div>
      <Show when={error()}>
        <div class="vui-confirm__err" role="alert">
          <Glyph name="alert-circle" />
          {error()}
        </div>
      </Show>
    </Dialog>
  );
};
