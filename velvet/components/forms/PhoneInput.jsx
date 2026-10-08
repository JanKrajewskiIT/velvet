import React from 'react';
import { Control } from '../primitives/Control.jsx';
import { FieldLabel, FieldHint } from '../primitives/Field.jsx';
import { Glyph } from '../primitives/Glyph.jsx';
import { cx } from '../primitives/cx.js';
export const PHONE_COUNTRIES = [
  { code: 'PL', name: 'Poland', dial: '48', mask: '### ### ###' },
  { code: 'DE', name: 'Germany', dial: '49', mask: '#### #######' },
  { code: 'GB', name: 'United Kingdom', dial: '44', mask: '#### ######' },
  { code: 'US', name: 'United States', dial: '1', mask: '(###) ###-####' },
  { code: 'FR', name: 'France', dial: '33', mask: '# ## ## ## ##' },
  { code: 'ES', name: 'Spain', dial: '34', mask: '### ### ###' },
  { code: 'IT', name: 'Italy', dial: '39', mask: '### ### ####' },
  { code: 'NL', name: 'Netherlands', dial: '31', mask: '# ########' },
  { code: 'CZ', name: 'Czechia', dial: '420', mask: '### ### ###' },
  { code: 'UA', name: 'Ukraine', dial: '380', mask: '## ### ## ##' },
  { code: 'SE', name: 'Sweden', dial: '46', mask: '## ### ## ##' },
];
const fmt = (digits, mask) => { let out = '', i = 0; for (const ch of mask) { if (i >= digits.length) break; if (ch === '#') out += digits[i++]; else out += ch; } return out + digits.slice(i); };
const need = (mask) => (mask.match(/#/g) || []).length;
export function PhoneInput({ label = 'Phone', hint, error, optional, countries = PHONE_COUNTRIES, defaultCountry = 'PL', country, onCountryChange, value, defaultValue = '', onValueChange, validateOnBlur = true, size = 'md', disabled, id, name, className, ...rest }) {
  const autoId = React.useId();
  const fid = id || autoId;
  const hintId = fid + '-hint';
  const listId = fid + '-list';
  const [cInner, setCInner] = React.useState(defaultCountry);
  const cc = country ?? cInner;
  const c = countries.find((x) => x.code === cc) || countries[0];
  const [inner, setInner] = React.useState(String(defaultValue).replace(/\D/g, ''));
  const digits = value !== undefined ? String(value).replace(/\D/g, '') : inner;
  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState(0);
  const [touched, setTouched] = React.useState(false);
  const wrap = React.useRef(null), btn = React.useRef(null), inp = React.useRef(null);
  const emit = (d, cn) => onValueChange && onValueChange(d ? '+' + cn.dial + d : '', { country: cn.code, national: d, valid: d.length === need(cn.mask) });
  const setDigits = (d) => { d = d.slice(0, need(c.mask) + 2); if (value === undefined) setInner(d); emit(d, c); };
  const pickCountry = (cn) => { if (country === undefined) setCInner(cn.code); onCountryChange && onCountryChange(cn.code); emit(digits, cn); setOpen(false); inp.current && inp.current.focus({ preventScroll: true }); };
  React.useEffect(() => { if (!open) return; const h = (e) => { if (wrap.current && !wrap.current.contains(e.target)) setOpen(false); }; document.addEventListener('mousedown', h); return () => document.removeEventListener('mousedown', h); }, [open]);
  const onKey = (e) => {
    if (!open) { if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActive(Math.max(0, countries.indexOf(c))); setOpen(true); } return; }
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => (a + 1) % countries.length); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => (a - 1 + countries.length) % countries.length); }
    else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pickCountry(countries[active]); }
    else if (e.key === 'Escape' || e.key === 'Tab') setOpen(false);
  };
  const autoErr = validateOnBlur && touched && digits && digits.length !== need(c.mask) ? 'Enter a valid ' + c.name + ' number (' + need(c.mask) + ' digits)' : undefined;
  const err = error || autoErr;
  return (
    <div className="vui-field">
      {label && <FieldLabel htmlFor={fid} optional={optional}>{label}</FieldLabel>}
      <div ref={wrap} className="vui-select vui-phone">
        <Control size={size} invalid={!!(err)} disabled={disabled} className={className}>
          <button ref={btn} type="button" className="vui-phone__country" disabled={disabled} aria-label={'Country: ' + c.name + ' +' + c.dial} aria-haspopup="listbox" aria-expanded={open} aria-controls={listId} onClick={() => { setActive(Math.max(0, countries.indexOf(c))); setOpen(!open); }} onKeyDown={onKey}>
            <span className="vui-phone__code">{c.code}</span><span className="vui-phone__dial">+{c.dial}</span><Glyph name="chevron-down" />
          </button>
          <input ref={inp} id={fid} type="tel" inputMode="tel" autoComplete="tel-national" className="vui-control__input" disabled={disabled} placeholder={c.mask.replace(/#/g, '0')} value={fmt(digits, c.mask)}
            aria-invalid={!!err || undefined} aria-describedby={err || hint ? hintId : undefined}
            onChange={(e) => setDigits(e.target.value.replace(/\D/g, ''))} onBlur={() => setTouched(true)} {...rest} />
        </Control>
        {name && <input type="hidden" name={name} value={digits ? '+' + c.dial + digits : ''} />}
        {open && (
          <ul id={listId} role="listbox" className="vui-select__menu">
            {countries.map((cn, i) => (
              <li key={cn.code} role="option" aria-selected={cn.code === c.code} className={cx('vui-select__option', i === active && 'vui-select__option--active')} onMouseEnter={() => setActive(i)} onMouseDown={(e) => e.preventDefault()} onClick={() => pickCountry(cn)}>
                <span className="vui-phone__code">{cn.code}</span><span className="vui-select__label">{cn.name}</span><span className="vui-phone__dial">+{cn.dial}</span>
                {cn.code === c.code && <Glyph name="check" />}
              </li>
            ))}
          </ul>
        )}
      </div>
      {(err || hint) && <FieldHint id={hintId} error={!!err}>{err || hint}</FieldHint>}
    </div>
  );
}
