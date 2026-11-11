import { Show } from 'solid-js';

import type { OrderTicketController } from './createOrderTicket';
import styles from './OrderTicketSummary.module.css';

export const OrderTicketSummary = (props: { ticket: OrderTicketController }) => {
  const t = () => props.ticket;
  return (
    <dl class={styles.summary}>
      <div>
        <dt>{t().label('notional')}</dt>
        <dd>
          {t().format(t().notional())} {t().currency()}
        </dd>
      </div>
      <div>
        <dt>{t().label('risk')}</dt>
        <dd>
          {t().format(t().risk())} {t().risk() == null ? '' : t().currency()}
          <Show when={t().riskPct() != null && !t().props.hidden}>
            <span class={styles.muted}>
              {' '}
              · {t().ratio(t().riskPct())}% {t().label('ofEquity')}
            </span>
          </Show>
        </dd>
      </div>
      <div>
        <dt>{t().label('rr')}</dt>
        <dd>
          {t().ratio(t().rr())}
          {t().rr() == null || t().props.hidden ? '' : ' : 1'}
        </dd>
      </div>
      <Show when={t().props.buyingPower != null}>
        <div>
          <dt>{t().label('power')}</dt>
          <dd>
            {t().format(t().notional() == null ? null : (t().props.buyingPower ?? 0) - (t().notional() ?? 0))}{' '}
            {t().currency()}
          </dd>
        </div>
      </Show>
    </dl>
  );
};
