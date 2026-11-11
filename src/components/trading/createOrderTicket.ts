import { useI18n } from '@jankrajewskiit/i18n';
import { createEffect, createMemo, createSignal, untrack } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { parseDecimal } from '../../utils/decimalValue';
import { dispatchTradingAction } from './dispatchTradingAction';
import type { OrderTicketLabels, OrderTicketOrder, OrderTicketProps } from './orderTicketTypes';
import { priceDigits } from './priceFormat';
import { useQuote } from './useQuote';

const orderNumber = (value: string): number | null => parseDecimal(value) ?? null;
const positive = (value: number | null | undefined): value is number =>
  value != null && Number.isFinite(value) && value > 0;
const equalFrame = (a: readonly unknown[], b: readonly unknown[]) =>
  a.length === b.length && a.every((value, index) => Object.is(value, b[index]));

export const createOrderTicket = (props: OrderTicketProps) => {
  const i18n = useI18n();
  const translate = useTranslate();
  const label = (key: keyof OrderTicketLabels) => props.labels?.[key] ?? translate(`velvet.trading.orderTicket.${key}`);
  const price = useQuote(
    () => props.quotes,
    () => props.symbol,
    () => props.price,
  );
  const [side, setSide] = createSignal<OrderTicketOrder['side']>('buy');
  const [type, setType] = createSignal<OrderTicketOrder['type']>('market');
  const [qty, setQty] = createSignal(untrack(() => String(props.defaultQty ?? (props.minQty || props.qtyStep || 1))));
  const [limit, setLimit] = createSignal(price() == null ? '' : String(price()));
  const [sl, setSl] = createSignal('');
  const [tp, setTp] = createSignal('');
  const [tif, setTif] = createSignal<OrderTicketOrder['tif']>('day');
  const digits = () => priceDigits(props.digits ?? 2);
  const locale = () => props.locale ?? i18n.locale();
  const formatter = createMemo(
    () => new Intl.NumberFormat(locale(), { minimumFractionDigits: digits(), maximumFractionDigits: digits() }),
  );
  const ratioFormatter = createMemo(() => new Intl.NumberFormat(locale(), { maximumFractionDigits: 2 }));
  const format = (value: number | null | undefined) =>
    value == null || !Number.isFinite(value)
      ? translate('velvet.trading.priceCell.empty')
      : props.hidden
        ? translate('velvet.trading.priceCell.mask')
        : formatter().format(value);
  const ratio = (value: number | null) =>
    value == null ? format(null) : props.hidden ? format(value) : ratioFormatter().format(value);
  const step = () => props.qtyStep ?? 1;
  const currency = () => props.currency ?? 'USD';
  const entry = () => (type() === 'market' ? (price() ?? null) : orderNumber(limit()));
  const quantity = () => orderNumber(qty()) ?? 0;
  const stopLoss = () => orderNumber(sl());
  const takeProfit = () => orderNumber(tp());
  const wrongSl = () =>
    sl().trim() !== '' &&
    (!positive(stopLoss()) ||
      !positive(entry()) ||
      (side() === 'buy' ? (stopLoss() ?? 0) >= (entry() ?? 0) : (stopLoss() ?? 0) <= (entry() ?? 0)));
  const wrongTp = () =>
    tp().trim() !== '' &&
    (!positive(takeProfit()) ||
      !positive(entry()) ||
      (side() === 'buy' ? (takeProfit() ?? 0) <= (entry() ?? 0) : (takeProfit() ?? 0) >= (entry() ?? 0)));
  const notional = () => (positive(entry()) ? (entry() ?? 0) * quantity() : null);
  const risk = () =>
    stopLoss() != null && !wrongSl() && positive(entry())
      ? Math.abs((entry() ?? 0) - (stopLoss() ?? 0)) * quantity()
      : null;
  const riskPct = () => (risk() != null && positive(props.equity) ? ((risk() ?? 0) / (props.equity ?? 1)) * 100 : null);
  const reward = () =>
    takeProfit() != null && !wrongTp() && positive(entry())
      ? Math.abs((takeProfit() ?? 0) - (entry() ?? 0)) * quantity()
      : null;
  const rr = () => (positive(risk()) && reward() != null ? (reward() ?? 0) / (risk() ?? 1) : null);
  const issues = createMemo(() => {
    const result: { tone: 'danger' | 'warning'; text: string }[] = [];
    if (wrongSl()) result.push({ tone: 'danger', text: label('wrongSl') });
    else if (stopLoss() == null) result.push({ tone: 'warning', text: label('noStop') });
    if (wrongTp()) result.push({ tone: 'danger', text: label('wrongTp') });
    if (riskPct() != null && props.maxRiskPct != null && (riskPct() ?? 0) > props.maxRiskPct)
      result.push({ tone: 'danger', text: label('overLimit') });
    if (props.buyingPower != null && notional() != null && (notional() ?? 0) > props.buyingPower)
      result.push({ tone: 'danger', text: label('overPower') });
    return result;
  });
  const blockText = () =>
    props.blocked ||
    (props.reduceOnly &&
    (!Number.isFinite(props.position ?? 0) ||
      (side() === 'buy' ? (props.position ?? 0) >= 0 : (props.position ?? 0) <= 0) ||
      quantity() > Math.abs(props.position ?? 0))
      ? label('reduceOnly')
      : null);
  const can = () => {
    const q = quantity(),
      s = step(),
      min = props.minQty ?? 0;
    const units = (q - min) / s;
    return (
      !blockText() &&
      !issues().some((issue) => issue.tone === 'danger') &&
      positive(entry()) &&
      positive(q) &&
      positive(s) &&
      Number.isFinite(min) &&
      min >= 0 &&
      q >= min &&
      Math.abs(units - Math.round(units)) < 1e-7 &&
      Number.isFinite(notional()) &&
      Number.isFinite(risk() ?? 0) &&
      Number.isFinite(riskPct() ?? 0) &&
      (props.equity === undefined || positive(props.equity)) &&
      (props.buyingPower === undefined || (Number.isFinite(props.buyingPower) && props.buyingPower >= 0)) &&
      (props.maxRiskPct === undefined || (Number.isFinite(props.maxRiskPct) && props.maxRiskPct >= 0))
    );
  };
  const quantityFormatter = createMemo(() => new Intl.NumberFormat(locale(), { maximumFractionDigits: 20 }));
  const what = () =>
    [
      label(side()),
      props.hidden ? format(quantity()) : quantityFormatter().format(quantity()),
      props.qtyUnit,
      props.symbol,
    ]
      .filter(Boolean)
      .join(' ');
  const order = (): OrderTicketOrder => ({
    side: side(),
    type: type(),
    qty: quantity(),
    limitPrice: type() === 'limit' ? entry() : null,
    stopPrice: type() === 'stop' ? entry() : null,
    stopLoss: stopLoss(),
    takeProfit: takeProfit(),
    tif: tif(),
    notional: notional(),
    risk: risk(),
  });
  const summary = () =>
    [
      what(),
      label(type()) + ' ' + format(entry()),
      stopLoss() == null ? null : label('sl') + ' ' + format(stopLoss()),
      takeProfit() == null ? null : label('tp') + ' ' + format(takeProfit()),
      label(tif()),
      props.account,
      props.envLabel,
    ]
      .filter(Boolean)
      .join(' · ');
  const frame = (): readonly unknown[] => {
    const current = order();
    return [
      current.side,
      current.type,
      current.qty,
      current.limitPrice,
      current.stopPrice,
      current.stopLoss,
      current.takeProfit,
      current.tif,
      current.notional,
      current.risk,
      price(),
      props.symbol,
      props.account,
      props.envLabel,
      props.envTone,
      props.confirmTone,
      props.quotes,
      props.onSubmit,
      props.reduceOnly,
      props.position,
      props.equity,
      props.buyingPower,
      props.maxRiskPct,
      props.blocked,
      step(),
      props.minQty,
      props.hidden,
      locale(),
      digits(),
      currency(),
      props.qtyUnit,
    ];
  };
  const [review, setReview] = createSignal<{
    frame: readonly unknown[];
    order: OrderTicketOrder;
    summary: string;
    submit: OrderTicketProps['onSubmit'];
  }>();
  createEffect(() => {
    const current = frame();
    if (review() && (!can() || !equalFrame(review()?.frame ?? [], current))) setReview(undefined);
  });
  const ask = () => {
    if (can()) setReview({ frame: frame(), order: order(), summary: summary(), submit: props.onSubmit });
  };
  const confirm = () => {
    const pending = review();
    setReview(undefined);
    if (pending && can() && equalFrame(pending.frame, frame()))
      dispatchTradingAction(() => pending.submit?.(pending.order));
  };
  const chooseType = (value: string) => {
    if (value !== 'market' && value !== 'limit' && value !== 'stop') return;
    setType(value);
    if (value !== 'market' && orderNumber(limit()) == null) setLimit(price() == null ? '' : String(price()));
  };
  return {
    props,
    label,
    price,
    side,
    setSide,
    type,
    chooseType,
    qty,
    setQty,
    limit,
    setLimit,
    sl,
    setSl,
    tp,
    setTp,
    tif,
    setTif,
    digits,
    step,
    currency,
    entry,
    format,
    ratio,
    notional,
    risk,
    riskPct,
    rr,
    issues,
    wrongSl,
    wrongTp,
    blockText,
    can,
    what,
    review,
    ask,
    confirm,
    cancel: () => setReview(undefined),
  };
};

export type OrderTicketController = ReturnType<typeof createOrderTicket>;
