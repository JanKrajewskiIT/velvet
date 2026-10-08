import React from 'react';
import { EmptyText } from '../primitives/EmptyText.jsx';
import { Dot } from '../primitives/Dot.jsx';
import { Calendar, sameDay, fmtDate } from '../forms/Calendar.jsx';
import { cx } from '../primitives/cx.js';
import { toDate } from '../primitives/date.js';
export function EventCalendar({ events = [], value, defaultValue, onValueChange, locale = 'en-US', weekStartsOn = 1, emptyText = 'No events this day.', layout = 'stacked', className }) {
  const [inner, setInner] = React.useState(defaultValue || new Date());
  const sel = value !== undefined ? value : inner;
  const evs = React.useMemo(() => events.map((e) => ({ ...e, _d: toDate(e.date) })), [events]);
  const day = evs.filter((e) => sameDay(e._d, sel)).sort((a, b) => String(a.time || '').localeCompare(String(b.time || '')));
  const set = (d) => { if (!d) return; if (value === undefined) setInner(d); onValueChange && onValueChange(d); };
  return (
    <div className={cx('vui-evcal', layout === 'split' && 'vui-evcal--split', className)}>
      <Calendar value={sel} onChange={set} marks={(d) => evs.some((e) => sameDay(e._d, d))} weekStartsOn={weekStartsOn} locale={locale} />
      <div className="vui-evcal__agenda" aria-live="polite">
        <div className="vui-evcal__date">{fmtDate(sel, locale, { weekday: 'long', month: 'long', day: 'numeric' })}</div>
        {day.length ? (
          <ul className="vui-evcal__list">
            {day.map((e, i) => (
              <li key={e.id ?? i} className={cx('vui-evcal__ev', 'vui-evcal__ev--' + (e.tone || 'brand'))}>
                <span className="vui-evcal__time">{e.time || 'All day'}</span>
                <Dot size="lg" className="vui-evcal__dot" />
                <span className="vui-evcal__body"><span className="vui-evcal__title">{e.title}</span>{e.description && <span className="vui-evcal__desc">{e.description}</span>}</span>
              </li>
            ))}
          </ul>
        ) : <EmptyText align="start" className="vui-evcal__empty">{emptyText}</EmptyText>}
      </div>
    </div>
  );
}
