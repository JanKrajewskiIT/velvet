import { Show } from 'solid-js';

import { Input } from '../forms/Input';
import { Select } from '../forms/Select';
import type { OrderTicketController } from './createOrderTicket';
import styles from './OrderTicketFields.module.css';

export const OrderTicketFields = (props: { ticket: OrderTicketController }) => {
  const t = () => props.ticket;
  const timeInForce = () => (
    <Select
      size="sm"
      label={t().label('tif')}
      value={t().tif()}
      options={[
        { value: 'day', label: t().label('day') },
        { value: 'gtc', label: t().label('gtc') },
      ]}
      onValueChange={(value) => {
        if (value === 'day' || value === 'gtc') t().setTif(value);
      }}
    />
  );
  return (
    <>
      <div class={styles.grid}>
        <Input
          type="number"
          size="sm"
          label={t().label('qty')}
          required
          value={t().qty()}
          min={t().props.minQty ?? 0}
          step={t().step()}
          suffix={t().props.qtyUnit}
          onInput={(event) => t().setQty(event.currentTarget.value)}
        />
        <Show when={t().type() !== 'market'} fallback={timeInForce()}>
          <Input
            type="number"
            size="sm"
            required
            label={t().label(t().type() === 'limit' ? 'limitPrice' : 'stopPrice')}
            value={t().limit()}
            min={0}
            step={10 ** -t().digits()}
            suffix={t().currency()}
            onInput={(event) => t().setLimit(event.currentTarget.value)}
          />
        </Show>
        <Input
          type="text"
          inputmode="decimal"
          size="sm"
          optional
          label={t().label('sl')}
          value={t().sl()}
          suffix={t().currency()}
          aria-invalid={t().wrongSl() || undefined}
          onInput={(event) => t().setSl(event.currentTarget.value)}
        />
        <Input
          type="text"
          inputmode="decimal"
          size="sm"
          optional
          label={t().label('tp')}
          value={t().tp()}
          suffix={t().currency()}
          aria-invalid={t().wrongTp() || undefined}
          onInput={(event) => t().setTp(event.currentTarget.value)}
        />
      </div>
      <Show when={t().type() !== 'market'}>{timeInForce()}</Show>
    </>
  );
};
