import { useI18n } from '@jankrajewskiit/i18n';
import { createMemo, For, type JSX, mergeProps, Show } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { Delta } from '../data/Delta';
import { Badge } from '../primitives/Badge';
import { Dot } from '../primitives/Dot';
import { Heading } from '../primitives/Heading';
import { Text } from '../primitives/Text';
import styles from './InstrumentHeader.module.css';
import type { MarketSessionState } from './marketSessionTypes';
import { PriceCell } from './PriceCell';
import { DEFAULT_PRICE_DIGITS, priceDigits } from './priceFormat';
import type { QuoteStore } from './quoteStore';
import { useQuote } from './useQuote';

export interface InstrumentHeaderProps {
  symbol: JSX.Element;
  name?: string;
  venue?: string;
  tag?: JSX.Element;
  badges?: JSX.Element;
  price?: number | null;
  quotes?: QuoteStore;
  quoteKey?: string;
  reference?: number;
  digits?: number;
  locale?: string;
  currency?: string;
  change?: number | null;
  changeAbs?: number | null;
  session?: {
    state: MarketSessionState['state'];
    label: JSX.Element;
    tone?: 'success' | 'warning' | 'neutral' | 'danger';
  };
  meta?: readonly { label: JSX.Element; value: JSX.Element; mono?: boolean }[];
  actions?: JSX.Element;
  hidden?: boolean;
  class?: string;
}

export const InstrumentHeader = (props: InstrumentHeaderProps) => {
  const p = mergeProps({ digits: DEFAULT_PRICE_DIGITS, hidden: false }, props);
  const i18n = useI18n();
  const translate = useTranslate();
  const key = () => p.quoteKey ?? (typeof p.symbol === 'string' ? p.symbol : undefined);
  const live = useQuote(
    () => p.quotes,
    key,
    () => p.price,
  );
  const hasReference = () =>
    p.reference != null &&
    Number.isFinite(p.reference) &&
    p.reference !== 0 &&
    live() != null &&
    Number.isFinite(live());
  const change = () => (hasReference() ? (((live() ?? 0) - (p.reference ?? 0)) / (p.reference ?? 1)) * 100 : p.change);
  const absolute = () => (hasReference() ? (live() ?? 0) - (p.reference ?? 0) : p.changeAbs);
  const formatter = createMemo(
    () =>
      new Intl.NumberFormat(p.locale ?? i18n.locale(), {
        minimumFractionDigits: priceDigits(p.digits),
        maximumFractionDigits: priceDigits(p.digits),
        signDisplay: 'exceptZero',
      }),
  );
  const tone = () =>
    p.session?.tone ?? (p.session?.state === 'open' ? 'success' : p.session?.state === 'pre' ? 'warning' : 'neutral');

  return (
    <header class={cx(styles.root, p.class)}>
      <div class={styles.identity}>
        <div class={styles.row}>
          <Heading level={1} variant="display-md" class={styles.symbol}>
            {p.symbol}
          </Heading>
          <Show when={p.tag}>
            <Badge size="sm" variant="outline">
              {p.tag}
            </Badge>
          </Show>
          {p.badges}
        </div>
        <Show when={p.name || p.venue}>
          <Text as="p" variant="body-sm" tone="secondary" class={styles.name}>
            {[p.name, p.venue].filter(Boolean).join(' · ')}
          </Text>
        </Show>
      </div>
      <div class={styles.quote}>
        <PriceCell
          symbol={key()}
          value={live()}
          digits={p.digits}
          locale={p.locale}
          currency={p.currency}
          size="lg"
          hidden={p.hidden}
        />
        <div class={styles.change}>
          <Show when={!p.hidden}>
            <Show when={change() != null}>
              <Delta value={change()} locale={p.locale} label={translate('velvet.trading.instrumentHeader.change')} />
            </Show>
            <Show when={absolute() != null && Number.isFinite(absolute())}>
              <Text as="span" variant="body-sm" mono tabular tone="secondary">
                {formatter()
                  .format(absolute() ?? 0)
                  .replace(/^-/u, '−')}
              </Text>
            </Show>
          </Show>
          <Show when={p.session}>
            {(session) => (
              <span class={styles.session} data-state={session().state}>
                <Dot tone={tone()} pulse={session().state === 'open'} />
                {session().label}
              </span>
            )}
          </Show>
        </div>
      </div>
      <Show when={p.actions}>
        <div class={styles.actions}>{p.actions}</div>
      </Show>
      <Show when={p.meta?.length}>
        <dl class={styles.meta}>
          <For each={p.meta}>
            {(item) => (
              <div class={styles.fact}>
                <dt class={styles.factLabel}>{item.label}</dt>
                <Text
                  as="dd"
                  variant="body-sm"
                  data-mono={item.mono === false ? undefined : ''}
                  tone="primary"
                  class={styles.factValue}
                >
                  {item.value}
                </Text>
              </div>
            )}
          </For>
        </dl>
      </Show>
    </header>
  );
};
