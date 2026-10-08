import React from 'react';
import { Glyph } from '../primitives/Glyph.jsx';
import { Card } from '../display/Card.jsx';
import { Badge } from '../display/Badge.jsx';
import { Rating } from '../forms/Rating.jsx';
import { IconButton } from '../actions/IconButton.jsx';
import { Button } from '../actions/Button.jsx';
import { cx } from '../primitives/cx.js';
export function QuestionCard({ question, category, categoryTone = 'brand', level, difficulty, time, tags = [], answer, votes, voted = false, onVote, starred = false, onStar, expanded, defaultExpanded = false, onExpandedChange, padding = 'sm', className, ...rest }) {
  const [inner, setInner] = React.useState(defaultExpanded);
  const open = expanded !== undefined ? expanded : inner;
  const toggle = () => { const n = !open; if (expanded === undefined) setInner(n); onExpandedChange && onExpandedChange(n); };
  const id = React.useId();
  return (
    <Card as="article" padding={padding} className={cx('vui-qcard', open && 'vui-qcard--open', className)} {...rest}>
      <div className="vui-qcard__top">
        <div className="vui-qcard__badges">{category && <Badge tone={categoryTone} size="sm">{category}</Badge>}{level && <Badge variant="outline" size="sm">{level}</Badge>}</div>
        {onStar && <IconButton icon="star" label={starred ? 'Remove from saved' : 'Save question'} aria-pressed={starred} variant={starred ? 'soft' : 'ghost'} size="sm" onClick={onStar} />}
      </div>
      {answer ? <button type="button" className="vui-qcard__q vui-qcard__q--btn" aria-expanded={open} aria-controls={id} onClick={toggle}>{question}</button> : <h3 className="vui-qcard__q">{question}</h3>}
      {(difficulty || time || tags.length > 0) && (
        <div className="vui-qcard__meta">
          {difficulty > 0 && <Rating readOnly size="sm" value={difficulty} label="Difficulty" />}
          {time && <span className="vui-qcard__time"><Glyph name="clock" />{time}</span>}
          {tags.map((t) => <Badge key={t} size="sm">{t}</Badge>)}
        </div>
      )}
      {answer && <div id={id} className="vui-qcard__answer" role="region" hidden={!open}>{answer}</div>}
      {(onVote || answer) && (
        <div className="vui-qcard__foot">
          {onVote && <button type="button" className={cx('vui-qcard__vote', voted && 'vui-qcard__vote--on')} aria-pressed={voted} onClick={onVote}><Glyph name="arrow-up" />{votes ?? 0}<span className="vui-qcard__sr"> {voted ? 'votes, you voted' : 'votes, vote up'}</span></button>}
          {answer && <Button variant="ghost" size="sm" iconRight={'chevron-' + (open ? 'up' : 'down')} className="vui-qcard__toggle" onClick={toggle}>{open ? 'Hide answer' : 'Show answer'}</Button>}
        </div>
      )}
    </Card>
  );
}
