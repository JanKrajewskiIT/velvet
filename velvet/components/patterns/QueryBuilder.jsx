import React from 'react';
import { SectionLabel } from '../primitives/SectionLabel.jsx';
import { Input } from '../forms/Input.jsx';
import { Select } from '../forms/Select.jsx';
import { Button } from '../actions/Button.jsx';
import { IconButton } from '../actions/IconButton.jsx';
import { CloseButton } from '../primitives/CloseButton.jsx';
import { cx } from '../primitives/cx.js';
const OPS = {
  text: [['contains', 'contains'], ['not_contains', 'does not contain'], ['eq', 'is'], ['starts', 'starts with'], ['empty', 'is empty'], ['not_empty', 'is not empty']],
  number: [['eq', '='], ['neq', '≠'], ['gt', '>'], ['gte', '≥'], ['lt', '<'], ['lte', '≤'], ['empty', 'is empty']],
  select: [['eq', 'is'], ['neq', 'is not'], ['empty', 'is empty']],
  date: [['on', 'is on'], ['before', 'is before'], ['after', 'is after'], ['empty', 'is empty']],
  boolean: [['true', 'is true'], ['false', 'is false']],
};
const NOVALUE = ['empty', 'not_empty', 'true', 'false'];
let seq = 0; const uid = () => 'q' + Date.now().toString(36) + (seq++);
const opsFor = (f) => { const all = OPS[(f && f.type) || 'text']; const allow = f && f.operators; const ops = allow ? all.filter(([v]) => allow.includes(v)) : all; return ops.length ? ops : all; };
const newRule = (fields) => ({ id: uid(), field: fields[0] && fields[0].key, op: opsFor(fields[0])[0][0], value: '' });
export const emptyQuery = (fields = []) => ({ id: uid(), combinator: 'and', rules: [newRule(fields)] });
export const clearQuery = (q) => ({ ...q, rules: [] });
const Sel = ({ value, onChange, options, label, className, placeholder, disabled }) => (
  <div className={className}><Select size="sm" aria-label={label} value={value} options={options} placeholder={placeholder} disabled={disabled} onValueChange={onChange} /></div>
);
function Rule({ r, fields, onChange, onRemove, canRemove, disabled }) {
  const f = fields.find((x) => x.key === r.field) || fields[0];
  const ops = opsFor(f);
  const setField = (k) => { const nf = fields.find((x) => x.key === k); onChange({ ...r, field: k, op: opsFor(nf)[0][0], value: '' }); };
  return (
    <div className="vui-qb__rule">
      <Sel disabled={disabled} label="Field" value={r.field} onChange={setField} className="vui-qb__field" options={fields.map((x) => ({ value: x.key, label: x.label }))} />
      <Sel disabled={disabled} label="Operator" value={r.op} onChange={(op) => onChange({ ...r, op })} className="vui-qb__op" options={ops.map(([v, l]) => ({ value: v, label: l }))} />
      {NOVALUE.includes(r.op) ? <span className="vui-qb__value" /> : f && f.type === 'select'
        ? <Sel disabled={disabled} label="Value" value={r.value} onChange={(value) => onChange({ ...r, value })} className="vui-qb__value" placeholder="Choose…" options={f.options || []} />
        : <div className="vui-qb__value"><Input size="sm" aria-label="Value" disabled={disabled} type={f && f.type === 'number' ? 'number' : f && f.type === 'date' ? 'date' : 'text'} placeholder={f && f.placeholder || 'Value'} value={r.value} onChange={(e) => onChange({ ...r, value: e.target.value })} /></div>}
      <CloseButton aria-label="Remove condition" disabled={disabled || !canRemove} onClick={onRemove} />
    </div>
  );
}
function Group({ g, fields, onChange, onRemove, depth, maxDepth, disabled, reorderable, onClear }) {
  const setRule = (i, v) => onChange({ ...g, rules: g.rules.map((x, k) => (k === i ? v : x)) });
  const remove = (i) => onChange({ ...g, rules: g.rules.filter((_, k) => k !== i) });
  const move = (i, d) => { const j = i + d; if (j < 0 || j >= g.rules.length) return; const next = g.rules.slice(); [next[i], next[j]] = [next[j], next[i]]; onChange({ ...g, rules: next }); };
  const total = g.rules.length; const kind = (r) => (r.rules ? 'group' : 'condition');
  const sub = { fields, maxDepth, disabled, reorderable };
  return (
    <div className={cx('vui-qb__group', depth > 0 && 'vui-qb__group--nested')} role="group" aria-label={depth ? 'Condition group' : 'Conditions'}>
      {total === 0 && <div className="vui-qb__empty">No conditions — every record matches.</div>}
      {g.rules.map((r, i) => (
        <div key={r.id} className={cx('vui-qb__row', reorderable && 'vui-qb__row--move')}>
          <div className="vui-qb__lead">
            {i === 0 ? <span>Where</span> : i === 1
              ? <Button variant="secondary" size="xs" iconRight="chevrons-up-down" className="vui-qb__comb" aria-label={'Match ' + (g.combinator === 'and' ? 'all' : 'any') + ' conditions, click to switch'} disabled={disabled} onClick={() => onChange({ ...g, combinator: g.combinator === 'and' ? 'or' : 'and' })}>{g.combinator}</Button>
              : <span>{g.combinator}</span>}
          </div>
          {r.rules ? <Group g={r} {...sub} depth={depth + 1} onChange={(v) => setRule(i, v)} onRemove={() => remove(i)} />
            : <Rule r={r} fields={fields} disabled={disabled} onChange={(v) => setRule(i, v)} onRemove={() => remove(i)} canRemove={total > 1 || depth > 0 || !!onClear} />}
          {reorderable && <div className="vui-qb__move">
            <IconButton size="xs" icon="arrow-up" label={'Move ' + kind(r) + ' ' + (i + 1) + ' up'} disabled={disabled || i === 0} onClick={() => move(i, -1)} />
            <IconButton size="xs" icon="arrow-down" label={'Move ' + kind(r) + ' ' + (i + 1) + ' down'} disabled={disabled || i === total - 1} onClick={() => move(i, 1)} />
          </div>}
        </div>
      ))}
      <div className="vui-qb__add">
        <Button variant="ghost" size="sm" iconLeft="plus" disabled={disabled} onClick={() => onChange({ ...g, rules: [...g.rules, newRule(fields)] })}>Add condition</Button>
        {depth + 1 < maxDepth && <Button variant="ghost" size="sm" iconLeft="plus" disabled={disabled} onClick={() => onChange({ ...g, rules: [...g.rules, { id: uid(), combinator: g.combinator === 'and' ? 'or' : 'and', rules: [newRule(fields)] }] })}>Add group</Button>}
        {depth > 0 && <Button variant="ghost" size="sm" className="vui-qb__drop" disabled={disabled} onClick={onRemove}>Remove group</Button>}
        {depth === 0 && onClear && <Button variant="ghost" size="sm" className="vui-qb__drop" disabled={disabled || total === 0} onClick={onClear}>Clear all</Button>}
      </div>
    </div>
  );
}
export function describeQuery(q, fields = []) {
  const one = (r) => {
    if (r.rules) return '(' + r.rules.map(one).join(' ' + r.combinator.toUpperCase() + ' ') + ')';
    const f = fields.find((x) => x.key === r.field) || {}; const op = (opsFor(f).find(([v]) => v === r.op) || [, r.op])[1];
    const val = f.type === 'select' ? ((f.options || []).find((o) => o.value === r.value) || {}).label || '…' : r.value || '…';
    return f.label + ' ' + op + (NOVALUE.includes(r.op) ? '' : ' ' + val);
  };
  return q.rules.length ? q.rules.map(one).join(' ' + q.combinator.toUpperCase() + ' ') : 'All records';
}
export function QueryBuilder({ fields = [], value, defaultValue, onChange: onChangeProp, onValueChange, maxDepth = 2, showSummary = false, disabled = false, reorderable = false, clearable = false, onClear, className }) {
  const onChange = onChangeProp || onValueChange;
  const [inner, setInner] = React.useState(() => defaultValue || emptyQuery(fields));
  const cur = value !== undefined ? value : inner;
  const set = (v) => { if (value === undefined) setInner(v); onChange && onChange(v); };
  return (
    <div className={cx('vui-qb', disabled && 'vui-qb--disabled', className)} aria-disabled={disabled || undefined}>
      <Group g={cur} fields={fields} depth={0} maxDepth={maxDepth} disabled={disabled} reorderable={reorderable} onChange={set} onClear={clearable ? () => { const v = clearQuery(cur); set(v); onClear && onClear(v); } : undefined} />
      {showSummary && <div className="vui-qb__summary"><SectionLabel as="span">Query</SectionLabel><code>{describeQuery(cur, fields)}</code></div>}
    </div>
  );
}
