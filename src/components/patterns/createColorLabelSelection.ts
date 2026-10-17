import { type Accessor, createEffect, createMemo, createSignal, type JSX, on, untrack } from 'solid-js';

import { reportAsyncError } from '../../utils/reportAsyncError';
import { type ColorLabel, nextLabelColor, normalizeLabelText } from './colorLabel';

export interface ColorLabelSelectionInput {
  open: boolean;
  labels: ColorLabel[];
  value?: string[];
  max?: number;
  searchable?: boolean;
  colors: readonly string[];
  onClose?: () => void;
  onSubmit?: (ids: string[]) => void | Promise<void>;
  // eslint-disable-next-line @typescript-eslint/no-invalid-void-type -- creation callbacks may intentionally return no label, synchronously or asynchronously
  onCreate?: (draft: { name: string; color: string }) => ColorLabel | void | Promise<ColorLabel | void>;
  onError?: (error: unknown) => void;
}

export interface ColorLabelSelectionMessages {
  submitError: Accessor<string>;
  createError: (name: string) => string;
}

export interface ColorLabelSelection {
  selection: Accessor<readonly string[]>;
  query: Accessor<string>;
  setQuery: (value: string) => void;
  busy: Accessor<boolean>;
  creating: Accessor<boolean>;
  error: Accessor<string | null>;
  max: Accessor<number | undefined>;
  visible: Accessor<ColorLabel[]>;
  trimmedQuery: Accessor<string>;
  showSearch: Accessor<boolean>;
  single: Accessor<boolean>;
  full: Accessor<boolean>;
  dirty: Accessor<boolean>;
  canCreate: Accessor<boolean>;
  searchRef: (el: HTMLInputElement) => void;
  toggle: (id: string) => void;
  clear: () => void;
  create: () => Promise<void>;
  submit: () => Promise<void>;
  onSearchKeyDown: JSX.EventHandler<HTMLInputElement, KeyboardEvent>;
}

const SEARCH_THRESHOLD = 7;
const NO_IDS: readonly string[] = [];

export const createColorLabelSelection = (
  input: ColorLabelSelectionInput,
  messages: ColorLabelSelectionMessages,
): ColorLabelSelection => {
  const [selection, setSelection] = createSignal<readonly string[]>(untrack(() => input.value ?? NO_IDS));
  const [query, setQuery] = createSignal('');
  const [busy, setBusy] = createSignal(false);
  const [creating, setCreating] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);
  let searchInput: HTMLInputElement | undefined;
  /** Bumped on every open so a completion from an earlier session cannot touch the new one. */
  let session = 0;

  createEffect(
    on(
      () => input.open,
      (open) => {
        if (!open) return;
        session++;
        setSelection(input.value ?? NO_IDS);
        setQuery('');
        setError(null);
        setBusy(false);
        setCreating(false);
      },
    ),
  );

  const showSearch = () => input.searchable ?? (input.labels.length > SEARCH_THRESHOLD || !!input.onCreate);
  const trimmedQuery = () => query().trim();
  const visible = createMemo(() => {
    const needle = normalizeLabelText(query());
    return needle ? input.labels.filter((label) => normalizeLabelText(label.name).includes(needle)) : input.labels;
  });
  const exactMatch = () => input.labels.some((label) => normalizeLabelText(label.name) === normalizeLabelText(query()));
  const single = () => input.max === 1;
  const full = () => input.max != null && selection().length >= input.max;
  const dirty = () => {
    const initial = input.value ?? NO_IDS;
    return selection().length !== initial.length || selection().some((id) => !initial.includes(id));
  };
  const canCreate = () => !!input.onCreate && trimmedQuery() !== '' && !exactMatch();

  const toggle = (id: string) => {
    if (busy()) return;
    setError(null);
    setSelection((current) =>
      current.includes(id) ? current.filter((x) => x !== id) : single() ? [id] : full() ? current : [...current, id],
    );
  };
  const clear = () => setSelection(NO_IDS);

  const create = async () => {
    const name = trimmedQuery();
    const onCreate = input.onCreate;
    if (!name || exactMatch() || !onCreate || creating()) return;
    const current = session;
    setCreating(true);
    setError(null);
    try {
      const created = await onCreate({ name, color: nextLabelColor(input.colors, input.labels.length) });
      if (current !== session) return;
      if (created && created.id && (single() || !full())) {
        const id = created.id;
        setSelection((selected) => (single() ? [id] : [...selected, id]));
      }
      setQuery('');
      searchInput?.focus();
    } catch (failure) {
      if (current !== session) return;
      setError(messages.createError(name));
      input.onError?.(failure);
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
      await input.onSubmit?.([...selection()]);
      if (current !== session) return;
      setBusy(false);
      input.onClose?.();
    } catch (failure) {
      if (current !== session) return;
      setBusy(false);
      setError(messages.submitError());
      input.onError?.(failure);
    }
  };

  const onSearchKeyDown: JSX.EventHandler<HTMLInputElement, KeyboardEvent> = (e) => {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    const [first] = visible();
    const onlyMatch = visible().length === 1 ? first : undefined;
    if (onlyMatch && !input.onCreate) toggle(onlyMatch.id);
    else if (!exactMatch() && trimmedQuery()) void create().catch(reportAsyncError);
    else if (onlyMatch) toggle(onlyMatch.id);
  };

  return {
    selection,
    query,
    setQuery,
    busy,
    creating,
    error,
    max: () => input.max,
    visible,
    trimmedQuery,
    showSearch,
    single,
    full,
    dirty,
    canCreate,
    searchRef: (el) => (searchInput = el),
    toggle,
    clear,
    create,
    submit,
    onSearchKeyDown,
  };
};
