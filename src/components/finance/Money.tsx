import { useI18n } from '@jankrajewskiit/i18n';
import { createMemo, mergeProps, Show, splitProps } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import type { HtmlProps } from '../../utils/polymorphic';
import { marketDirection } from './marketDirection';
import styles from './Money.module.css';
import { useMoneyHidden } from './moneyPrivacyContext';

export interface MoneyProps extends HtmlProps<HTMLSpanElement, 'children' | 'hidden'> {
  amount: number | null | undefined;
  currency?: string;
  digits?: number;
  signed?: boolean;
  colored?: boolean;
  compact?: boolean;
  hidden?: boolean;
  size?: 'sm' | 'md' | 'lg';
  strong?: boolean;
  currencyDisplay?: 'code' | 'symbol';
}

export const Money = (props: MoneyProps) => {
  const merged = mergeProps({ digits: 2, size: 'md', currencyDisplay: 'code' } satisfies Partial<MoneyProps>, props);
  const [local, rest] = splitProps(merged, [
    'amount',
    'currency',
    'digits',
    'signed',
    'colored',
    'compact',
    'hidden',
    'size',
    'strong',
    'currencyDisplay',
    'class',
  ]);
  const i18n = useI18n();
  const translate = useTranslate();
  const contextHidden = useMoneyHidden();
  const hidden = () => local.hidden ?? contextHidden();
  const valid = () => local.amount != null && Number.isFinite(local.amount);
  const symbolMode = () => local.currencyDisplay === 'symbol' && /^[A-Za-z]{3}$/u.test(local.currency ?? '');
  const formatter = createMemo(
    () =>
      new Intl.NumberFormat(i18n.locale(), {
        minimumFractionDigits: local.digits,
        maximumFractionDigits: local.digits,
        notation: local.compact ? 'compact' : 'standard',
        signDisplay: local.signed ? 'exceptZero' : 'auto',
        style: symbolMode() ? 'currency' : 'decimal',
        currency: symbolMode() ? local.currency : undefined,
        currencyDisplay: 'narrowSymbol',
      }),
  );
  const text = () => (hidden() ? '•••••' : valid() ? formatter().format(local.amount ?? 0) : '—');
  return (
    <span
      {...rest}
      class={cx(styles.root, local.strong && styles.strong, hidden() && styles.hidden, local.class)}
      data-size={local.size}
      data-dir={local.colored && !hidden() && valid() ? marketDirection(local.amount ?? 0) : undefined}
      aria-label={hidden() ? translate('velvet.finance.money.hidden') : rest['aria-label']}
    >
      <span class={styles.amount}>{text()}</span>
      <Show when={local.currency && (!symbolMode() || hidden() || !valid())}>
        <span class={styles.currency}>{local.currency}</span>
      </Show>
    </span>
  );
};
