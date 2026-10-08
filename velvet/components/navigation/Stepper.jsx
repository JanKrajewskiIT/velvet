import React from 'react';
import { Glyph } from '../primitives/Glyph.jsx';
import { cx } from '../primitives/cx.js';
import { Marker } from '../primitives/Marker.jsx';
export function Stepper({ steps = [], current = 0, orientation = 'horizontal', onStepClick, linear = true, errorAt, className }) {
  const prev = React.useRef(current);
  const [pop, setPop] = React.useState([]);
  const root = React.useRef(null);
  React.useEffect(() => {
    const p = prev.current; prev.current = current;
    if (current > p) { const ids = []; for (let i = p; i < current; i++) ids.push(i); setPop(ids); const t = setTimeout(() => setPop([]), 400); return () => clearTimeout(t); }
  }, [current]);
  const canClick = (i) => onStepClick && i !== current && (!linear || i < current);
  const onKey = (e) => {
    if (!onStepClick) return;
    const h = orientation === 'horizontal'; const k = (h ? { ArrowRight: 1, ArrowLeft: -1 } : { ArrowDown: 1, ArrowUp: -1 })[e.key]; if (!k) return;
    const btns = [...root.current.querySelectorAll('.vui-step__inner')]; const i = btns.indexOf(document.activeElement); if (i < 0) return;
    e.preventDefault(); const n = btns[i + k]; n && n.focus();
  };
  return (
    <ol ref={root} className={cx('vui-stepper', 'vui-stepper--' + orientation, className)} aria-label="Progress" onKeyDown={onKey}>
      {steps.map((s, i) => {
        const st = i === errorAt ? 'error' : i < current ? 'done' : i === current ? 'current' : 'todo';
        const click = !!onStepClick;
        const Inner = click ? 'button' : 'div';
        return (
          <li key={i} className={cx('vui-step', 'vui-step--' + st, pop.includes(i) && 'vui-step--pop')} aria-current={st === 'current' ? 'step' : undefined}>
            <Inner type={click ? 'button' : undefined} disabled={click && !canClick(i) && i !== current ? true : undefined} className="vui-step__inner" onClick={canClick(i) ? () => onStepClick(i) : undefined}>
              <Marker className="vui-step__dot" appearance={st === 'done' || st === 'error' ? 'solid' : 'outline'} tone={st === 'error' ? 'danger' : st === 'todo' ? undefined : 'brand'} ring={st === 'current'}>{st === 'done' ? <Glyph name="check" /> : st === 'error' ? <Glyph name="x" /> : i + 1}</Marker>
              <span className="vui-step__text">
                <span className="vui-step__label">{s.label}<span className="vui-sr-only">{st === 'done' ? ' (completed)' : st === 'error' ? ' (has errors)' : ''}</span></span>
                {s.description && <span className="vui-step__desc">{s.description}</span>}
              </span>
            </Inner>
            {i < steps.length - 1 && <span className="vui-step__line" aria-hidden="true" />}
          </li>
        );
      })}
    </ol>
  );
}
