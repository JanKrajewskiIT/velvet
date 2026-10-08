import React from 'react';
import { OptionSwitcher } from '../forms/OptionSwitcher.jsx';
import { Slider } from '../forms/Slider.jsx';
import { FieldLabel } from '../primitives/Field.jsx';
import { Kbd } from '../primitives/Kbd.jsx';
import { Button } from '../actions/Button.jsx';
import { Glyph } from '../primitives/Glyph.jsx';
import { Meter } from '../primitives/Meter.jsx';
import { CloseButton } from '../primitives/CloseButton.jsx';
import { FlipCard } from '../data/FlipCard.jsx';
import { ProgressRing } from '../feedback/Progress.jsx';
import { cx } from '../primitives/cx.js';
export function FlashcardSetup({ decks = [], onStart, maxCards = 50, className }) {
  const [deck, setDeck] = React.useState(decks[0] && decks[0].id);
  const d = decks.find((x) => x.id === deck) || {};
  const cap = Math.min(maxCards, d.total || maxCards);
  const [n, setN] = React.useState(Math.min(20, cap));
  const [order, setOrder] = React.useState('due');
  const [dir, setDir] = React.useState('front');
  React.useEffect(() => setN((x) => Math.min(x, cap)), [cap]);
  const Seg = ({ v, set, opts, label }) => <OptionSwitcher size="sm" label={label} value={v} onValueChange={set} options={opts.map(([value, l]) => ({ value, label: l }))} />;
  return (
    <div className={cx('vui-surface', 'vui-fc-setup', className)}>
      <div className="vui-fc-setup__h">Practice setup</div>
      <div className="vui-fc-setup__decks" role="radiogroup" aria-label="Deck">
        {decks.map((x) => (
          <button key={x.id} type="button" role="radio" aria-checked={deck === x.id} className={cx('vui-fc-deck', deck === x.id && 'vui-fc-deck--on')} onClick={() => setDeck(x.id)}>
            <span className="vui-fc-deck__name">{x.name}</span>
            <span className="vui-fc-deck__meta">{x.total} cards{x.due ? ' · ' : ''}{x.due ? <b>{x.due} due today</b> : null}</span>
          </button>
        ))}
      </div>
      <Slider label="Cards" min={1} max={cap} value={n} onValueChange={setN} />
      <div className="vui-fc-setup__row"><FieldLabel>Order</FieldLabel><Seg label="Order" v={order} set={setOrder} opts={[['due', 'Due first'], ['random', 'Shuffle'], ['new', 'New only']]} /></div>
      <div className="vui-fc-setup__row"><FieldLabel>Show first</FieldLabel><Seg label="Show first" v={dir} set={setDir} opts={[['front', 'Term'], ['back', 'Definition']]} /></div>
      <Button size="lg" block iconLeft="play" onClick={() => onStart && onStart({ deck, count: n, order, direction: dir })}>Start session</Button>
    </div>
  );
}
export function FlashcardSession({ cards = [], onFinish, onExit, reverse = false, className }) {
  const [i, setI] = React.useState(0);
  const [flip, setFlip] = React.useState(false);
  const [res, setRes] = React.useState([]);
  const [leaving, setLeaving] = React.useState(null);
  const c = cards[i];
  const answer = (known) => {
    if (!flip) { setFlip(true); return; }
    setLeaving(known ? 'right' : 'left');
    setTimeout(() => {
      const r = [...res, { id: c.id ?? i, known }]; setRes(r); setLeaving(null); setFlip(false);
      if (i + 1 >= cards.length) onFinish && onFinish(r); else setI(i + 1);
    }, 220);
  };
  React.useEffect(() => {
    const k = (e) => { if (e.target.closest && e.target.closest('input,textarea')) return; if (e.key === ' ') { e.preventDefault(); setFlip((f) => !f); } else if (e.key === '1' || e.key === 'ArrowLeft') answer(false); else if (e.key === '2' || e.key === 'ArrowRight') answer(true); };
    window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k);
  });
  if (!c) return null;
  const known = res.filter((r) => r.known).length;
  return (
    <div className={cx('vui-fc-session', className)}>
      <div className="vui-fc-session__top">
        {onExit && <CloseButton aria-label="End session" onClick={onExit} />}
        <Meter value={i} max={cards.length} label="Session progress" role="progressbar" />
        <span className="vui-fc-session__count">{i + 1} / {cards.length}</span>
      </div>
      <div className={cx('vui-fc-session__card', leaving && 'vui-fc-session__card--' + leaving)} key={i}>
        <FlipCard height={240} flipped={flip} onFlip={setFlip} label={'Card ' + (i + 1)}
          front={<><span className="vui-fc-hint">{c.hint || (reverse ? 'Definition' : 'Term')}</span><span className="vui-fc-term">{reverse ? c.back : c.front}</span><span className="vui-fc-tap">Tap or press Space to flip</span></>}
          back={<><span className="vui-fc-hint" style={{ color: 'var(--on-color-muted)' }}>{reverse ? 'Term' : 'Definition'}</span><span className="vui-fc-term">{reverse ? c.front : c.back}</span>{c.example && <span className="vui-fc-ex">{c.example}</span>}</>} />
      </div>
      <div className="vui-fc-session__actions">
        <Button variant="secondary" size="lg" iconLeft="x" className="vui-fc-btn" onClick={() => answer(false)} disabled={!flip}>Didn’t know<Kbd size="sm">1</Kbd></Button>
        <Button size="lg" iconLeft="check" className="vui-fc-btn" onClick={() => answer(true)} disabled={!flip}>Knew it<Kbd size="sm">2</Kbd></Button>
      </div>
      <div className="vui-fc-session__tally" aria-live="polite">{known} known · {res.length - known} to review</div>
    </div>
  );
}
export function FlashcardSummary({ results = [], onRestart, onReviewMissed, onDone, className }) {
  const known = results.filter((r) => r.known).length, total = results.length || 1;
  const pct = Math.round((known / total) * 100);
  const msg = pct >= 90 ? 'Excellent recall!' : pct >= 70 ? 'Solid session.' : pct >= 40 ? 'Getting there.' : 'Keep practising.';
  return (
    <div className={cx('vui-surface', 'vui-fc-summary', className)}>
      <ProgressRing value={known} max={total} size={112} stroke={9} tone={pct >= 70 ? 'success' : pct >= 40 ? 'warning' : 'danger'} />
      <div className="vui-fc-summary__h">Session complete</div>
      <p className="vui-fc-summary__p"><b>{known}</b> of <b>{results.length}</b> known on first try. {msg}</p>
      <div className="vui-fc-summary__stats"><div><b>{known}</b><span>Known</span></div><div><b>{results.length - known}</b><span>To review</span></div><div><b>{pct}%</b><span>Accuracy</span></div></div>
      <div className="vui-fc-summary__actions">
        {onReviewMissed && results.length - known > 0 && <Button variant="secondary" onClick={onReviewMissed}>Review {results.length - known} missed</Button>}
        {onRestart && <Button iconLeft="rotate-ccw" onClick={onRestart}>Practice again</Button>}
        {onDone && <Button variant="ghost" onClick={onDone}>Done</Button>}
      </div>
    </div>
  );
}
