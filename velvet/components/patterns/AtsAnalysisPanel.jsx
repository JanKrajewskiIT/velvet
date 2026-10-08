import React from 'react';
import { Badge } from '../display/Badge.jsx';
import { Tag } from '../display/Tag.jsx';
import { Button } from '../actions/Button.jsx';
import { SectionLabel } from '../primitives/SectionLabel.jsx';
import { Glyph } from '../primitives/Glyph.jsx';
import { ProgressRing } from '../feedback/Progress.jsx';
import { CopyButton } from '../actions/CopyButton.jsx';
import { Skeleton, SkeletonText } from '../feedback/Skeleton.jsx';
import { cx } from '../primitives/cx.js';
import { Meter } from '../primitives/Meter.jsx';
import { IconTile } from '../primitives/IconTile.jsx';
export const SCORE_BANDS = [
  { min: 86, label: 'Excellent match', short: 'Excellent', tone: 'success' },
  { min: 71, label: 'Strong match', short: 'Strong', tone: 'brand' },
  { min: 51, label: 'Partial match', short: 'Fair', tone: 'warning' },
  { min: 0, label: 'Weak match', short: 'Weak', tone: 'danger' },
];
const clamp = (n) => (Number.isFinite(+n) ? Math.max(0, Math.min(100, +n)) : 0);
export const scoreBand = (s, bands = SCORE_BANDS) => bands.find((b) => clamp(s) >= b.min) || bands[bands.length - 1];
const SEV = { critical: { label: 'Critical', icon: 'alert-circle', tone: 'danger' }, warning: { label: 'Improve', icon: 'triangle-alert', tone: 'warning' }, suggestion: { label: 'Suggestion', icon: 'sparkles', tone: 'info' } };
function Ring({ score, tone, size = 112 }) {
  const v = Math.round(clamp(score));
  return (
    <ProgressRing value={clamp(score)} size={size} stroke={9} tone={tone} role="img" label={'Match score ' + v + ' of 100'} className="vui-ats__ring">
      <span className="vui-ats__score" aria-hidden="true">{v}<small>/100</small></span>
    </ProgressRing>
  );
}
export function AtsAnalysisPanel({ status = 'done', result, subject, target, title = 'Match analysis', model, generatedAt, steps = [], step = 0, error = 'The analysis didn’t finish. Your inputs are kept — try again.', onRetry, onRerun, onFeedback, onExport, bands = SCORE_BANDS, disclaimer = 'AI-generated assessment — use it to support, not replace, your judgement.', className }) {
  const [fb, setFb] = React.useState(null);
  const [showAllRecs, setShowAllRecs] = React.useState(false);
  const r = result || {};
  const band = scoreBand(r.score, bands);
  const cats = (r.categories || []).map((c) => ({ ...c, score: clamp(c.score) }));
  const recs = [...(r.recommendations || [])].sort((a, b) => ['critical', 'warning', 'suggestion'].indexOf(a.severity) - ['critical', 'warning', 'suggestion'].indexOf(b.severity));
  const kw = r.keywords || {};
  const kwTotal = (kw.matched || []).length + (kw.missing || []).length + (kw.partial || []).length;
  const counts = recs.reduce((m, x) => ((m[x.severity] = (m[x.severity] || 0) + 1), m), {});
  const plain = () => [title + ': ' + Math.round(clamp(r.score)) + '/100 — ' + band.label, r.verdict, r.summary, cats.map((c) => c.label + ': ' + c.score).join('\n'), (r.strengths || []).map((s) => '+ ' + s).join('\n'), (r.gaps || []).map((s) => '− ' + s).join('\n'), recs.map((x) => '[' + x.severity + '] ' + x.title + (x.message ? ' — ' + x.message : '')).join('\n')].filter(Boolean).join('\n\n');
  const vote = (v) => { const n = fb === v ? null : v; setFb(n); onFeedback && onFeedback(n); };
  const head = (
    <header className="vui-ats__head">
      <Badge tone="brand" className="vui-ai__chip" dot={status === 'loading'} pulse icon="sparkles">{status === 'loading' ? 'Analysing…' : title}</Badge>
      {(subject || target) && <span className="vui-ats__pair">{subject && <b>{subject}</b>}{subject && target && <Glyph name="arrow-right" />}{target && <span>{target}</span>}</span>}
      {(model || generatedAt) && <span className="vui-ai__prov">{[model, generatedAt].filter(Boolean).join(' · ')}</span>}
    </header>
  );
  if (status === 'error') return (
    <article className={cx('vui-ats', className)}>{head}
      <div className="vui-ats__state" role="alert"><IconTile size="xl" shape="circle" tone="danger" icon="alert-circle" /><div><b>Analysis failed</b><p>{error}</p></div>{onRetry && <Button variant="secondary" size="sm" iconLeft="refresh" onClick={onRetry}>Try again</Button>}</div>
    </article>
  );
  if (status === 'loading') return (
    <article className={cx('vui-ats', className)} aria-busy="true">{head}
      <div className="vui-ats__body">
        <div className="vui-ats__hero"><Skeleton circle height={112} /><div style={{ flex: 1, display: 'grid', gap: 10 }}><Skeleton width="40%" height={18} /><Skeleton width="80%" height={12} /><Skeleton width="65%" height={12} /></div></div>
        {steps.length > 0 ? (
          <ol className="vui-areq__steps" aria-live="polite">{steps.map((t, i) => <li key={i} className={cx('vui-areq__step', i < step && 'vui-areq__step--done', i === step && 'vui-areq__step--now')}><span className="vui-areq__sdot" aria-hidden="true">{i < step ? <Glyph name="check" /> : null}</span>{t}</li>)}</ol>
        ) : <SkeletonText lines={4} />}
      </div>
    </article>
  );
  if (status === 'empty' || !result) return (
    <article className={cx('vui-ats', className)}>{head}
      <div className="vui-ats__state"><IconTile size="xl" shape="circle" tone="brand" icon="target" /><div><b>No analysis yet</b><p>Pick the context and run an analysis to see the match score, gaps and recommendations.</p></div></div>
    </article>
  );
  const vis = showAllRecs ? recs : recs.slice(0, 4);
  return (
    <article className={cx('vui-ats', className)} data-band={band.tone}>
      {head}
      <div className="vui-ats__body">
        <div className="vui-ats__hero">
          <Ring score={r.score} tone={band.tone} />
          <div className="vui-ats__verdict">
            <Badge tone={band.tone} className="vui-ats__band">{band.label}</Badge>
            {r.verdict && <h3 className="vui-ats__vh">{r.verdict}</h3>}
            {r.summary && <p className="vui-ats__sum">{r.summary}</p>}
            {recs.length > 0 && <div className="vui-ats__tally">{['critical', 'warning', 'suggestion'].filter((k) => counts[k]).map((k) => <span key={k} className={'vui-ats__tchip vui-ats__tchip--' + SEV[k].tone}><Glyph name={SEV[k].icon} />{counts[k]} {SEV[k].label.toLowerCase()}</span>)}</div>}
          </div>
        </div>
        {cats.length > 0 && (
          <section className="vui-ats__sec">
            <SectionLabel as="h4" className="vui-ats__h">Breakdown</SectionLabel>
            <ul className="vui-ats__cats">
              {cats.map((c) => { const b = scoreBand(c.score, bands); return (
                <li key={c.label} className="vui-ats__cat">
                  <div className="vui-ats__cath"><span className="vui-ats__catl">{c.label}{c.weight != null && <small>×{c.weight}</small>}</span><span className={'vui-ats__catv vui-ats__catv--' + b.tone}>{Math.round(c.score)}</span></div>
                  <Meter value={c.score} tone={b.tone === 'brand' ? undefined : b.tone} label={c.label} className="vui-ats__bar" />
                  {c.note && <span className="vui-ats__catn">{c.note}</span>}
                </li>
              ); })}
            </ul>
          </section>
        )}
        {kwTotal > 0 && (
          <section className="vui-ats__sec">
            <SectionLabel as="h4" className="vui-ats__h" end={<span className="vui-ats__hc">{(kw.matched || []).length} of {kwTotal} found</span>}>Keywords</SectionLabel>
            <div className="vui-ats__kws">
              {(kw.matched || []).map((k) => <Tag key={'m' + k} size="sm" shape="pill" variant="soft" tone="success" icon="check">{k}</Tag>)}
              {(kw.partial || []).map((k) => <Tag key={'p' + k} size="sm" shape="pill" variant="soft" tone="warning" title="Partially matched" icon={<span aria-hidden="true">≈</span>}>{k}</Tag>)}
              {(kw.missing || []).map((k) => <Tag key={'x' + k} size="sm" shape="pill" variant="dashed" icon="x">{k}<span className="vui-sr-only"> (missing)</span></Tag>)}
            </div>
          </section>
        )}
        {((r.strengths || []).length > 0 || (r.gaps || []).length > 0) && (
          <div className="vui-ats__sg">
            {(r.strengths || []).length > 0 && <section className="vui-ats__sgcol vui-ats__sgcol--pos"><SectionLabel as="h4" className="vui-ats__h" icon="thumbs-up">Strengths</SectionLabel><ul>{r.strengths.map((s, i) => <li key={i}>{s}</li>)}</ul></section>}
            {(r.gaps || []).length > 0 && <section className="vui-ats__sgcol vui-ats__sgcol--neg"><SectionLabel as="h4" className="vui-ats__h" icon="target">Gaps</SectionLabel><ul>{r.gaps.map((s, i) => <li key={i}>{s}</li>)}</ul></section>}
          </div>
        )}
        {recs.length > 0 && (
          <section className="vui-ats__sec">
            <SectionLabel as="h4" className="vui-ats__h">Recommendations</SectionLabel>
            <ul className="vui-ats__recs">
              {vis.map((x, i) => { const s = SEV[x.severity] || SEV.suggestion; return (
                <li key={i} className={'vui-ats__rec vui-ats__rec--' + s.tone}>
                  <IconTile size="xs" tone={s.tone === 'info' ? 'brand' : s.tone} icon={s.icon} />
                  <div className="vui-ats__rbody">
                    <div className="vui-ats__rh"><b>{x.title}</b><span className="vui-ats__rsev">{s.label}</span></div>
                    {x.message && <p>{x.message}</p>}
                    {x.evidence && <blockquote className="vui-ats__ev"><span>“{x.evidence.quote}”</span>{x.evidence.source && <cite>— {x.evidence.source}</cite>}</blockquote>}
                  </div>
                </li>
              ); })}
            </ul>
            {recs.length > 4 && <button type="button" className="vui-ats__more" aria-expanded={showAllRecs} onClick={() => setShowAllRecs(!showAllRecs)}>{showAllRecs ? 'Show fewer' : 'Show all ' + recs.length}<Glyph name={'chevron-' + (showAllRecs ? 'up' : 'down')} /></button>}
          </section>
        )}
        {disclaimer && <p className="vui-ai__disclaimer">{disclaimer}</p>}
      </div>
      <footer className="vui-ai__foot">
        <CopyButton value={plain} variant="ghost" size="sm" />
        {onExport && <Button variant="ghost" size="sm" iconLeft="download" onClick={onExport}>Export</Button>}
        {onRerun && <Button variant="ghost" size="sm" iconLeft="refresh" onClick={onRerun}>Re-run</Button>}
        {onFeedback && <span className="vui-ai__fb" role="group" aria-label="Was this accurate?"><span>Accurate?</span><Button variant="ghost" size="sm" aria-pressed={fb === 'up'} onClick={() =>vote('up')}>Yes</Button><Button variant="ghost" size="sm" aria-pressed={fb === 'down'} onClick={() =>vote('down')}>No</Button></span>}
      </footer>
    </article>
  );
}
