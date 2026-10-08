import React from 'react';
import { cx } from '../primitives/cx.js';
import { Meter } from '../primitives/Meter.jsx';
export function SkillBar({ label, value = 0, level, tone = 'brand', animate = true, className }) {
  const [on, setOn] = React.useState(!animate);
  React.useEffect(() => { if (!animate) return; const r = requestAnimationFrame(() => setOn(true)); return () => cancelAnimationFrame(r); }, [animate]);
  const v = Math.max(0, Math.min(100, value));
  return (
    <div className={cx('vui-skill', 'vui-skill--' + tone, className)}>
      <div className="vui-skill__head"><span className="vui-skill__label">{label}</span>{level && <span className="vui-skill__level">{level}</span>}</div>
      <Meter size="lg" shimmer={animate} tone={tone} value={on ? v : 0} label={typeof label === 'string' ? label : 'Skill level'} aria-valuetext={level ? level + ', ' + v + '%' : v + '%'} />
    </div>
  );
}
