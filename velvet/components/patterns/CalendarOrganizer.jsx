import React from 'react';
import { EmptyText } from '../primitives/EmptyText.jsx';
import { Control } from '../primitives/Control.jsx';
import { IconButton } from '../actions/IconButton.jsx';
import { Button } from '../actions/Button.jsx';
import { Glyph } from '../primitives/Glyph.jsx';
import { sameDay, addDays, fmtDate, startOfDay } from '../forms/Calendar.jsx';
import { cx } from '../primitives/cx.js';
import { weekdayNames } from '../primitives/date.js';
import { Weekday } from '../primitives/Weekday.jsx';
const key = (d) => d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
export function CalendarOrganizer({ events = [], onEventsChange, onEventClick, defaultMonth, weekStartsOn = 1, locale = 'en-US', maxChips = 2, className }) {
  const today = startOfDay(new Date());
  const [view, setView] = React.useState(() => { const d = defaultMonth || today; return new Date(d.getFullYear(), d.getMonth(), 1); });
  const [sel, setSel] = React.useState(today);
  const [title, setTitle] = React.useState('');
  const [time, setTime] = React.useState('');
  const grid = React.useRef(null);
  const kb = React.useRef(false);
  const by = React.useMemo(() => { const m = {}; events.forEach((e) => { const d = new Date(e.date); (m[key(d)] = m[key(d)] || []).push(e); }); Object.values(m).forEach((l) => l.sort((a, b) => String(a.time || '99').localeCompare(String(b.time || '99')))); return m; }, [events]);
  const off = (view.getDay() - weekStartsOn + 7) % 7;
  const start = addDays(view, -off);
  const weeks = Math.ceil((off + new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate()) / 7);
  const days = Array.from({ length: weeks * 7 }, (_, i) => addDays(start, i));
  const wd = weekdayNames(locale, weekStartsOn);
  const monthCount = events.filter((e) => { const d = new Date(e.date); return d.getMonth() === view.getMonth() && d.getFullYear() === view.getFullYear(); }).length;
  const selList = by[key(sel)] || [];
  React.useEffect(() => { if (!kb.current) return; kb.current = false; const b = grid.current && grid.current.querySelector('[data-k="' + key(sel) + '"]'); b && b.focus(); }, [sel]);
  const pick = (d) => { setSel(d); if (d.getMonth() !== view.getMonth()) setView(new Date(d.getFullYear(), d.getMonth(), 1)); };
  const onKey = (e) => { const m = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }[e.key]; if (m == null) return; e.preventDefault(); kb.current = true; pick(addDays(sel, m)); };
  const add = () => { const t = title.trim(); if (!t) return; onEventsChange && onEventsChange([...events, { id: 'e' + Date.now(), date: sel, title: t, time: time || undefined, color: 'var(--dv-' + (((events.length) % 7) + 1) + ')' }]); setTitle(''); setTime(''); };
  return (
    <div className={cx('vui-organizer', className)}>
      <div className="vui-organizer__main">
        <div className="vui-organizer__head">
          <div><div className="vui-organizer__month">{fmtDate(view, locale, { month: 'long', year: 'numeric' })}</div><div className="vui-organizer__sub">{monthCount} event{monthCount === 1 ? '' : 's'} this month</div></div>
          <div className="vui-organizer__nav">
            <Button variant="secondary" size="sm" onClick={() =>{ setView(new Date(today.getFullYear(), today.getMonth(), 1)); setSel(today); }}>Today</Button>
            <IconButton icon="chevron-left" label="Previous month" size="sm" onClick={() => setView(new Date(view.getFullYear(), view.getMonth() - 1, 1))} />
            <IconButton icon="chevron-right" label="Next month" size="sm" onClick={() => setView(new Date(view.getFullYear(), view.getMonth() + 1, 1))} />
          </div>
        </div>
        <div className="vui-organizer__wd" aria-hidden="true">{wd.map((w) => <Weekday key={w}>{w}</Weekday>)}</div>
        <div ref={grid} role="grid" aria-label={fmtDate(view, locale, { month: 'long', year: 'numeric' })} className="vui-organizer__grid" onKeyDown={onKey}>
          {days.map((d) => {
            const list = by[key(d)] || []; const out = d.getMonth() !== view.getMonth(); const on = sameDay(d, sel);
            return (
              <button key={key(d)} data-k={key(d)} type="button" role="gridcell" tabIndex={on ? 0 : -1} aria-selected={on} aria-label={fmtDate(d, locale, { weekday: 'long', month: 'long', day: 'numeric' }) + (list.length ? ', ' + list.length + ' events' : '')}
                className={cx('vui-organizer__day', out && 'vui-organizer__day--out', on && 'vui-organizer__day--sel', sameDay(d, today) && 'vui-organizer__day--today')} onClick={() => pick(d)}>
                <span className="vui-organizer__num">{d.getDate()}</span>
                <span className="vui-organizer__chips">
                  {list.slice(0, maxChips).map((e) => <span key={e.id} className="vui-organizer__chip" style={{ '--ec': e.color || 'var(--dv-1)' }}>{e.time && <b>{e.time}</b>}{e.title}</span>)}
                  {list.length > maxChips && <span className="vui-organizer__more">+{list.length - maxChips} more</span>}
                </span>
              </button>
            );
          })}
        </div>
      </div>
      <aside className="vui-organizer__panel" aria-live="polite">
        <div className="vui-organizer__pday">{fmtDate(sel, locale, { weekday: 'long' })}</div>
        <div className="vui-organizer__pdate">{fmtDate(sel, locale, { month: 'long', day: 'numeric' })}</div>
        {selList.length ? (
          <ul className="vui-organizer__list">
            {selList.map((e) => (
              <li key={e.id} className="vui-organizer__ev" style={{ '--ec': e.color || 'var(--dv-1)' }}>
                <button type="button" className="vui-organizer__evb" onClick={() => onEventClick && onEventClick(e)}><span className="vui-organizer__evt">{e.title}</span><span className="vui-organizer__evm">{e.time || 'All day'}{e.location ? ' · ' + e.location : ''}</span></button>
                {onEventsChange && <IconButton icon="trash-2" label={'Delete ' + e.title} size="sm" onClick={() => onEventsChange(events.filter((x) => x.id !== e.id))} />}
              </li>
            ))}
          </ul>
        ) : (
          <EmptyText icon="sun" className="vui-organizer__empty"><b>Nothing scheduled</b><span>Enjoy the free day.</span></EmptyText>
        )}
        {onEventsChange && (
          <div className="vui-organizer__add">
            <Control size="sm"><input className="vui-control__input" placeholder="New event" value={title} onChange={(e) => setTitle(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && add()} aria-label="New event title" /></Control>
            <div className="vui-organizer__addrow"><Control size="sm" style={{ width: 96 }}><input className="vui-control__input" placeholder="09:30" value={time} onChange={(e) => setTime(e.target.value)} aria-label="Time" /></Control><Button size="sm" iconLeft="plus" style={{ flex: 1 }} disabled={!title.trim()} onClick={add}>Add</Button></div>
          </div>
        )}
      </aside>
    </div>
  );
}
