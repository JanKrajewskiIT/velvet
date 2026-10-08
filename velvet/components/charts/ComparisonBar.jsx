import React from 'react';
import { Button } from '../actions/Button.jsx';
import { Glyph } from '../primitives/Glyph.jsx';
import { CloseButton } from '../primitives/CloseButton.jsx';
import { Dialog } from '../feedback/Dialog.jsx';
import { RadarChart } from './RadarChart.jsx';
import { cx } from '../primitives/cx.js';
import { Avatar } from '../data/Avatar.jsx';
const DV = (i) => 'var(--dv-' + ((i % 8) + 1) + ')';
export function ComparisonBar({ items = [], min = 2, max = 4, onRemove, onClear, onCompare, compareLabel = 'Compare', noun = ['item', 'items'], floating = true, className }) {
  const n = items.length;
  const shown = n > 0;
  const ok = n >= min && n <= max;
  const hint = n < min ? 'Select ' + (min - n) + ' more to compare' : n > max ? 'Compare up to ' + max + ' — remove ' + (n - max) : n + ' of ' + max + ' selected';
  return (
    <div className={cx('vui-cmpbar', floating && 'vui-cmpbar--floating', shown && 'vui-cmpbar--shown', className)} role="region" aria-label="Comparison" aria-hidden={!shown || undefined}>
      <div className="vui-cmpbar__items">
        {items.map((it, i) => (
          <span key={it.id} className="vui-cmpbar__chip" style={{ '--c': it.color || DV(i) }}>
            <Avatar size="sm" name={it.label} color="var(--c)" className="vui-cmpbar__av" aria-hidden="true">{it.avatar}</Avatar>
            <span className="vui-cmpbar__lbl">{it.label}</span>
            {onRemove && <CloseButton variant="bare" className="vui-cmpbar__x" label={'Remove ' + it.label + ' from comparison'} tabIndex={shown ? 0 : -1} onClick={() => onRemove(it.id)} />}
          </span>
        ))}
        {Array.from({ length: Math.max(0, Math.min(max, min) - n) }, (_, i) => <span key={'e' + i} className="vui-cmpbar__slot" aria-hidden="true"><Glyph name="plus" /></span>)}
      </div>
      <span className={cx('vui-cmpbar__hint', n > max && 'vui-cmpbar__hint--over')} aria-live="polite">{hint}</span>
      <div className="vui-cmpbar__acts">
        {onClear && <Button variant="ghost" size="sm" tabIndex={shown ? 0 : -1} onClick={onClear}>Clear</Button>}
        <Button size="sm" iconLeft="bar-chart" disabled={!ok} tabIndex={shown ? 0 : -1} onClick={onCompare}>{compareLabel}{n ? ' ' + n + ' ' + (n === 1 ? noun[0] : noun[1]) : ''}</Button>
      </div>
    </div>
  );
}
const bestIdx = (vals, best) => {
  if (!best) return [];
  const nums = vals.map((v) => (typeof v === 'number' ? v : parseFloat(v)));
  if (nums.some((x) => !Number.isFinite(x))) return [];
  const t = best === 'min' ? Math.min(...nums) : Math.max(...nums);
  const hits = nums.map((x, i) => (x === t ? i : -1)).filter((i) => i >= 0);
  return hits.length === nums.length ? [] : hits;
};
export function ComparisonDialog({ open, onClose, title = 'Comparison', description, items = [], axes = [], rows = [], insights, status = 'done', error = 'Couldn’t build the comparison. Try again.', onRetry, onGenerateInsights, insightsStatus = 'idle', insightsLabel = 'Generate AI insights', size = 'lg', footer }) {
  const series = items.map((it, i) => ({ label: it.label, values: it.scores || {}, color: it.color || DV(i) }));
  const hasRadar = axes.length >= 3 && items.some((it) => it.scores);
  const body = status === 'loading' ? (
    <div className="vui-cmpdlg__state" aria-busy="true"><span className="vui-loader vui-loader--ring vui-loader--lg" role="status" aria-label="Comparing" /><span>Comparing {items.length} items…</span></div>
  ) : status === 'error' ? (
    <div className="vui-cmpdlg__state vui-cmpdlg__state--err" role="alert"><Glyph name="alert-circle" /><span>{error}</span>{onRetry && <Button variant="secondary" size="sm" iconLeft="refresh" onClick={onRetry}>Try again</Button>}</div>
  ) : (
    <div className="vui-cmpdlg__body">
      <div className="vui-cmpdlg__cols" style={{ '--n': items.length }}>
        {items.map((it, i) => (
          <div key={it.id} className="vui-cmpdlg__col" style={{ '--c': it.color || DV(i) }}>
            <Avatar name={it.label} color="var(--c)" className="vui-cmpdlg__av" aria-hidden="true">{it.avatar}</Avatar>
            <span className="vui-cmpdlg__ct"><b>{it.label}</b>{it.description && <small>{it.description}</small>}</span>
            {it.score != null && <span className="vui-cmpdlg__score">{it.score}</span>}
          </div>
        ))}
      </div>
      {hasRadar && <div className="vui-cmpdlg__radar"><RadarChart axes={axes} series={series} max={100} size={300} label={title} /></div>}
      {rows.length > 0 && (
        <div className="vui-cmpdlg__tablewrap">
          <table className="vui-cmpdlg__table">
            <thead><tr><th scope="col"><span className="vui-sr-only">Criterion</span></th>{items.map((it, i) => <th key={it.id} scope="col" style={{ '--c': it.color || DV(i) }}><span className="vui-cmpdlg__th">{it.label}</span></th>)}</tr></thead>
            <tbody>
              {rows.map((r) => { const b = bestIdx(r.values, r.best); return (
                <tr key={r.label}>
                  <th scope="row">{r.label}{r.hint && <small>{r.hint}</small>}</th>
                  {r.values.map((v, i) => <td key={i} className={cx(b.includes(i) && 'vui-cmpdlg__best')}>{r.format ? r.format(v) : v ?? '—'}{b.includes(i) && <Glyph name="star-filled" label="Best" />}</td>)}
                </tr>
              ); })}
            </tbody>
          </table>
        </div>
      )}
      {(insights || onGenerateInsights) && (
        <section className="vui-cmpdlg__ins" aria-live="polite">
          <h4><Glyph name="sparkles" />Insights</h4>
          {insights ? <div className="vui-cmpdlg__instext">{insights}</div> : insightsStatus === 'loading' ? <div className="vui-cmpdlg__insload"><span className="vui-ai__pulse" aria-hidden="true" />Writing insights…</div> : (
            <div className="vui-cmpdlg__insempty"><span>Let AI summarise trade-offs and pick a recommendation.</span><Button variant="soft" size="sm" iconLeft="sparkles" onClick={onGenerateInsights}>{insightsLabel}</Button></div>
          )}
        </section>
      )}
    </div>
  );
  return <Dialog open={open} onClose={onClose} title={title} description={description} size={size} className="vui-cmpdlg" footer={footer || <Button variant="secondary" onClick={onClose}>Close</Button>}>{body}</Dialog>;
}
