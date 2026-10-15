import { createMemo, Index, Show } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { addMonths, fmtDate, sameDay } from '../../utils/date';
import { IconButton } from '../actions/IconButton';
import { Text } from '../primitives/Text';
import { typographyClass } from '../primitives/typography';
import { Weekday } from '../primitives/Weekday';
import { monthGrid } from './calendarGrid';
import styles from './CalendarMonth.module.css';
import type { CalendarController } from './createCalendar';

export interface CalendarMonthProps {
  calendar: CalendarController;
  index: number;
}

const MONTH_TITLE: Intl.DateTimeFormatOptions = { month: 'long', year: 'numeric' };

export const CalendarMonth = (props: CalendarMonthProps) => {
  const translate = useTranslate();
  const calendar = () => props.calendar;
  const first = createMemo(() => addMonths(calendar().view(), props.index));
  const days = createMemo(() => monthGrid(first(), calendar().config.weekStartsOn));
  const title = () => fmtDate(first(), calendar().locale(), MONTH_TITLE);

  return (
    <div class={styles.calPartMonth}>
      <div class={styles.calPartHead}>
        <Show when={props.index === 0} fallback={<span class={styles.calPartNavSp} />}>
          <IconButton
            size="sm"
            icon="chevron-left"
            label={translate('velvet.forms.calendar.previousMonth')}
            class="vui-cal__nav"
            onClick={() => calendar().setView(addMonths(calendar().view(), -1))}
          />
        </Show>
        <Text as="span" variant="title" tone="inherit" class="vui-cal__title" aria-live="polite">
          {title()}
        </Text>
        <Show when={props.index === calendar().months() - 1} fallback={<span class={styles.calPartNavSp} />}>
          <IconButton
            size="sm"
            icon="chevron-right"
            label={translate('velvet.forms.calendar.nextMonth')}
            class="vui-cal__nav"
            onClick={() => calendar().setView(addMonths(calendar().view(), 1))}
          />
        </Show>
      </div>
      <div role="grid" class={styles.calPartGrid} aria-label={title()}>
        <Index each={calendar().weekdays()}>
          {(name) => (
            <Weekday class={styles.calPartWd} role="columnheader">
              {name()}
            </Weekday>
          )}
        </Index>
        <Index each={days()}>
          {(day) => {
            const outside = () => day().getMonth() !== first().getMonth();
            const isToday = () => sameDay(day(), calendar().today());
            const isStart = () => sameDay(day(), calendar().rangeStart());
            const isEnd = () => sameDay(day(), calendar().rangeEnd());
            const selected = () => (calendar().isRange() ? isStart() || isEnd() : sameDay(day(), calendar().anchor()));
            const inRange = () => {
              const start = calendar().rangeStart();
              const end = calendar().rangeEnd();
              return !!start && !!end && day() > start && day() < end;
            };
            const tabStop = () =>
              calendar().focusVisible() ? sameDay(day(), calendar().focus()) : !outside() && day().getDate() === 1;
            return (
              <Show when={!(outside() && calendar().months() > 1)} fallback={<span />}>
                <button
                  type="button"
                  role="gridcell"
                  data-vui-calendar-day
                  data-day={day().toDateString()}
                  tabIndex={tabStop() ? 0 : -1}
                  disabled={calendar().isOff(day())}
                  aria-selected={selected() || inRange() || undefined}
                  aria-current={isToday() ? 'date' : undefined}
                  aria-label={calendar().dayLabel().format(day())}
                  class={cx(
                    typographyClass('body-sm'),
                    styles.calPartDay,
                    outside() && styles.calPartDayVariantOut,
                    isToday() && styles.calPartDayVariantToday,
                    selected() && styles.calPartDayVariantSel,
                    inRange() && styles.calPartDayVariantIn,
                    isStart() && !!calendar().rangeEnd() && styles.calPartDayVariantStart,
                    isEnd() && !!calendar().rangeStart() && styles.calPartDayVariantEnd,
                  )}
                  onClick={() => calendar().pick(day())}
                  onMouseEnter={() => calendar().isRange() && calendar().setHover(day())}
                  onFocus={() => calendar().setFocus(day())}
                >
                  <Text as="span" variant={selected() || isToday() ? 'label' : 'body-sm'} tone="inherit">
                    {day().getDate()}
                  </Text>
                  <Show when={calendar().isMarked(day())}>
                    <i class={styles.calPartMark} aria-hidden="true" />
                  </Show>
                </button>
              </Show>
            );
          }}
        </Index>
      </div>
    </div>
  );
};
