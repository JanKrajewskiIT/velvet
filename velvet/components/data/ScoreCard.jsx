import React from 'react';
import { Card } from '../display/Card.jsx';
import { ProgressRing, Progress } from '../feedback/Progress.jsx';
import { Badge } from '../display/Badge.jsx';
import { cx } from '../primitives/cx.js';
const toneOf = (s, t) => t || (s >= 75 ? 'success' : s >= 50 ? 'warning' : 'danger');
export function ScoreCard({ label, score, verdict, hint, criteria = [], tone, className, ...rest }) {
  const t = toneOf(score, tone);
  return (
    <Card tone={t} className={cx('vui-score', className)} {...rest}>
      <div className="vui-score__top">
        <ProgressRing value={score} size={72} stroke={6} tone={t} label={typeof label === 'string' ? label : 'Score'} />
        <div className="vui-score__meta">
          <div className="vui-score__label">{label}</div>
          {verdict && <Badge tone={t} size="sm">{verdict}</Badge>}
          {hint && <div className="vui-score__hint">{hint}</div>}
        </div>
      </div>
      {criteria.length > 0 && (
        <div className="vui-score__criteria">
          {criteria.map((c, i) => <Progress key={i} size="sm" label={c.label} value={c.value} showValue tone={toneOf(c.value, c.tone)} />)}
        </div>
      )}
    </Card>
  );
}
