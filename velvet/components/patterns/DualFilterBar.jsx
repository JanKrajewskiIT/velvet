import React from 'react';
import { SearchInput } from '../forms/SearchInput.jsx';
import { Chip } from '../forms/Chip.jsx';
import { Control } from '../primitives/Control.jsx';
import { Button } from '../actions/Button.jsx';
import { SectionLabel } from '../primitives/SectionLabel.jsx';
import { Glyph } from '../primitives/Glyph.jsx';
import { cx } from '../primitives/cx.js';
const norm = (o) => (typeof o === 'string' ? { value: o, label: o } : o);
export function DualFilterBar({ filters = [], filterValue, defaultFilterValue = [], onFilterChange, sorts = [], sortValue, defaultSortValue, onSortChange, search, onSearchChange, count, filterLabel = 'Filter', sortLabel = 'Sort', variant = 'full', className }) {
  const fo = filters.map(norm), so = sorts.map(norm);
  const [fi, setFi] = React.useState(defaultFilterValue);
  const [si, setSi] = React.useState(defaultSortValue ?? (so[0] && so[0].value));
  const f = filterValue !== undefined ? filterValue : fi;
  const s = sortValue !== undefined ? sortValue : si;
  const setF = (v) => { if (filterValue === undefined) setFi(v); onFilterChange && onFilterChange(v); };
  const setS = (v) => { if (sortValue === undefined) setSi(v); onSortChange && onSortChange(v); };
  if (variant === 'simple') return (
    <div className={cx('vui-dfbar-s', className)}>
      <div className="vui-dfbar-s__group" role="group" aria-label={filterLabel}>
        {fo.map((o) => { const on = f.includes(o.value); return <button key={o.value} type="button" aria-pressed={on} className={cx('vui-dfbar-s__chip', on && 'vui-dfbar-s__chip--on')} onClick={() => setF(on ? f.filter((x) => x !== o.value) : [...f, o.value])}>{o.label}</button>; })}
      </div>
      <span className="vui-dfbar-s__div" aria-hidden="true" />
      <div className="vui-dfbar-s__group" role="radiogroup" aria-label={sortLabel}>
        {so.map((o) => <button key={o.value} type="button" role="radio" aria-checked={s === o.value} className={cx('vui-dfbar-s__chip', s === o.value && 'vui-dfbar-s__chip--on')} onClick={() => setS(o.value)}>{o.icon && <Glyph name={o.icon} />}{o.label}</button>)}
      </div>
    </div>
  );
  return (
    <div className={cx('vui-dfbar', className)}>
      {onSearchChange && (
        <SearchInput size="sm" className="vui-dfbar__search" placeholder="Search…" value={search || ''} onValueChange={onSearchChange} aria-label="Search" />
      )}
      <div className="vui-dfbar__group" role="group" aria-label={filterLabel}>
        <SectionLabel as="span" className="vui-dfbar__lbl" icon="filter">{filterLabel}</SectionLabel>
        {fo.map((o) => { const on = f.includes(o.value); return <Chip key={o.value} size="sm" selected={on} count={o.count} onClick={() => setF(on ? f.filter((x) => x !== o.value) : [...f, o.value])}>{o.label}</Chip>; })}
        {f.length > 0 && <Button variant="link" size="sm" onClick={() =>setF([])}>Clear</Button>}
      </div>
      <span className="vui-dfbar__div" aria-hidden="true" />
      <div className="vui-dfbar__group" role="radiogroup" aria-label={sortLabel}>
        <SectionLabel as="span" className="vui-dfbar__lbl" icon="sliders">{sortLabel}</SectionLabel>
        {so.map((o) => <button key={o.value} type="button" role="radio" aria-checked={s === o.value} className={cx('vui-chip', 'vui-chip--sm', 'vui-dfbar__sort', s === o.value && 'vui-dfbar__sort--on')} onClick={() => setS(o.value)}>{o.icon && <Glyph name={o.icon} />}{o.label}</button>)}
      </div>
      {count != null && <span className="vui-dfbar__count" aria-live="polite">{count} {count === 1 ? 'result' : 'results'}</span>}
    </div>
  );
}
