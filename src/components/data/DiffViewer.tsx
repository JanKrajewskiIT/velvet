import type { I18nKey } from '@jankrajewskiit/i18n';
import { createMemo, createSignal, For, Match, mergeProps, Switch } from 'solid-js';

import { createControllable } from '../../hooks/createControllable';
import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { diffLines } from './diffLines';
import { DiffSkip } from './DiffSkip';
import { DiffSplitCell } from './DiffSplitCell';
import { DiffText } from './DiffText';
import { DIFF_SIGN, foldUnchanged, toSplitRows } from './diffView';

const DIFF_MODES = ['unified', 'split'] as const;

export type DiffMode = (typeof DIFF_MODES)[number];

const DIFF_MODE_LABEL_KEY: Record<DiffMode, I18nKey> = {
  unified: 'velvet.data.diffViewer.modeUnified',
  split: 'velvet.data.diffViewer.modeSplit',
};

export interface DiffViewerProps {
  oldText: string;
  newText: string;
  /** Shown in the bar. */
  filename?: string;
  mode?: DiffMode;
  /** @default 'unified' */
  defaultMode?: DiffMode;
  onModeChange?: (mode: DiffMode) => void;
  /** Unchanged lines kept around each change. @default 3 */
  context?: number;
  class?: string;
}

/**
 * Line diff of two texts on the code surface (same bar and palette as CodeSnippet). Unified or split view, old / new line numbers,
 * word-level highlights inside changed lines, unchanged runs folded to `context` lines. Fine up to a few thousand lines.
 */
export const DiffViewer = (props: DiffViewerProps) => {
  const merged = mergeProps({ context: 3 } satisfies Partial<DiffViewerProps>, props);
  const translate = useTranslate();
  const [mode, setMode] = createControllable<DiffMode>({
    value: () => props.mode,
    defaultValue: props.defaultMode ?? 'unified',
    onChange: (next) => props.onModeChange?.(next),
  });
  const [expanded, setExpanded] = createSignal<ReadonlySet<number>>(new Set());

  const rows = createMemo(() => diffLines(merged.oldText, merged.newText));
  const added = () => rows().filter((row) => row.t === 'add').length;
  const removed = () => rows().filter((row) => row.t === 'del').length;
  const view = createMemo(() => foldUnchanged(rows(), merged.context, expanded()));
  const splitRows = createMemo(() => toSplitRows(view()));
  const expand = (key: number) => setExpanded((previous) => new Set(previous).add(key));

  return (
    <div class={cx('vui-code', 'vui-diff', `vui-diff--${mode()}`, merged.class)}>
      <div class="vui-code__bar">
        <span class="vui-code__title">{merged.filename}</span>
        <span
          class="vui-diff__stats"
          aria-label={translate('velvet.data.diffViewer.statsLabel', { added: added(), removed: removed() })}
        >
          <span class="vui-diff__plus">+{added()}</span>
          <span class="vui-diff__minus">−{removed()}</span>
        </span>
        <div class="vui-diff__modes" role="group" aria-label={translate('velvet.data.diffViewer.viewLabel')}>
          <For each={DIFF_MODES}>
            {(option) => (
              <button
                type="button"
                class={cx('vui-code__tab', mode() === option && 'vui-code__tab--on')}
                aria-pressed={mode() === option}
                onClick={() => setMode(option)}
              >
                {translate(DIFF_MODE_LABEL_KEY[option])}
              </button>
            )}
          </For>
        </div>
      </div>
      <div
        class="vui-diff__body"
        role="table"
        aria-label={
          merged.filename
            ? translate('velvet.data.diffViewer.changesLabelNamed', { filename: merged.filename })
            : translate('velvet.data.diffViewer.changesLabel')
        }
      >
        <Switch>
          <Match when={mode() === 'split'}>
            <For each={splitRows()}>
              {(entry) => (
                <Switch>
                  <Match when={entry.kind === 'skip' ? entry.skip : undefined}>
                    {(skip) => <DiffSkip skip={skip()} onExpand={expand} />}
                  </Match>
                  <Match when={entry.kind === 'eq' ? entry.row : undefined}>
                    {(row) => (
                      <div class="vui-diff__row">
                        <span class="vui-diff__ln">{row().o}</span>
                        <span class="vui-diff__sign" />
                        <DiffText row={row()} />
                        <span class="vui-diff__ln">{row().n}</span>
                        <span class="vui-diff__sign" />
                        <DiffText row={row()} />
                      </div>
                    )}
                  </Match>
                  <Match when={entry.kind === 'pair' ? entry : undefined}>
                    {(pair) => (
                      <div class="vui-diff__row">
                        <DiffSplitCell side="del" row={pair().del} />
                        <DiffSplitCell side="add" row={pair().add} />
                      </div>
                    )}
                  </Match>
                </Switch>
              )}
            </For>
          </Match>
          <Match when={mode() === 'unified'}>
            <For each={view()}>
              {(entry) => (
                <Switch>
                  <Match when={entry.t === 'skip' ? entry : undefined}>
                    {(skip) => <DiffSkip skip={skip()} onExpand={expand} />}
                  </Match>
                  <Match when={entry.t === 'skip' ? undefined : entry}>
                    {(row) => (
                      <div class={cx('vui-diff__row', row().t !== 'eq' && `vui-diff__c--${row().t}`)}>
                        <span class="vui-diff__ln">{row().o}</span>
                        <span class="vui-diff__ln">{row().n}</span>
                        <span class="vui-diff__sign">{DIFF_SIGN[row().t]}</span>
                        <span class="vui-diff__code">
                          <DiffText row={row()} />
                        </span>
                      </div>
                    )}
                  </Match>
                </Switch>
              )}
            </For>
          </Match>
        </Switch>
      </div>
    </div>
  );
};
