import { For, Show } from 'solid-js';

import { cx } from '../../utils/cx';
import { Button } from '../actions/Button';
import { Card } from '../display/Card';
import { Alert } from '../feedback/Alert';
import { ConfirmDialog } from '../feedback/ConfirmDialog';
import { OptionSwitcher } from '../forms/OptionSwitcher';
import { Badge } from '../primitives/Badge';
import { Glyph } from '../primitives/Glyph';
import { Text } from '../primitives/Text';
import { createOrderTicket } from './createOrderTicket';
import styles from './OrderTicket.module.css';
import { OrderTicketFields } from './OrderTicketFields';
import { OrderTicketSummary } from './OrderTicketSummary';
import type { OrderTicketProps } from './orderTicketTypes';

export const OrderTicket = (props: OrderTicketProps) => {
  const t = createOrderTicket(props);
  return (
    <Card
      class={cx(styles.ticket, props.class)}
      data-side={t.side()}
      title={t.label('title')}
      description={[props.symbol, props.account].filter(Boolean).join(' · ')}
      padding="md"
      actions={
        <Show when={props.envLabel}>
          <Badge size="sm" tone={props.envTone ?? 'info'} variant={props.envTone === 'danger' ? 'solid' : 'soft'}>
            {props.envLabel}
          </Badge>
        </Show>
      }
    >
      <div class={styles.body}>
        <div class={styles.sides} role="radiogroup" aria-label={t.label('side')}>
          <For each={['buy', 'sell'] as const}>
            {(side) => (
              <button
                type="button"
                role="radio"
                aria-checked={t.side() === side}
                tabIndex={t.side() === side ? 0 : -1}
                class={styles.side}
                data-side={side}
                onClick={() => t.setSide(side)}
                onKeyDown={(event) => {
                  if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) return;
                  event.preventDefault();
                  const next =
                    event.key === 'Home' ? 'buy' : event.key === 'End' ? 'sell' : side === 'buy' ? 'sell' : 'buy';
                  t.setSide(next);
                  event.currentTarget.parentElement?.querySelector<HTMLButtonElement>(`[data-side="${next}"]`)?.focus();
                }}
              >
                {t.label(side)}
                <span class={styles.sidePrice}>{t.format(t.price())}</span>
              </button>
            )}
          </For>
        </div>
        <OptionSwitcher
          size="sm"
          value={t.type()}
          onValueChange={t.chooseType}
          label={t.label('type')}
          options={(['market', 'limit', 'stop'] as const).map((value) => ({ value, label: t.label(value) }))}
          class={styles.types}
        />
        <OrderTicketFields ticket={t} />
        <OrderTicketSummary ticket={t} />
        <Show when={t.issues().length}>
          <ul class={styles.issues}>
            <For each={t.issues()}>
              {(issue) => (
                <li class={styles.issue} data-tone={issue.tone}>
                  <Glyph name={issue.tone === 'danger' ? 'triangle-alert' : 'info'} class={styles.issueIcon} />
                  <span>{issue.text}</span>
                </li>
              )}
            </For>
          </ul>
        </Show>
        <Show when={t.blockText()}>
          {(reason) => (
            <Alert tone="danger" icon="lock">
              {reason()}
            </Alert>
          )}
        </Show>
        <Button
          block
          variant="primary"
          iconLeft={t.side() === 'buy' ? 'arrow-up' : 'arrow-down'}
          disabled={!t.can()}
          onClick={t.ask}
        >
          {t.label('review')} · {t.what()}
        </Button>
        <Text as="p" variant="body" tone="tertiary" class={styles.note}>
          {t.label('estimate')}
        </Text>
      </div>
      <ConfirmDialog
        open={!!t.review()}
        tone={props.confirmTone}
        title={t.label('confirmTitle')}
        description={t.review()?.summary}
        confirmLabel={t.label('send')}
        cancelLabel={t.label('cancel')}
        onConfirm={t.confirm}
        onCancel={t.cancel}
      />
    </Card>
  );
};
