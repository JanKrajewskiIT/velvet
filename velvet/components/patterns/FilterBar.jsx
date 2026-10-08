import React from 'react';
import { SearchInput } from '../forms/SearchInput.jsx';
import { Control } from '../primitives/Control.jsx';
import { Dot } from '../primitives/Dot.jsx';
import { Count } from '../primitives/Count.jsx';
import { Button } from '../actions/Button.jsx';
import { Glyph } from '../primitives/Glyph.jsx';
import { useDismiss } from '../primitives/useDismiss.js';
import { cx } from '../primitives/cx.js';
function FilterChip({ f, sel, onChange }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  useDismiss(open, setOpen, ref);
  const multi = f.multiple !== false;
  const picked = f.options.filter((o) => sel.includes(o.value));
  const summary = picked.length === 1 ? picked[0].label : null;
  const toggle = (v) => onChange(multi ? (sel.includes(v) ? sel.filter((x) => x !== v) : [...sel, v]) : (sel[0] === v ? [] : [v]));
  return (
    <span ref={ref} className="vui-menu-wrap">
      <button type="button" className={cx('vui-fchip', picked.length > 0 && 'vui-fchip--on')} aria-haspopup="listbox" aria-expanded={open} onClick={() => setOpen(!open)}>
        {f.icon && <Glyph name={f.icon} />}
        <span>{f.label}{summary && <span className="vui-fchip__val">{': ' + summary}</span>}</span>
        {picked.length > 1 && <Count value={picked.length} tone="soft" size="sm" showZero />}
        <Glyph name="chevron-down" className="vui-fchip__chev" />
      </button>
      {open && (
        <div className="vui-menu vui-menu--pop vui-fchip__menu">
          <div role="listbox" aria-multiselectable={multi || undefined} aria-label={f.label}>
            {f.options.map((o) => {
              const on = sel.includes(o.value);
              return (
                <div key={o.value} role="option" aria-selected={on} tabIndex={0} className="vui-option" onClick={() => toggle(o.value)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(o.value); } }}>
                  {multi ? <span className={cx('vui-fchip__box', on && 'vui-fchip__box--on')} aria-hidden="true">{on && <Glyph name="check" />}</span> : <span className="vui-option__check">{on && <Glyph name="check" />}</span>}
                  {o.dot && <Dot tone={o.dot} />}
                  <span className="vui-option__label">{o.label}</span>
                  {o.count != null && <span className="vui-option__kbd">{o.count}</span>}
                </div>
              );
            })}
          </div>
          {picked.length > 0 && <div className="vui-fchip__foot"><Button variant="ghost" size="sm" onClick={() =>onChange([])}>Clear</Button></div>}
        </div>
      )}
    </span>
  );
}
export function FilterBar({ search = true, searchPlaceholder = 'Search…', query, defaultQuery = '', onQueryChange, filters = [], value, defaultValue = {}, onChange: onChangeProp, onValueChange, resultCount, resultLabel = 'results', actions, className }) {
  const onChange = onChangeProp || onValueChange;
  const [q, setQ] = React.useState(defaultQuery);
  const curQ = query !== undefined ? query : q;
  const setQuery = (v) => { if (query === undefined) setQ(v); onQueryChange && onQueryChange(v); };
  const [inner, setInner] = React.useState(defaultValue);
  const cur = value !== undefined ? value : inner;
  const set = (v) => { if (value === undefined) setInner(v); onChange && onChange(v); };
  const active = Object.values(cur).reduce((n, a) => n + (a ? a.length : 0), 0) + (curQ ? 1 : 0);
  return (
    <div className={cx('vui-filterbar', className)} role="search">
      {search && (
        <SearchInput size="sm" className="vui-filterbar__search" aria-label={searchPlaceholder.replace('…', '')} placeholder={searchPlaceholder} value={curQ} onValueChange={setQuery} />
      )}
      {filters.map((f) => <FilterChip key={f.key} f={f} sel={cur[f.key] || []} onChange={(v) => set({ ...cur, [f.key]: v })} />)}
      {active > 0 && <Button variant="ghost" size="sm" className="vui-filterbar__clear" onClick={() =>{ set({}); setQuery(''); }}>Clear all</Button>}
      <div className="vui-filterbar__end">
        {resultCount != null && <span className="vui-filterbar__count" aria-live="polite">{resultCount.toLocaleString() + ' ' + resultLabel}</span>}
        {actions}
      </div>
    </div>
  );
}
