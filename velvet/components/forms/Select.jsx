import React from 'react';
import { FieldLabel, FieldHint } from '../primitives/Field.jsx';
import { Chevron } from '../primitives/Chevron.jsx';
import { Glyph, renderIcon } from '../primitives/Glyph.jsx';
import { cx } from '../primitives/cx.js';
const norm = (o) => (typeof o === 'string' ? { value: o, label: o } : o);

export function Select({ label, hint, error, optional, options = [], placeholder = 'Select…', iconLeft, size = 'md', disabled, id, name, value, defaultValue, onChange, onValueChange, className, 'aria-label': ariaLabel }) {
  const autoId = React.useId();
  const fid = id || autoId;
  const listId = fid + '-list';
  const hintId = fid + '-hint';
  const typed = React.useRef({ s: '', t: 0 });
  const opts = options.map(norm);
  const [inner, setInner] = React.useState(defaultValue ?? '');
  const cur = value !== undefined ? value : inner;
  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState(-1);
  const [up, setUp] = React.useState(false);
  const wrap = React.useRef(null);
  const btn = React.useRef(null);
  const selected = opts.find((o) => o.value === cur);

  const openList = () => {
    if (disabled) return;
    const r = btn.current.getBoundingClientRect();
    setUp(window.innerHeight - r.bottom < 260 && r.top > window.innerHeight - r.bottom);
    setActive(Math.max(0, opts.findIndex((o) => o.value === cur)));
    setOpen(true);
  };
  const pick = (o) => {
    if (!o || o.disabled) return;
    if (value === undefined) setInner(o.value);
    onValueChange && onValueChange(o.value);
    onChange && onChange({ target: { value: o.value, name } });
    setOpen(false);
    btn.current && btn.current.focus();
  };
  const move = (dir) => {
    if (!opts.length) return;
    let i = active;
    for (let n = 0; n < opts.length; n++) { i = (i + dir + opts.length) % opts.length; if (!opts[i].disabled) break; }
    setActive(i);
  };
  const onKey = (e) => {
    if (!open) { if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) { e.preventDefault(); openList(); } return; }
    if (e.key === 'ArrowDown') { e.preventDefault(); move(1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); move(-1); }
    else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(opts[active]); }
    else if (e.key === 'Home' || e.key === 'End') { e.preventDefault(); const list = opts.map((o, i) => (o.disabled ? -1 : i)).filter((i) => i >= 0); setActive(e.key === 'Home' ? list[0] : list[list.length - 1]); }
    else if (e.key === 'Escape' || e.key === 'Tab') setOpen(false);
    else if (e.key.length === 1 && !e.metaKey && !e.ctrlKey) {
      const now = Date.now(); const t = typed.current;
      t.s = (now - t.t > 600 ? '' : t.s) + e.key.toLowerCase(); t.t = now;
      const i = opts.findIndex((o) => !o.disabled && String(o.label).toLowerCase().startsWith(t.s));
      if (i >= 0) setActive(i);
    }
  };
  React.useEffect(() => {
    if (!open || active < 0) return;
    const el = document.getElementById(listId + '-' + active);
    const ul = el && el.parentElement;
    if (ul && (el.offsetTop < ul.scrollTop || el.offsetTop + el.offsetHeight > ul.scrollTop + ul.clientHeight)) ul.scrollTop = el.offsetTop - ul.clientHeight / 2 + el.offsetHeight / 2;
  }, [open, active]);
  React.useEffect(() => {
    if (!open) return;
    const h = (e) => { if (wrap.current && !wrap.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [open]);

  return (
    <div className="vui-field">
      {label && <FieldLabel htmlFor={fid} optional={optional}>{label}</FieldLabel>}
      <div ref={wrap} className="vui-select">
        <button ref={btn} type="button" id={fid} disabled={disabled} role="combobox" aria-label={ariaLabel} aria-haspopup="listbox" aria-expanded={open} aria-controls={listId} aria-activedescendant={open && active >= 0 ? listId + '-' + active : undefined} aria-describedby={error || hint ? hintId : undefined} aria-invalid={!!error || undefined}
          className={cx('vui-control', 'vui-select__trigger', size !== 'md' && 'vui-control--' + size, error && 'vui-control--invalid', disabled && 'vui-control--disabled', open && 'vui-select__trigger--open', className)}
          onClick={() => (open ? setOpen(false) : openList())} onKeyDown={onKey}>
          {iconLeft && <span className="vui-control__adorn">{renderIcon(iconLeft)}</span>}
          <span className={cx('vui-select__value', !selected && 'vui-select__value--placeholder')}>{selected ? selected.label : placeholder}</span>
          <Chevron className="vui-select__chevron" />
        </button>
        {name && <input type="hidden" name={name} value={cur} />}
        {open && (
          <ul id={listId} role="listbox" aria-labelledby={label ? undefined : fid} className={cx('vui-select__menu', up && 'vui-select__menu--up')}>
            {opts.map((o, i) => (
              <li key={o.value} id={listId + '-' + i} role="option" aria-selected={o.value === cur} aria-disabled={o.disabled || undefined}
                className={cx('vui-select__option', i === active && 'vui-select__option--active')}
                onMouseEnter={() => !o.disabled && setActive(i)} onMouseDown={(e) => e.preventDefault()} onClick={() => pick(o)}>
                {o.icon && renderIcon(o.icon)}
                <span className="vui-select__label">{o.label}{o.description && <span className="vui-select__desc">{o.description}</span>}</span>
                {o.value === cur && <Glyph name="check" className="vui-select__check" />}
              </li>
            ))}
          </ul>
        )}
      </div>
      {(error || hint) && <FieldHint id={hintId} error={!!error}>{error || hint}</FieldHint>}
    </div>
  );
}
