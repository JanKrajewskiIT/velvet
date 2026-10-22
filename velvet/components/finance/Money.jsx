import React from 'react';
import { cx } from '../primitives/cx.js';
const PrivacyCtx = React.createContext(false);
export function MoneyPrivacy({ hidden = false, children }) { return <PrivacyCtx.Provider value={!!hidden}>{children}</PrivacyCtx.Provider>; }
export function useMoneyHidden() { return React.useContext(PrivacyCtx); }
export function Money({ amount, currency, digits = 2, signed = false, colored = false, compact = false, hidden, size = 'md', strong = false, currencyDisplay = 'code', className, ...rest }) {
  const ctxHidden = React.useContext(PrivacyCtx);
  const isHidden = hidden ?? ctxHidden;
  if (amount == null || Number.isNaN(+amount)) return <span className={cx('vui-money', className)} {...rest}><span className="vui-money__amt">—</span>{currency && <span className="vui-money__ccy">{currency}</span>}</span>;
  const v = +amount; const dir = v > 0 ? 'up' : v < 0 ? 'down' : 'flat';
  let txt;
  if (compact) { const a = Math.abs(v); txt = a >= 1e9 ? (a / 1e9).toFixed(2) + ' bn' : a >= 1e6 ? (a / 1e6).toFixed(2) + ' m' : a >= 1e4 ? (a / 1e3).toFixed(1) + 'k' : a.toLocaleString('en-US', { minimumFractionDigits: digits, maximumFractionDigits: digits }); }
  else txt = Math.abs(v).toLocaleString('en-US', { minimumFractionDigits: digits, maximumFractionDigits: digits });
  const sign = v < 0 ? '−' : signed && v > 0 ? '+' : '';
  const sym = currencyDisplay === 'symbol' ? ({ USD: '$', EUR: '€', GBP: '£', PLN: 'zł', JPY: '¥' })[currency] : null;
  return (
    <span className={cx('vui-money', size !== 'md' && 'vui-money--' + size, strong && 'vui-money--strong', isHidden && 'vui-money--hidden', className)} data-dir={colored && !isHidden ? dir : undefined} aria-label={isHidden ? 'Amount hidden' : undefined} {...rest}>
      <span className="vui-money__amt">{isHidden ? '•••••' : sym && currency !== 'PLN' ? sign + sym + txt : sign + txt}</span>
      {currency && !(sym && currency !== 'PLN') && <span className="vui-money__ccy">{sym || currency}</span>}
    </span>
  );
}
