import React from 'react';
import { Progress } from './Progress.jsx';
import { Glyph } from '../primitives/Glyph.jsx';
import { IconButton } from '../actions/IconButton.jsx';
import { IconTile } from '../primitives/IconTile.jsx';
import { cx } from '../primitives/cx.js';
export function SetupChecklist({ title = 'Get started', description, steps = [], layout = 'list', hideWhenComplete = true, onDismiss, dismissLabel = 'Dismiss', progressFormat = (v, m) => v + ' of ' + m + ' done', className }) {
  const done = steps.filter((s) => s.done).length;
  if (hideWhenComplete && steps.length > 0 && done === steps.length) return null;
  const next = steps.findIndex((s) => !s.done);
  return (
    <section className={cx('vui-checklist', 'vui-checklist--' + layout, className)} aria-label={typeof title === 'string' ? title : undefined}>
      <header className="vui-checklist__head">
        <div className="vui-checklist__intro">
          <h3 className="vui-checklist__title">{title}</h3>
          {description && <p className="vui-checklist__lede">{description}</p>}
        </div>
        {onDismiss && <IconButton icon="x" label={dismissLabel} size="sm" onClick={onDismiss} />}
      </header>
      <Progress value={done} max={steps.length || 1} size="sm" showValue format={(v) => progressFormat(v, steps.length)} tone={done === steps.length ? 'success' : 'brand'} className="vui-checklist__progress" />
      <ol className="vui-checklist__list">
        {steps.map((s, i) => {
          const act = !!(s.href || s.onClick);
          const Tag = s.href ? 'a' : s.onClick ? 'button' : 'div';
          const props = s.href ? { href: s.href } : s.onClick ? { type: 'button', onClick: s.onClick } : {};
          return (
            <li key={s.id ?? i}>
              <Tag {...props} className={cx('vui-checklist__step', s.done && 'vui-checklist__step--done', i === next && 'vui-checklist__step--next', act && 'vui-checklist__step--action')} aria-current={i === next ? 'step' : undefined}>
                <IconTile size="sm" shape="circle" tone={s.done ? 'success' : i === next ? 'brand' : undefined} icon={s.done ? 'check' : s.icon} className="vui-checklist__mark">{!s.done && !s.icon ? <span className="vui-checklist__num">{i + 1}</span> : null}</IconTile>
                <span className="vui-checklist__text">
                  <span className="vui-checklist__label">{s.label}{s.done && <span className="vui-sr-only"> (done)</span>}</span>
                  {s.description && <span className="vui-checklist__desc">{s.description}</span>}
                </span>
                {act && !s.done && <Glyph name="chevron-right" className="vui-checklist__go" />}
              </Tag>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
