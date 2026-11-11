import { useI18n } from '@jankrajewskiit/i18n';
import { createEffect, createMemo, createSignal, For, mergeProps, onCleanup, onMount, Show } from 'solid-js';

import { createRecordKeys } from '../../hooks/createRecordKeys';
import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import type { StatusTone } from '../../utils/tone';
import { Dot } from '../primitives/Dot';
import { Text } from '../primitives/Text';
import { createMarketSessionReader } from './marketSession';
import styles from './MarketSessionClock.module.css';
import { marketSessionText } from './marketSessionText';
import type { MarketHours, MarketSessionLabels, MarketSessionState } from './marketSessionTypes';
import { StatusBarItem, type StatusBarItemProps } from './StatusBarItem';

const DEFAULT_REFRESH = 30000;
const MAX_REFRESH = 2147483647;
const NO_MARKETS: readonly MarketHours[] = Object.freeze([]);
const SESSION_TONE: Readonly<Record<MarketSessionState['state'], StatusTone>> = Object.freeze({
  open: 'success',
  pre: 'warning',
  closed: 'neutral',
});

const liveOpen = (state: MarketSessionState | undefined): boolean => state?.state === 'open' && !state.alwaysOpen;

export interface MarketSessionClockProps {
  markets: readonly MarketHours[];
  /** Fixed moment; omit for the live clock. */
  now?: Date | number;
  /** Milliseconds; 0 disables the interval. @default 30000 */
  refresh?: number;
  /** @default 'inline' */
  variant?: 'inline' | 'list';
  /** Templates open/early use {t}; opensIn uses {d}. */
  labels?: Partial<MarketSessionLabels>;
  hide?: StatusBarItemProps['hide'];
  /** Inline tooltip or list name. */
  title?: string;
  /** Applied to the list, or each inline item. */
  class?: string;
}

export const MarketSessionClock = (props: MarketSessionClockProps) => {
  const p = mergeProps({ markets: NO_MARKETS, refresh: DEFAULT_REFRESH, variant: 'inline' }, props);
  const translate = useTranslate();
  const i18n = useI18n();
  const [mounted, setMounted] = createSignal(false);
  const [tick, setTick] = createSignal<number>();
  onMount(() => setMounted(true));
  createEffect(() => {
    const refresh = p.refresh;
    if (!Number.isFinite(refresh) || refresh < 0 || refresh > MAX_REFRESH) {
      throw new RangeError(`MarketSessionClock.refresh must be finite, between 0 and ${MAX_REFRESH} milliseconds.`);
    }
    if (!mounted() || p.now != null) return;
    setTick(Date.now());
    if (!refresh) return;
    const timer = setInterval(() => setTick(Date.now()), Math.max(1, Math.floor(refresh)));
    onCleanup(() => clearInterval(timer));
  });
  const date = createMemo(() => {
    const fixed = p.now;
    const time = fixed instanceof Date ? fixed.getTime() : (fixed ?? tick());
    if (time === undefined) return undefined;
    const result = new Date(time);
    if (!Number.isFinite(result.getTime()))
      throw new RangeError('MarketSessionClock.now must be a valid date or timestamp.');
    return result;
  });
  const records = createRecordKeys(
    () => p.markets,
    (market) => market.code,
    'MarketSessionClock',
  );
  const readers = createMemo(() => p.markets.map((market) => ({ market, read: createMarketSessionReader(market) })));
  const timeFormat = createMemo(
    () =>
      new Intl.DateTimeFormat(i18n.locale(), {
        hour: '2-digit',
        minute: '2-digit',
        hourCycle: 'h23',
        timeZone: 'UTC',
      }),
  );
  const rows = createMemo(() =>
    readers().map(({ market, read }) => {
      const moment = date();
      const state = moment ? read(moment) : undefined;
      const tone: StatusTone = state ? SESSION_TONE[state.state] : 'neutral';
      return {
        market,
        state,
        tone,
        text: state
          ? marketSessionText(state, {
              translate,
              locale: i18n.locale(),
              timeFormat: timeFormat(),
              labels: p.labels,
            })
          : translate('velvet.trading.marketSessionClock.pending'),
      };
    }),
  );
  const title = (market: MarketHours): string =>
    p.title ||
    (market.timeZone
      ? translate('velvet.trading.marketSessionClock.marketTitle', {
          market: market.name || market.code,
          timeZone: market.timeZone,
        })
      : market.name || market.code);

  return (
    <Show
      when={p.variant === 'list'}
      fallback={
        <For each={records.keys()}>
          {(key) => (
            <Show when={rows()[records.indexOf(key)]}>
              {(row) => (
                <StatusBarItem
                  tone={row().tone}
                  hide={p.hide}
                  title={title(row().market)}
                  class={p.class}
                  aria-busy={!date() || undefined}
                >
                  <Text as="b" variant="caption" class={styles.code}>
                    {row().market.code}
                  </Text>{' '}
                  {row().text}
                </StatusBarItem>
              )}
            </Show>
          )}
        </For>
      }
    >
      <ul
        class={cx(styles.list, p.class)}
        aria-label={p.title || translate('velvet.trading.marketSessionClock.label')}
        aria-busy={!date() || undefined}
      >
        <For each={records.keys()}>
          {(key) => (
            <Show when={rows()[records.indexOf(key)]}>
              {(row) => (
                <li class={styles.row} data-state={row().state?.state}>
                  <Dot tone={row().tone} pulse={liveOpen(row().state)} />
                  <Text as="span" variant="body-sm" class={styles.code}>
                    {row().market.code}
                  </Text>
                  <Show when={row().market.name}>
                    <Text as="span" variant="body-sm" tone="tertiary">
                      {row().market.name}
                    </Text>
                  </Show>
                  <Text as="span" variant="body-sm" tone="secondary" tabular class={styles.text}>
                    {row().text}
                  </Text>
                </li>
              )}
            </Show>
          )}
        </For>
      </ul>
    </Show>
  );
};
