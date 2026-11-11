import { useI18n } from '@jankrajewskiit/i18n';
import { createEffect, createMemo, createSignal, mergeProps, on, onCleanup, Show, splitProps } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import type { HtmlProps } from '../../utils/polymorphic';
import { Delta } from '../data/Delta';
import { VisuallyHidden } from '../primitives/VisuallyHidden';
import styles from './PriceCell.module.css';
import { DEFAULT_PRICE_DIGITS, priceDigits } from './priceFormat';
import type { QuoteStore } from './quoteStore';
import { useQuote } from './useQuote';

export interface PriceCellProps extends HtmlProps<HTMLSpanElement, 'children' | 'hidden'> {
  value?: number | null;
  quotes?: QuoteStore;
  symbol?: string;
  digits?: number;
  locale?: string;
  currency?: string;
  change?: number | null;
  changeFormat?: 'percent' | 'pp' | 'number';
  flash?: boolean;
  size?: 'sm' | 'md' | 'lg';
  hidden?: boolean;
  label?: string;
}

const FLASH_MS = 900;

export const PriceCell = (props: PriceCellProps) => {
  const p = mergeProps(
    {
      digits: DEFAULT_PRICE_DIGITS,
      flash: true,
      size: 'sm',
      hidden: false,
      changeFormat: 'percent',
    } satisfies Partial<PriceCellProps>,
    props,
  );
  const [local, rest] = splitProps(p, [
    'value',
    'quotes',
    'symbol',
    'digits',
    'locale',
    'currency',
    'change',
    'changeFormat',
    'flash',
    'size',
    'hidden',
    'label',
    'class',
  ]);
  const i18n = useI18n();
  const translate = useTranslate();
  const value = useQuote(
    () => local.quotes,
    () => local.symbol,
    () => local.value,
  );
  const formatter = createMemo(
    () =>
      new Intl.NumberFormat(local.locale ?? i18n.locale(), {
        minimumFractionDigits: priceDigits(local.digits),
        maximumFractionDigits: priceDigits(local.digits),
      }),
  );
  const [direction, setDirection] = createSignal<'up' | 'down'>();
  const [revision, setRevision] = createSignal(1);
  let timer: ReturnType<typeof setTimeout> | undefined;
  onCleanup(() => clearTimeout(timer));
  createEffect(
    on(
      () => [value(), local.flash, local.hidden, local.quotes, local.symbol] as const,
      (next, previous) => {
        clearTimeout(timer);
        setDirection(undefined);
        const current = next[0];
        const old = previous?.[0];
        if (previous && (next[3] !== previous[3] || next[4] !== previous[4])) return;
        if (
          !next[1] ||
          next[2] ||
          current == null ||
          old == null ||
          !Number.isFinite(current) ||
          !Number.isFinite(old) ||
          current === old
        )
          return;
        setDirection(current > old ? 'up' : 'down');
        setRevision((number) => number + 1);
        timer = setTimeout(() => setDirection(undefined), FLASH_MS);
      },
      { defer: true },
    ),
  );
  const valid = () => value() != null && Number.isFinite(value());
  const text = () =>
    !valid()
      ? translate('velvet.trading.priceCell.empty')
      : local.hidden
        ? translate('velvet.trading.priceCell.mask')
        : formatter()
            .format(value() ?? 0)
            .replace(/^-/u, '−');
  const name = createMemo(() => {
    if (local.hidden && valid()) return translate('velvet.finance.money.hidden');
    if (!local.label) return undefined;
    return translate('velvet.trading.priceCell.label', {
      label: local.label,
      value: text(),
      currency: valid() ? (local.currency ?? '') : '',
    }).trimEnd();
  });

  return (
    <span {...rest} class={cx(styles.root, local.class)} data-size={local.size} data-tick={direction()}>
      <Show when={name()}>{(description) => <VisuallyHidden>{description()}</VisuallyHidden>}</Show>
      <Show when={revision()} keyed>
        {() => (
          <span class={styles.value} aria-hidden={name() ? true : undefined}>
            {text()}
            <Show when={local.currency && valid()}>
              <span class={styles.currency}>{local.currency}</span>
            </Show>
          </span>
        )}
      </Show>
      <Show when={local.change != null && !local.hidden}>
        <Delta value={local.change} format={local.changeFormat} size="sm" locale={local.locale} />
      </Show>
    </span>
  );
};
