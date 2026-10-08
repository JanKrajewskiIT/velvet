import React from 'react';
import { Badge } from '../display/Badge.jsx';
import { Button } from '../actions/Button.jsx';
import { Glyph } from '../primitives/Glyph.jsx';
import { OptionSwitcher } from '../forms/OptionSwitcher.jsx';
import { cx } from '../primitives/cx.js';
const pick = (v, b) => (v && typeof v === 'object' && !React.isValidElement(v) ? v[b] : v);
export function PricingTable({ tiers = [], billing, defaultBilling = 'monthly', onBillingChange, billingLabels = { monthly: 'Monthly', yearly: 'Yearly' }, periods = { monthly: '/ month', yearly: '/ year' }, yearlyNote, current, featuredLabel = 'Most popular', onSelect, className }) {
  const [b, setB] = React.useState(defaultBilling);
  const bill = billing ?? b;
  const hasBilling = tiers.some((t) => t.price && typeof t.price === 'object');
  const change = (v) => { setB(v); onBillingChange && onBillingChange(v); };
  return (
    <section className={cx('vui-pricing', className)}>
      {hasBilling && (
        <div className="vui-pricing__bar">
          <OptionSwitcher label="Billing period" options={[{ value: 'monthly', label: billingLabels.monthly }, { value: 'yearly', label: billingLabels.yearly }]} value={bill} onValueChange={change} />
          {yearlyNote && <Badge size="sm" tone={bill === 'yearly' ? 'success' : 'neutral'}>{yearlyNote}</Badge>}
        </div>
      )}
      <ul className="vui-pricing__grid" role="list">
        {tiers.map((t) => {
          const id = t.id ?? t.name;
          const isCur = current != null && current === id;
          const price = pick(t.price, bill);
          const numeric = /\d/.test(String(price));
          const period = t.period !== undefined ? pick(t.period, bill) : typeof t.price === 'object' ? periods[bill] : undefined;
          const note = pick(t.note, bill);
          return (
            <li key={id} className={cx('vui-pricing__tier', t.featured && 'vui-pricing__tier--featured', isCur && 'vui-pricing__tier--current')}>
              {t.featured && <span className="vui-pricing__flag">{t.badge || featuredLabel}</span>}
              <div className="vui-pricing__head"><h3 className="vui-pricing__name">{t.name}</h3>{isCur && <Badge size="sm">Current</Badge>}</div>
              {t.blurb && <p className="vui-pricing__blurb">{t.blurb}</p>}
              <div className="vui-pricing__price"><span key={bill} className={cx('vui-pricing__amount', !numeric && 'vui-pricing__amount--text')}>{price}</span>{numeric && period && <span className="vui-pricing__period">{period}</span>}</div>
              {hasBilling && <div className="vui-pricing__note">{note || '\u00a0'}</div>}
              <Button block variant={t.featured && !isCur ? 'primary' : 'secondary'} disabled={isCur} onClick={() => onSelect && onSelect(t, bill)}>{isCur ? 'Current plan' : t.cta || 'Choose ' + t.name}</Button>
              {(t.features || []).length > 0 && (
                <div className="vui-pricing__list">
                  {t.includes && <div className="vui-pricing__inc">{t.includes}</div>}
                  <ul className="vui-pricing__features">
                    {t.features.map((f, i) => { const o = typeof f === 'object' && !React.isValidElement(f) ? f : { label: f }; const off = o.included === false; return <li key={i} className={off ? 'vui-pricing__off' : undefined}><Glyph name={(off ? 'minus' : 'check')} /><span>{o.label}{off && <span className="vui-sr-only"> (not included)</span>}</span></li>; })}
                  </ul>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
