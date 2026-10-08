import React from 'react';
import { Control } from '../primitives/Control.jsx';
import { Button } from '../actions/Button.jsx';
import { Glyph } from '../primitives/Glyph.jsx';
import { pad } from '../primitives/date.js';
import { CloseButton } from '../primitives/CloseButton.jsx';
import { Calendar, fmtDate, startOfDay } from './Calendar.jsx';
import { Field } from '../primitives/Field.jsx';
import { cx } from '../primitives/cx.js';
const roundNow = (step) => { const d = new Date(); const m = Math.ceil((d.getHours() * 60 + d.getMinutes()) / step) * step; return new Date(d.getFullYear(), d.getMonth(), d.getDate(), Math.floor(m / 60), m % 60); };
const fmtT = (mins, h12) => { const h = Math.floor(mins / 60), m = mins % 60; return h12 ? ((h + 11) % 12 + 1) + ':' + pad(m) + (h < 12 ? ' AM' : ' PM') : pad(h) + ':' + pad(m); };
export function DateTimePicker({ label, hint, error, optional, required, value, defaultValue = null, onChange: onChangeProp, onValueChange, placeholder = 'Select date and time', min, max, step = 30, hour12 = false, locale = 'en-US', weekStartsOn = 1, clearable = true, size = 'md', disabled, defaultOpen = false, align = 'start', id }) {
  const onChange = onChangeProp || onValueChange;
  const [inner, setInner] = React.useState(defaultValue);
  const cur = value !== undefined ? value : inner;
  const commit = (v) => { if (value === undefined) setInner(v); onChange && onChange(v); };
  const [open, setOpen] = React.useState(defaultOpen);
  const [draft, setDraft] = React.useState(cur);
  const wrap = React.useRef(null), list = React.useRef(null);
  const close = (refocus) => { setOpen(false); if (refocus) requestAnimationFrame(() => { const b = wrap.current && wrap.current.querySelector('.vui-datefield'); b && b.focus(); }); };
  React.useEffect(() => {
    if (!open) return; setDraft(cur || roundNow(step));
    const d = (e) => { if (wrap.current && !wrap.current.contains(e.target)) setOpen(false); };
    const k = (e) => { if (e.key === 'Escape') close(true); };
    document.addEventListener('mousedown', d); window.addEventListener('keydown', k);
    return () => { document.removeEventListener('mousedown', d); window.removeEventListener('keydown', k); };
  }, [open]);
  const dm = draft ? draft.getHours() * 60 + draft.getMinutes() : null;
  React.useEffect(() => { if (!open || !list.current) return; const el = list.current.querySelector('[aria-selected="true"]') || list.current.querySelector('[data-near="true"]'); if (el) list.current.scrollTop = el.offsetTop - list.current.clientHeight / 2 + el.offsetHeight / 2; }, [open, draft && startOfDay(draft).getTime()]);
  const slots = React.useMemo(() => { const r = []; for (let m = 0; m < 1440; m += step) r.push(m); return r; }, [step]);
  const off = (m) => { if (!draft) return false; const t = new Date(draft.getFullYear(), draft.getMonth(), draft.getDate(), Math.floor(m / 60), m % 60); return (min && t < min) || (max && t > max); };
  const setDay = (d) => { const b = draft || roundNow(step); setDraft(new Date(d.getFullYear(), d.getMonth(), d.getDate(), b.getHours(), b.getMinutes())); };
  const setTime = (m) => { const b = draft || startOfDay(new Date()); setDraft(new Date(b.getFullYear(), b.getMonth(), b.getDate(), Math.floor(m / 60), m % 60)); };
  const text = cur ? fmtDate(cur, locale) + ', ' + fmtT(cur.getHours() * 60 + cur.getMinutes(), hour12) : '';
  const valid = draft && !off(dm);
  return (
    <Field label={label} hint={hint} error={error} optional={optional} required={required} id={id}>
      {(ctl) => (
        <span ref={wrap} className="vui-popover-wrap vui-datepicker">
          <Control size={size} invalid={!!(ctl.invalid)} disabled={disabled}>
            <button id={ctl.id} type="button" className="vui-datefield" disabled={disabled} aria-haspopup="dialog" aria-expanded={open} aria-describedby={ctl.describedBy} onClick={() => setOpen(!open)}>
              <Glyph name="calendar" />
              <span className={cx('vui-datefield__text', !text && 'vui-datefield__text--empty')} style={{ fontVariantNumeric: 'tabular-nums' }}>{text || placeholder}</span>
            </button>
            {text && clearable && !disabled && <CloseButton variant="field" aria-label="Clear" onClick={() => commit(null)} />}
          </Control>
          {open && (
            <div className={cx('vui-popover', 'vui-datepop', 'vui-dtpop', align === 'end' && 'vui-popover--end')} role="dialog" aria-label="Choose date and time">
              <div className="vui-dtpop__body">
                <Calendar value={draft} onChange={setDay} min={min && startOfDay(min)} max={max} locale={locale} weekStartsOn={weekStartsOn} />
                <div className="vui-dtpop__times">
                  <div className="vui-dtpop__head"><Glyph name="clock" />Time</div>
                  <div ref={list} className="vui-dtpop__list" role="listbox" aria-label="Time">
                    {slots.map((m) => (
                      <button key={m} type="button" role="option" aria-selected={m === dm} data-near={dm != null && m <= dm && dm < m + step ? 'true' : undefined} disabled={off(m)} className={cx('vui-dtpop__slot', m === dm && 'vui-dtpop__slot--on')} onClick={() => setTime(m)}>{fmtT(m, hour12)}</button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="vui-datepop__foot vui-rangepop__foot">
                <span className="vui-rangepop__sum" style={{ fontVariantNumeric: 'tabular-nums' }}>{draft ? fmtDate(draft, locale, { weekday: 'short', month: 'short', day: 'numeric' }) + ' · ' + fmtT(dm, hour12) : ''}</span>
                <Button variant="ghost" size="sm" onClick={() =>setDraft(roundNow(step))}>Now</Button>
                <Button size="sm" disabled={!valid} onClick={() =>{ commit(draft); close(true); }}>Apply</Button>
              </div>
            </div>
          )}
        </span>
      )}
    </Field>
  );
}
