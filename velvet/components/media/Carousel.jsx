import React from 'react';
import { Glyph } from '../primitives/Glyph.jsx';
import { cx } from '../primitives/cx.js';
import { IconButton } from '../actions/IconButton.jsx';
export function Carousel({ slides = [], perView = 1, gap = 16, loop = false, autoplay = 0, showDots = true, showArrows = true, label = 'Carousel', className }) {
  const [i, setI] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const track = React.useRef(null);
  const drag = React.useRef(null);
  const [dx, setDx] = React.useState(0);
  const [w, setW] = React.useState(0);
  React.useLayoutEffect(() => {
    if (!track.current) return; setW(track.current.clientWidth);
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(([e]) => setW(e.contentRect.width)); ro.observe(track.current); return () => ro.disconnect();
  }, []);
  const pv = typeof perView === 'number' ? perView : 1;
  const max = Math.max(0, slides.length - pv);
  const go = (n) => setI(loop ? (n < 0 ? max : n > max ? 0 : n) : Math.max(0, Math.min(max, n)));
  React.useEffect(() => {
    if (!autoplay || paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = setInterval(() => setI((x) => (x >= max ? 0 : x + 1)), autoplay); return () => clearInterval(t);
  }, [autoplay, paused, max]);
  const slideW = (w - gap * (pv - 1)) / pv;
  const offset = -(i * (slideW + gap)) + dx;
  return (
    <section className={cx('vui-carousel', className)} aria-roledescription="carousel" aria-label={label} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}
      onKeyDown={(e) => { if (e.key === 'ArrowRight') { e.preventDefault(); go(i + 1); } else if (e.key === 'ArrowLeft') { e.preventDefault(); go(i - 1); } }}>
      <div ref={track} className="vui-carousel__viewport"
        onPointerDown={(e) => { if (e.pointerType === 'mouse' && e.button !== 0) return; drag.current = { x: e.clientX }; }}
        onPointerMove={(e) => { if (drag.current) { const d = e.clientX - drag.current.x; if (Math.abs(d) > 4) { e.currentTarget.setPointerCapture(e.pointerId); setDx(d); } } }}
        onPointerUp={() => { if (!drag.current) return; drag.current = null; if (dx < -50) go(i + 1); else if (dx > 50) go(i - 1); setDx(0); }} onPointerCancel={() => { drag.current = null; setDx(0); }}>
        <div className={cx('vui-carousel__track', dx && 'vui-carousel__track--drag')} style={{ gap, transform: 'translateX(' + offset + 'px)' }} aria-live={autoplay && !paused ? 'off' : 'polite'}>
          {slides.map((s, k) => {
            const vis = k >= i && k < i + pv;
            return <div key={k} role="group" aria-roledescription="slide" aria-label={k + 1 + ' of ' + slides.length} aria-hidden={!vis || undefined} inert={!vis ? '' : undefined} className="vui-carousel__slide" style={{ flex: '0 0 ' + slideW + 'px' }}>{s}</div>;
          })}
        </div>
      </div>
      {showArrows && slides.length > pv && (
        <>
          <IconButton variant="raised" shape="circle" icon="chevron-left" label="Previous slide" className="vui-carousel__arrow vui-carousel__arrow--prev" disabled={!loop && i === 0} onClick={() => go(i - 1)} />
          <IconButton variant="raised" shape="circle" icon="chevron-right" label="Next slide" className="vui-carousel__arrow vui-carousel__arrow--next" disabled={!loop && i >= max} onClick={() => go(i + 1)} />
        </>
      )}
      {showDots && max > 0 && (
        <div className="vui-carousel__dots">
          {Array.from({ length: max + 1 }).map((_, k) => <button key={k} type="button" aria-label={'Go to slide ' + (k + 1)} aria-current={k === i || undefined} className={cx('vui-carousel__dot', k === i && 'vui-carousel__dot--on')} onClick={() => setI(k)} />)}
          {autoplay > 0 && <IconButton variant="soft" shape="circle" size="xs" icon={paused ? 'play' : 'pause'} label={paused ? 'Resume autoplay' : 'Pause autoplay'} className="vui-carousel__play" onClick={() => setPaused(!paused)} />}
        </div>
      )}
    </section>
  );
}
