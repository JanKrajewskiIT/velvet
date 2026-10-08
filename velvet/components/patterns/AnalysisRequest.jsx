import React from 'react';
import { Checkmark } from '../primitives/Checkmark.jsx';
import { Button } from '../actions/Button.jsx';
import { Glyph } from '../primitives/Glyph.jsx';
import { cx } from '../primitives/cx.js';
import { IconTile } from '../primitives/IconTile.jsx';
import { Spinner } from '../feedback/Spinner.jsx';
const KIND_ICON = { cv: 'file-text', job: 'briefcase', notes: 'message-square', transcript: 'mic', profile: 'id-card', company: 'building', portfolio: 'layers', other: 'paperclip' };
const DEPTH = [
  { id: 'quick', label: 'Quick', hint: '~10 s' },
  { id: 'standard', label: 'Standard', hint: '~30 s' },
  { id: 'deep', label: 'Deep', hint: '~1–2 min' },
];
const ctl = (value, def, onChange) => { const [s, set] = React.useState(def); return [value !== undefined ? value : s, (v) => { if (value === undefined) set(v); onChange && onChange(v); }]; };
export function AnalysisRequest({ title = 'Request AI analysis', description, sources = [], selected, defaultSelected, onSelectedChange, analyses = [], analysis, defaultAnalysis, onAnalysisChange, instructions, defaultInstructions = '', onInstructionsChange, instructionsPlaceholder = 'Focus on… (optional) — e.g. leadership experience, notice period, salary fit', depth, defaultDepth = 'standard', onDepthChange, depths = DEPTH, status = 'idle', steps = [], step = 0, error, onRun, onCancel, runLabel = 'Run analysis', model, estimate, className }) {
  const [sel, setSel] = ctl(selected, defaultSelected ?? sources.filter((s) => s.status !== 'missing').map((s) => s.id), onSelectedChange);
  const [an, setAn] = ctl(analysis, defaultAnalysis ?? (analyses[0] && analyses[0].id), onAnalysisChange);
  const [ins, setIns] = ctl(instructions, defaultInstructions, onInstructionsChange);
  const [dp, setDp] = ctl(depth, defaultDepth, onDepthChange);
  const did = React.useId();
  const [busy, setBusy] = React.useState(false);
  const [err, setErr] = React.useState(null);
  const running = status === 'running' || busy;
  const cur = analyses.find((a) => a.id === an);
  const ready = (id) => { const s = sources.find((x) => x.id === id); return s && s.status === 'ready' && sel.includes(id); };
  const missing = ((cur && cur.requires) || []).filter((id) => !ready(id)).map((id) => (sources.find((s) => s.id === id) || { label: id }).label);
  const none = !sources.some((s) => ready(s.id));
  const blocked = missing.length > 0 || none;
  const toggle = (s) => { if (s.status !== 'ready' || running) return; setSel(sel.includes(s.id) ? sel.filter((x) => x !== s.id) : [...sel, s.id]); };
  const run = async () => {
    if (blocked || running || !onRun) return; setErr(null); setBusy(true);
    try { await onRun({ analysis: an, sources: sel.filter(ready), instructions: ins.trim(), depth: dp }); }
    catch (e) { setErr((e && e.message) || 'The analysis couldn’t start. Try again.'); }
    finally { setBusy(false); }
  };
  const shownErr = error || err;
  return (
    <section className={cx('vui-areq', running && 'vui-areq--running', className)} aria-busy={running || undefined}>
      <header className="vui-areq__head">
        <IconTile className="vui-areq__spark" icon="sparkles" />
        <div className="vui-areq__ht"><h3 className="vui-areq__title">{title}</h3>{description && <p className="vui-areq__desc">{description}</p>}</div>
        {model && <span className="vui-areq__model">{model}</span>}
      </header>
      <div className="vui-areq__body">
        {analyses.length > 0 && (
          <fieldset className="vui-areq__set" disabled={running}>
            <legend className="vui-areq__lbl">Analysis</legend>
            <div className="vui-areq__types" role="radiogroup" aria-label="Analysis type">
              {analyses.map((a) => (
                <button key={a.id} type="button" role="radio" aria-checked={a.id === an} className="vui-areq__type" onClick={() => setAn(a.id)}>
                  <IconTile size="xs" className="vui-areq__ticon" icon={a.icon || 'sparkles'} />
                  <span className="vui-areq__tt"><span className="vui-areq__tname">{a.label}</span>{a.description && <span className="vui-areq__tdesc">{a.description}</span>}</span>
                  <Checkmark radio size="sm" checked={a.id === an} className="vui-areq__radio" />
                </button>
              ))}
            </div>
          </fieldset>
        )}
        <fieldset className="vui-areq__set" disabled={running}>
          <legend className="vui-areq__lbl">Context <span className="vui-areq__lblc">{sel.filter(ready).length} of {sources.length} included</span></legend>
          <ul className="vui-areq__sources">
            {sources.map((s) => {
              const on = sel.includes(s.id) && s.status === 'ready';
              const req = cur && (cur.requires || []).includes(s.id);
              return (
                <li key={s.id} className={cx('vui-areq__src', 'vui-areq__src--' + (s.status || 'ready'), on && 'vui-areq__src--on')}>
                  <button type="button" className="vui-areq__srcbtn" role="checkbox" aria-checked={on} disabled={s.status !== 'ready'} onClick={() => toggle(s)}>
                    <IconTile size="sm" className="vui-areq__sicon">{s.status === 'loading' ? <Spinner size="inline" tone="current" /> : <Glyph name={s.icon || KIND_ICON[s.kind] || 'file'} />}</IconTile>
                    <span className="vui-areq__st"><span className="vui-areq__sname">{s.label}{req && <span className="vui-areq__req">Required</span>}</span><span className="vui-areq__sdet">{s.status === 'missing' ? 'Not provided' : s.status === 'loading' ? 'Processing…' : s.status === 'error' ? (s.error || 'Couldn’t read this file') : s.detail}</span></span>
                    {s.status === 'ready' && <Checkmark round checked={on} className="vui-areq__check" />}
                  </button>
                  {(s.status === 'missing' || s.status === 'error') && s.onAttach && <Button variant="secondary" size="sm" iconLeft="paperclip" className="vui-areq__attach" onClick={s.onAttach}>{s.status === 'error' ? 'Replace' : 'Add'}</Button>}
                </li>
              );
            })}
          </ul>
        </fieldset>
        <div className="vui-areq__row">
          <label className="vui-areq__set vui-areq__ins">
            <span className="vui-areq__lbl">Instructions</span>
            <textarea className="vui-areq__ta" rows={2} value={ins} placeholder={instructionsPlaceholder} disabled={running} onChange={(e) => setIns(e.target.value)} onKeyDown={(e) => { if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') { e.preventDefault(); run(); } }} />
          </label>
          {depths && depths.length > 0 && (
            <div className="vui-areq__set">
              <span className="vui-areq__lbl" id={did}>Depth</span>
              <div className="vui-areq__depth" role="radiogroup" aria-labelledby={did}>
                {depths.map((d) => <button key={d.id} type="button" role="radio" aria-checked={d.id === dp} disabled={running} className="vui-areq__dbtn" onClick={() => setDp(d.id)}><span>{d.label}</span>{d.hint && <small>{d.hint}</small>}</button>)}
              </div>
            </div>
          )}
        </div>
        {running && steps.length > 0 && (
          <ol className="vui-areq__steps" aria-live="polite">
            {steps.map((t, i) => <li key={i} className={cx('vui-areq__step', i < step && 'vui-areq__step--done', i === step && 'vui-areq__step--now')}><span className="vui-areq__sdot" aria-hidden="true">{i < step ? <Glyph name="check" /> : null}</span>{t}</li>)}
          </ol>
        )}
        {shownErr && !running && <div className="vui-areq__err" role="alert"><Glyph name="alert-circle" />{shownErr}</div>}
      </div>
      <footer className="vui-areq__foot">
        <span className="vui-areq__note">{blocked ? (none ? 'Include at least one source' : 'Needs: ' + missing.join(', ')) : estimate || 'Your data is sent only for this analysis'}</span>
        {running && onCancel && <Button variant="ghost" onClick={onCancel}>Cancel</Button>}
        <Button className="vui-areq__run" iconLeft="sparkles" loading={running} disabled={blocked} onClick={run}>{running ? 'Analysing…' : runLabel}</Button>
      </footer>
    </section>
  );
}
