import { For, mergeProps } from 'solid-js';

import { cx } from '../../utils/cx';
import { addDays, addMonths, fmtDate, sameDay, startOfDay } from '../../utils/date';
import { CalendarMonth } from './CalendarMonth';
import type { CalendarConfig, CalendarModelProps, CalendarProps } from './calendarTypes';
import { createCalendar } from './createCalendar';

export { addDays, addMonths, fmtDate, sameDay, startOfDay };
export type { CalendarProps, CalendarRangeProps, CalendarSingleProps, CalendarValue, DateRange } from './calendarTypes';

/** Month grid. single or range (hover previews the range). Keyboard: arrows = day/week, PageUp/Down = month (Shift = year), Home/End = week edges, Enter selects. */
export const Calendar = (props: CalendarProps) => {
  const p: CalendarConfig = mergeProps({ months: 1, weekStartsOn: 1 }, props as CalendarModelProps);
  const calendar = createCalendar(p);

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions -- keyboard events bubble from the focusable day buttons; mouseleave only clears the range hover preview
    <div
      ref={calendar.setRoot}
      class={cx('vui-cal', calendar.months() > 1 && 'vui-cal--multi', p.class)}
      onKeyDown={calendar.onKeyDown}
      onMouseLeave={() => calendar.setHover(null)}
    >
      <For each={calendar.monthOffsets()}>{(index) => <CalendarMonth calendar={calendar} index={index} />}</For>
    </div>
  );
};
