import React from 'react';
import { IconButton } from '../actions/IconButton.jsx';
import { Button } from '../actions/Button.jsx';
import { Glyph } from '../primitives/Glyph.jsx';
import { cx } from '../primitives/cx.js';
import { Weekday } from '../primitives/Weekday.jsx';
import { DAY_MS as DAY, startOfDay as sod, addDays as addD, sameDay as same, minutesOfDay as mins, pad } from '../primitives/date.js';
const fmtT = (d, h12) => (h12 ? ((d.getHours() + 11) % 12 + 1) + (d.getMinutes() ? ':' + pad(d.getMinutes()) : '') + (d.getHours() < 12 ? 'am' : 'pm') : pad(d.getHours()) + ':' + pad(d.getMinutes()));
function layout(evts) {
  const s = [...evts].sort((a, b) => a.start - b.start || b.end - a.end); const out = []; let cluster = [], end = -1;
  const flush = () => { const lanes = []; cluster.forEach((e) => { let l = lanes.findIndex((x) => x <= e.start); if (l < 0) { l = lanes.length; lanes.push(0); } lanes[l] = e.end; out.push({ e, lane: l }); }); out.slice(out.length - cluster.length).forEach((o) => (o.lanes = lanes.length)); cluster = []; };
  s.forEach((e) => { if (e.start >= end && cluster.length) flush(); cluster.push(e); end = Math.max(end, +e.end); }); if (cluster.length) flush();
  return out;
}
export function Scheduler({ events = [], view, defaultView = 'week', onViewChange, date, defaultDate, onDateChange, startHour = 8, endHour = 19, scrollToHour, slotMinutes = 30, hourHeight = 52, weekStartsOn = 1, hideWeekends = false, hour12 = false, locale = 'en-US', onEventClick, onSlotClick, maxHeight = 520, className }) {
  const [iv, setIv] = React.useState(defaultView); const v = view !== undefined ? view : iv;
  const frameRef = React.useRef(null);
  React.useEffect(() => { if (scrollToHour != null && frameRef.current) frameRef.current.scrollTop = Math.max(0, (scrollToHour - startHour) * hourHeight); }, [scrollToHour, startHour, hourHeight, v]);
  const setV = (x) => { if (view === undefined) setIv(x); onViewChange && onViewChange(x); };
  const [idt, setIdt] = React.useState(() => sod(defaultDate || new Date())); const d = date !== undefined ? sod(date) : idt;
  const setD = (x) => { if (date === undefined) setIdt(x); onDateChange && onDateChange(x); };
  const [now, setNow] = React.useState(new Date());
  React.useEffect(() => { const t = setInterval(() => setNow(new Date()), 60000); return () => clearInterval(t); }, []);
  const ws = addD(d, -((d.getDay() - weekStartsOn + 7) % 7));
  const days = v === 'day' ? [d] : Array.from({ length: 7 }, (_, i) => addD(ws, i)).filter((x) => !hideWeekends || (x.getDay() !== 0 && x.getDay() !== 6));
  const step = v === 'day' ? 1 : 7;
  const H = endHour - startHour; const px = hourHeight / 60;
  const range = v === 'day' ? d.toLocaleDateString(locale, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
    : days[0].toLocaleDateString(locale, { month: 'short', day: 'numeric' }) + ' – ' + days[days.length - 1].toLocaleDateString(locale, { month: days[0].getMonth() === days[days.length - 1].getMonth() ? undefined : 'short', day: 'numeric', year: 'numeric' });
  const slotClick = (day, e) => {
    if (!onSlotClick || e.target.closest('.vui-sched__evt')) return;
    const r = e.currentTarget.getBoundingClientRect(); const m = Math.floor((e.clientY - r.top) / px / slotMinutes) * slotMinutes + startHour * 60;
    const s = new Date(day.getFullYear(), day.getMonth(), day.getDate(), Math.floor(m / 60), m % 60); onSlotClick(s, new Date(+s + slotMinutes * 60000));
  };
  return (
    <div className={cx('vui-sched', className)}>
      <div className="vui-sched__bar">
        <Button variant="secondary" size="sm" onClick={() =>setD(sod(new Date()))}>Today</Button>
        <div className="vui-btngroup vui-btngroup--attached" role="group" aria-label="Navigate">
          <IconButton icon="chevron-left" label={v === 'day' ? 'Previous day' : 'Previous week'} variant="secondary" size="sm" onClick={() => setD(addD(d, -step))} />
          <IconButton icon="chevron-right" label={v === 'day' ? 'Next day' : 'Next week'} variant="secondary" size="sm" onClick={() => setD(addD(d, step))} />
        </div>
        <h3 className="vui-sched__range" aria-live="polite">{range}</h3>
        <div className="vui-btngroup vui-btngroup--attached" role="group" aria-label="View">
          {['day', 'week'].map((x) => <Button variant="secondary" size="sm" key={x} aria-pressed={v === x} onClick={() =>setV(x)}>{x === 'day' ? 'Day' : 'Week'}</Button>)}
        </div>
      </div>
      <div ref={frameRef} className="vui-sched__frame" style={{ maxHeight }} tabIndex={0} aria-label="Schedule">
        <div className="vui-sched__grid" style={{ gridTemplateColumns: '56px repeat(' + days.length + ', minmax(' + (v === 'day' ? 200 : 96) + 'px, 1fr))' }}>
          <div className="vui-sched__corner" />
          {days.map((day) => (
            <div key={+day} className={cx('vui-sched__dayhead', same(day, now) && 'vui-sched__dayhead--today')}>
              <Weekday today={same(day, now)} className="vui-sched__wd">{day.toLocaleDateString(locale, { weekday: 'short' })}</Weekday>
              <span className="vui-sched__dn">{day.getDate()}</span>
            </div>
          ))}
          <div className="vui-sched__gutter" style={{ height: H * hourHeight }}>
            {Array.from({ length: H }, (_, i) => <span key={i} className="vui-sched__hour" style={{ top: i * hourHeight }}>{i === 0 ? '' : fmtT(new Date(2000, 0, 1, startHour + i), hour12)}</span>)}
          </div>
          {days.map((day) => {
            const evs = events.filter((e) => same(e.start, day));
            const isToday = same(day, now); const nm = mins(now) - startHour * 60;
            return (
              <div key={+day} className={cx('vui-sched__col', (day.getDay() === 0 || day.getDay() === 6) && 'vui-sched__col--weekend', onSlotClick && 'vui-sched__col--click')} style={{ height: H * hourHeight, backgroundSize: '100% ' + hourHeight + 'px' }} onClick={(e) => slotClick(day, e)} {...(onSlotClick ? { role: 'button', tabIndex: 0, 'aria-label': 'Add event on ' + day.toLocaleDateString(locale, { weekday: 'long', month: 'long', day: 'numeric' }), onKeyDown: (e) => { if (e.target !== e.currentTarget || (e.key !== 'Enter' && e.key !== ' ')) return; e.preventDefault(); const h = same(day, now) ? Math.min(endHour - 1, Math.max(startHour, now.getHours() + 1)) : Math.max(startHour, 9); const st = new Date(day.getFullYear(), day.getMonth(), day.getDate(), h, 0); onSlotClick(st, new Date(+st + slotMinutes * 60000)); } } : {})}>
                {layout(evs).map(({ e, lane, lanes }) => {
                  const top = Math.max(0, (mins(e.start) - startHour * 60) * px); const h = Math.max(20, (Math.min(mins(e.end) || 1440, endHour * 60) - Math.max(mins(e.start), startHour * 60)) * px - 2);
                  const short = h < 40;
                  const El = onEventClick ? 'button' : 'div';
                  return (
                    <El key={e.id} type={onEventClick ? 'button' : undefined} data-tone={e.tone || 'brand'} className={cx('vui-sched__evt', short && 'vui-sched__evt--short')} style={{ top, height: h, left: 'calc(' + (lane / lanes) * 100 + '% + 2px)', width: 'calc(' + 100 / lanes + '% - 4px)' }} onClick={onEventClick ? () => onEventClick(e) : undefined}
                      aria-label={e.title + ', ' + fmtT(e.start, hour12) + ' to ' + fmtT(e.end, hour12)}>
                      <span className="vui-sched__et">{e.title}</span>
                      <span className="vui-sched__em">{fmtT(e.start, hour12) + ' – ' + fmtT(e.end, hour12)}{e.meta && !short ? ' · ' + e.meta : ''}</span>
                    </El>
                  );
                })}
                {isToday && nm >= 0 && nm <= H * 60 && <span className="vui-sched__now" style={{ top: nm * px }} aria-hidden="true" />}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
