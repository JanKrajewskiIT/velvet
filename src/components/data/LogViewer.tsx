import { createEffect, createMemo, createSignal, For, Index, mergeProps, Show, untrack } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { variantClass } from '../../utils/cssModule';
import { cx } from '../../utils/cx';
import { Glyph } from '../primitives/Glyph';
import { Text } from '../primitives/Text';
import { typographyClass } from '../primitives/typography';
import { cssLength } from './cssLength';
import { formatLogTimestamp, LOG_LEVELS, type LogLevel, type LogLine, splitByQuery, toLogRows } from './logLines';
import styles from './LogViewer.module.css';

const LOG_PART_LVL_CLASSES = {
  debug: styles.logPartLvlVariantDebug,
  info: styles.logPartLvlVariantInfo,
  warn: styles.logPartLvlVariantWarn,
  error: styles.logPartLvlVariantError,
} as const;

const LOG_PART_ROW_CLASSES = {
  debug: styles.logPartRowVariantDebug,
  info: styles.logPartRowVariantInfo,
  warn: styles.logPartRowVariantWarn,
  error: styles.logPartRowVariantError,
} as const;

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
    <div class={cx(typographyClass('body-sm'), styles.code, styles.log, merged.class)}>
      <div class={cx(styles.codePartBar, styles.logPartBar)}>
        <Text as="span" variant="kbd" tone="inherit" class={styles.codePartTitle}>
          {title()}
        </Text>
        <div class={styles.logPartLevels} role="group" aria-label={translate('velvet.data.logViewer.levelsLabel')}>
          <For each={LOG_LEVELS}>
            {(level) => (
              <button
                type="button"
                class={cx(typographyClass('kbd'), styles.logPartLvl, variantClass(LOG_PART_LVL_CLASSES, level))}
                aria-pressed={visibleLevels().has(level)}
                onClick={() => toggleLevel(level)}
              >
                {level}
                <Text as="span" variant="micro" tone="inherit">
                  {counts()[level]}
                </Text>
              </button>
            )}
          </For>
        </div>
        <label class={styles.logPartSearch}>
          <Glyph name="search" />
          <input
            class={typographyClass('code')}
            value={query()}
            onInput={(event) => setQuery(event.currentTarget.value)}
            placeholder={translate('velvet.data.logViewer.filterPlaceholder')}
            aria-label={translate('velvet.data.logViewer.filterLabel')}
          />
        </label>
        <button
          type="button"
          class={cx(styles.codePartCopy, typographyClass('label-sm'))}
          aria-pressed={wrap()}
          onClick={() => setWrap(!wrap())}
        >
          {translate(wrap() ? 'velvet.data.logViewer.noWrap' : 'velvet.data.logViewer.wrap')}
        </button>
      </div>
      <div
        ref={(element) => {
          body = element;
        }}
        class={cx(typographyClass('code'), styles.logPartBody, wrap() && styles.logPartBodyVariantWrap)}
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
          fallback={
            <Text as="div" variant="caption" tone="inherit" class={styles.logPartEmpty}>
              {translate('velvet.data.logViewer.noMatches')}
            </Text>
          }
        >
          <Index each={shown()}>
            {(row) => (
              <Text
                as="div"
                variant="code"
                tone="inherit"
                class={cx(styles.logPartRow, variantClass(LOG_PART_ROW_CLASSES, row().level))}
              >
                <Show when={merged.lineNumbers}>
                  <span class={styles.logPartLn}>{row().index + 1}</span>
                </Show>
                <Show when={merged.showTimestamps && row().ts != null ? row().ts : undefined}>
                  {(ts) => <span class={styles.logPartTs}>{formatLogTimestamp(ts())}</span>}
                </Show>
                <span class={styles.logPartLv}>{row().level.toUpperCase()}</span>
                <Show when={row().source}>{(source) => <span class={styles.logPartSrc}>{source()}</span>}</Show>
                <span class={styles.logPartMsg}>
                  <For each={splitByQuery(row().message, needle())}>
                    {(part) => (
                      <Show when={part.match} fallback={part.text}>
                        <mark>{part.text}</mark>
                      </Show>
                    )}
                  </For>
                </span>
              </Text>
            )}
          </Index>
        </Show>
      </div>
      <Show when={!follow()}>
        <button
          type="button"
          class={cx(styles.logPartJump, typographyClass('label-sm'))}
          onClick={() => setFollow(true)}
        >
          <Glyph name="arrow-down" />
          {unseen()
            ? translate('velvet.data.logViewer.newLines', { count: unseen() })
            : translate('velvet.data.logViewer.latest')}
        </button>
      </Show>
    </div>
  );
};
