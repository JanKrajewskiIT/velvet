import React from 'react';
import { Glyph } from '../primitives/Glyph.jsx';
import { cx } from '../primitives/cx.js';
import { IconButton } from '../actions/IconButton.jsx';
export function Lightbox({ images = [], index, onIndexChange, onClose }) {
  const open = index != null && index >= 0;
  const [zoom, setZoom] = React.useState(false);
  const ref = React.useRef(null);
  const n = images.length;
  const go = (k) => { setZoom(false); onIndexChange && onIndexChange((k + n) % n); };
  React.useEffect(() => {
    if (!open) return;
    const prev = document.activeElement; ref.current && ref.current.focus();
    const k = (e) => { if (e.key === 'Escape') onClose && onClose(); else if (e.key === 'ArrowRight') go(index + 1); else if (e.key === 'ArrowLeft') go(index - 1); };
    window.addEventListener('keydown', k); return () => { window.removeEventListener('keydown', k); prev && prev.focus && prev.focus(); };
  }, [open, index]);
  if (!open) return null;
  const img = images[index];
  return (
    <div ref={ref} tabIndex={-1} role="dialog" aria-modal="true" aria-label={'Image ' + (index + 1) + ' of ' + n} className="vui-lightbox" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose && onClose(); }}>
      <div className="vui-lightbox__bar"><span className="vui-lightbox__count">{index + 1} / {n}</span><span className="vui-lightbox__cap">{img.caption || img.alt}</span>
        <IconButton variant="overlay" shape="circle" icon="zoom-in" label={zoom ? 'Zoom out' : 'Zoom in'} aria-pressed={zoom} onClick={() => setZoom(!zoom)} />
        <IconButton variant="overlay" shape="circle" icon="x" label="Close" onClick={onClose} /></div>
      <figure className={cx('vui-lightbox__stage', zoom && 'vui-lightbox__stage--zoom')} onMouseDown={(e) => { if (e.target === e.currentTarget) onClose && onClose(); }}>
        <img key={index} src={img.src} alt={img.alt || ''} onClick={() => setZoom(!zoom)} />
      </figure>
      {n > 1 && <><IconButton variant="overlay" shape="circle" size="lg" icon="chevron-left" label="Previous image" className="vui-lightbox__nav vui-lightbox__nav--prev" onClick={() => go(index - 1)} /><IconButton variant="overlay" shape="circle" size="lg" icon="chevron-right" label="Next image" className="vui-lightbox__nav vui-lightbox__nav--next" onClick={() => go(index + 1)} /></>}
      {n > 1 && <div className="vui-lightbox__thumbs">{images.map((m, k) => <button key={k} type="button" aria-label={'Image ' + (k + 1)} aria-current={k === index || undefined} className={cx('vui-lightbox__thumb', k === index && 'vui-lightbox__thumb--on')} onClick={() => go(k)}><img src={m.thumb || m.src} alt="" /></button>)}</div>}
    </div>
  );
}
export function ImageGrid({ images = [], layout = 'uniform', columns = 3, gap = 8, ratio = '4 / 3', featureRatio = '16 / 9', max, lightbox = true, className }) {
  const [open, setOpen] = React.useState(-1);
  const limit = layout === 'feature' ? 3 : max;
  const shown = limit ? images.slice(0, limit) : images;
  const extra = images.length - shown.length;
  const style = layout === 'masonry' ? { columnCount: columns, columnGap: gap, '--imggrid-gap': gap + 'px' }
    : layout === 'feature' ? { gap, aspectRatio: featureRatio }
    : { gridTemplateColumns: 'repeat(' + columns + ', minmax(0,1fr))', gap };
  return (
    <>
      <div className={cx('vui-imggrid', layout !== 'uniform' && 'vui-imggrid--' + layout, className)} style={style}>
        {shown.map((m, k) => {
          const last = extra > 0 && k === shown.length - 1;
          const s = layout === 'uniform' ? { aspectRatio: m.span ? undefined : ratio, gridColumn: m.span ? 'span ' + m.span : undefined, gridRow: m.span ? 'span ' + m.span : undefined } : layout === 'masonry' && m.ratio ? { aspectRatio: m.ratio } : undefined;
          return (
            <button key={k} type="button" className="vui-imggrid__item" style={s} aria-label={last ? 'Open gallery, ' + extra + ' more' : 'Open ' + (m.alt || 'image ' + (k + 1))} onClick={() => lightbox && setOpen(k)}>
              <img src={m.thumb || m.src} alt={m.alt || ''} loading="lazy" />
              {m.badge && <span className="vui-imggrid__badge">{m.badge}</span>}
              {last ? <span className="vui-imggrid__more" aria-hidden="true">+{extra}</span> : <span className="vui-imggrid__zoom" aria-hidden="true"><Glyph name="maximize" /></span>}
            </button>
          );
        })}
      </div>
      {lightbox && <Lightbox images={images} index={open} onIndexChange={setOpen} onClose={() => setOpen(-1)} />}
    </>
  );
}
