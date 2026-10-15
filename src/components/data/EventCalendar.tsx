import { useI18n } from '@jankrajewskiit/i18n';
import { createMemo, For, type JSX, mergeProps, Show } from 'solid-js';

import { createControllable } from '../../hooks/createControllable';
import { useTranslate } from '../../i18n/useTranslate';
import { variantClass } from '../../utils/cssModule';
import { cx } from '../../utils/cx';
import { fmtDate, sameDay, toDate } from '../../utils/date';
import { Calendar } from '../forms/Calendar';
import { Dot } from '../primitives/Dot';
import { EmptyText } from '../primitives/EmptyText';
import { Text } from '../primitives/Text';
import styles from './EventCalendar.module.css';

const EVCAL_PART_EV_CLASSES = {
  success: styles.evcalPartEvVariantSuccess,
  warning: styles.evcalPartEvVariantWarning,
  danger: styles.evcalPartEvVariantDanger,
  info: styles.evcalPartEvVariantInfo,
} as const;

export interface CalendarEvent {
  id?: string | number;
  /** Date or 'YYYY-MM-DD'. */
  date: Date | string;
  title: JSX.Element;
  /** 'HH:mm' — also the sort key. Omit for all-day. */
  time?: string;
  description?: JSX.Element;
  /** @default 'brand' */
  tone?: 'brand' | 'success' | 'warning' | 'danger' | 'info';
}

export interface EventCalendarProps {
  events: CalendarEvent[];
  value?: Date;
  /** @default today */
  defaultValue?: Date;
  onValueChange?: (date: Date) => void;
  /** @default the active i18n locale */
  locale?: string;
  /** 0 = Sunday, 1 = Monday. @default 1 */
  weekStartsOn?: 0 | 1;
  /** Shown when the selected day has no events. @default localized "No events this day." */
  emptyText?: string;
  /** stacked = agenda under the grid, as wide as the grid · split = agenda to the right (≤300px), stacks under 640px. @default 'stacked' */
  layout?: 'stacked' | 'split';
  class?: string;
}

const AGENDA_DATE_FORMAT: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'long', day: 'numeric' };

/** Compact month grid (days with events get a dot) + agenda for the selected day. Built on Calendar. */
export const EventCalendar = (props: EventCalendarProps) => {
  const merged = mergeProps({ weekStartsOn: 1, layout: 'stacked' } satisfies Partial<EventCalendarProps>, props);
  const translate = useTranslate();
  const i18n = useI18n();
  const locale = () => merged.locale ?? i18n.locale();
  const emptyText = () => merged.emptyText ?? translate('velvet.data.eventCalendar.emptyText');
  const [selected, setSelected] = createControllable<Date>({
    value: () => props.value,
    defaultValue: props.defaultValue ?? new Date(),
    onChange: (next) => props.onValueChange?.(next),
  });
  const dated = createMemo(() => merged.events.map((event) => ({ event, day: toDate(event.date) })));
  const agenda = createMemo(() =>
    dated()
      .filter(({ day }) => sameDay(day, selected()))
      .map(({ event }) => event)
      .sort((a, b) => (a.time ?? '').localeCompare(b.time ?? '')),
  );
  const select = (next: unknown) => {
    if (next instanceof Date) setSelected(next);
  };

  return (
    <div class={cx(styles.evcal, merged.layout === 'split' && styles.evcalVariantSplit, merged.class)}>
      <Calendar
        value={selected()}
        onValueChange={select}
        marks={(day: Date) => dated().some((entry) => sameDay(entry.day, day))}
        weekStartsOn={merged.weekStartsOn}
        locale={locale()}
      />
      <div class={styles.evcalPartAgenda} aria-live="polite">
        <Text as="div" variant="title" tone="inherit" class={'vui-evcal__date'}>
          {fmtDate(selected(), locale(), AGENDA_DATE_FORMAT)}
        </Text>
        <Show
          when={agenda().length}
          fallback={
            <EmptyText align="start" class={styles.evcalPartEmpty}>
              {emptyText()}
            </EmptyText>
          }
        >
          <ul class={styles.evcalPartList}>
            <For each={agenda()}>
              {(event) => (
                <li class={cx(styles.evcalPartEv, variantClass(EVCAL_PART_EV_CLASSES, event.tone ?? 'brand'))}>
                  <Text as="span" variant="label-sm" mono tone="tertiary" tabular class="vui-evcal__time">
                    {event.time || translate('velvet.data.eventCalendar.allDay')}
                  </Text>
                  <Dot size="lg" class={styles.evcalPartDot} />
                  <span class={styles.evcalPartBody}>
                    <Text as="span" variant="body-sm" tone="primary" class="vui-evcal__title">
                      {event.title}
                    </Text>
                    <Show when={event.description}>
                      {(description) => (
                        <Text as="span" variant="caption" tone="secondary" class="vui-evcal__desc">
                          {description()}
                        </Text>
                      )}
                    </Show>
                  </span>
                </li>
              )}
            </For>
          </ul>
        </Show>
      </div>
    </div>
  );
};
