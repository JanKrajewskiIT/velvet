import { createEffect, createMemo, createSignal, For, Index, mergeProps, Show, untrack } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { Glyph } from '../primitives/Glyph';
import { cssLength } from './cssLength';
import { formatLogTimestamp, LOG_LEVELS, type LogLevel, type LogLine, splitByQuery, toLogRows } from './logLines';

/** Distance from the bottom, in px, within which the view still counts as following. */
const FOLLOW_THRESHOLD_PX = 24;

export interface LogViewerProps {
  lines: Array<string | LogLine>;
  /** @default localized "Logs" */
  title?: string;
  /** Body height: px or CSS length. @default 320 */
  height?: number | string;
  /** Start pinned to the newest line. @default true */
  follow?: boolean;
  /** @default true */
  showTimestamps?: boolean;
  /** @default true */
  lineNumbers?: boolean;
  /** @default false */
  wrap?: boolean;
  /** Levels visible at start. @default all */
  levels?: LogLevel[];
  class?: string;
}

/**
 * Streaming log tail on the code surface — line numbers, timestamps, level column, source, level toggles with counts,
 * text filter with highlights, wrap toggle. Follows new lines while scrolled to the bottom; scrolling up pauses and
 * shows "N new" to jump back. Plain strings work — the level is detected from ERROR / WARN / INFO / DEBUG.
 */
export const LogViewer = (props: LogViewerProps) => {
  const merged = mergeProps({ height: 320, showTimestamps: true, lineNumbers: true }, props);
  const translate = useTranslate();
  const title = () => merged.title ?? translate('velvet.data.logViewer.title');
  const [query, setQuery] = createSignal('');
  const [visibleLevels, setVisibleLevels] = createSignal<ReadonlySet<LogLevel>>(
    untrack(() => new Set(props.levels ?? LOG_LEVELS)),
  );
  const [wrap, setWrap] = createSignal(untrack(() => props.wrap ?? false));
  const [follow, setFollow] = createSignal(untrack(() => props.follow ?? true));
  const [unseen, setUnseen] = createSignal(0);
  let body!: HTMLDivElement;
  let seenCount = untrack(() => merged.lines.length);

  const rows = createMemo(() => toLogRows(merged.lines));
  const counts = createMemo(() => {
    const totals: Record<LogLevel, number> = { debug: 0, info: 0, warn: 0, error: 0 };
    for (const row of rows()) totals[row.level]++;
    return totals;
  });
  const needle = () => query().trim();
  const shown = createMemo(() => {
    const lowered = needle().toLowerCase();
    return rows().filter(
      (row) =>
        visibleLevels().has(row.level) &&
        (!lowered || `${row.message} ${row.source ?? ''}`.toLowerCase().includes(lowered)),
    );
  });

  createEffect(() => {
    const total = rows().length;
    const following = follow();
    shown();
    const previous = seenCount;
    seenCount = total;
    if (following) {
      body.scrollTop = body.scrollHeight;
      setUnseen(0);
    } else if (total > previous) setUnseen((count) => count + total - previous);
  });

  const toggleLevel = (level: LogLevel) => {
    const next = new Set(visibleLevels());
    if (!next.delete(level)) next.add(level);
    setVisibleLevels(next.size ? next : new Set(LOG_LEVELS));
  };

  const onScroll = (element: HTMLElement) => {
    const atBottom = element.scrollHeight - element.scrollTop - element.clientHeight < FOLLOW_THRESHOLD_PX;
    if (atBottom !== follow()) setFollow(atBottom);
  };

  return (
    <div class={cx('vui-code', 'vui-log', merged.class)}>
      <div class="vui-code__bar vui-log__bar">
        <span class="vui-code__title">{title()}</span>
        <div class="vui-log__levels" role="group" aria-label={translate('velvet.data.logViewer.levelsLabel')}>
          <For each={LOG_LEVELS}>
            {(level) => (
              <button
                type="button"
                class={`vui-log__lvl vui-log__lvl--${level}`}
                aria-pressed={visibleLevels().has(level)}
                onClick={() => toggleLevel(level)}
              >
                {level}
                <span>{counts()[level]}</span>
              </button>
            )}
          </For>
        </div>
        <label class="vui-log__search">
          <Glyph name="search" />
          <input
            value={query()}
            onInput={(event) => setQuery(event.currentTarget.value)}
            placeholder={translate('velvet.data.logViewer.filterPlaceholder')}
            aria-label={translate('velvet.data.logViewer.filterLabel')}
          />
        </label>
        <button type="button" class="vui-code__copy" aria-pressed={wrap()} onClick={() => setWrap(!wrap())}>
          {translate(wrap() ? 'velvet.data.logViewer.noWrap' : 'velvet.data.logViewer.wrap')}
        </button>
      </div>
      <div
        ref={(element) => {
          body = element;
        }}
        class={cx('vui-log__body', wrap() && 'vui-log__body--wrap')}
        style={{ height: cssLength(merged.height) }}
        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- scrollable log region must be focusable so keyboard users can scroll it
        tabIndex={0}
        role="log"
        aria-live="off"
        aria-label={title()}
        onScroll={(event) => onScroll(event.currentTarget)}
      >
        <Show
          when={shown().length}
          fallback={<div class="vui-log__empty">{translate('velvet.data.logViewer.noMatches')}</div>}
        >
          <Index each={shown()}>
            {(row) => (
              <div class={`vui-log__row vui-log__row--${row().level}`}>
                <Show when={merged.lineNumbers}>
                  <span class="vui-log__ln">{row().index + 1}</span>
                </Show>
                <Show when={merged.showTimestamps && row().ts != null ? row().ts : undefined}>
                  {(ts) => <span class="vui-log__ts">{formatLogTimestamp(ts())}</span>}
                </Show>
                <span class="vui-log__lv">{row().level.toUpperCase()}</span>
                <Show when={row().source}>{(source) => <span class="vui-log__src">{source()}</span>}</Show>
                <span class="vui-log__msg">
                  <For each={splitByQuery(row().message, needle())}>
                    {(part) => (
                      <Show when={part.match} fallback={part.text}>
                        <mark>{part.text}</mark>
                      </Show>
                    )}
                  </For>
                </span>
              </div>
            )}
          </Index>
        </Show>
      </div>
      <Show when={!follow()}>
        <button type="button" class="vui-log__jump" onClick={() => setFollow(true)}>
          <Glyph name="arrow-down" />
          {unseen()
            ? translate('velvet.data.logViewer.newLines', { count: unseen() })
            : translate('velvet.data.logViewer.latest')}
        </button>
      </Show>
    </div>
  );
};
