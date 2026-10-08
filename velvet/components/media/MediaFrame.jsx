import React from 'react';
import { Glyph } from '../primitives/Glyph.jsx';
import { cx } from '../primitives/cx.js';
const RATIO = { square: 'var(--aspect-square)', video: 'var(--aspect-video)', photo: 'var(--aspect-photo)', portrait: 'var(--aspect-portrait)', wide: 'var(--aspect-wide)' };
const LABEL = { square: '1 : 1', video: '16 : 9', photo: '4 : 3', portrait: '3 : 4', wide: '21 : 9' };
export function MediaFrame({ src, alt = '', kind = 'image', poster, ratio = 'video', fit = 'cover', position, caption, credit, overlay, badge, loading = false, placeholder, showRatio = false, size = 'md', rounded = true, bordered = false, title, onPlay, className, children }) {
  const [state, setState] = React.useState(src ? (kind === 'video' && !poster ? 'ready' : 'loading') : kind === 'video' ? 'ready' : 'empty');
  const [playing, setPlaying] = React.useState(false);
  React.useEffect(() => { setState(src ? (kind === 'video' && !poster ? 'ready' : 'loading') : kind === 'video' ? 'ready' : 'empty'); setPlaying(false); }, [src, poster, kind]);
  const st = loading ? 'loading' : state;
  const ok = () => setState('ready'); const bad = () => setState('error');
  const play = () => { setPlaying(true); onPlay && onPlay(); if (src) setState('loading'); };
  const obj = { objectFit: fit, objectPosition: position };
  let media = null;
  if (src && state !== 'error') {
    if (kind === 'video' && !playing) media = poster ? <img className="vui-media__el" src={poster} alt="" onLoad={ok} onError={bad} style={obj} /> : null;
    else if (kind === 'video') media = <video className="vui-media__el" src={src} controls autoPlay playsInline onLoadedData={ok} onError={bad} style={obj} />;
    else if (kind === 'embed') media = <iframe className="vui-media__el" src={src} title={title || alt || 'Embedded media'} loading="lazy" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" onLoad={ok} />;
    else media = <img className="vui-media__el" src={src} alt={alt} loading="lazy" decoding="async" onLoad={ok} onError={bad} style={obj} />;
  }
  const showPlay = kind === 'video' && !playing && st !== 'loading';
  const ratioLabel = LABEL[ratio] || String(ratio).replace('/', ' : ');
  const empty = st === 'error' || st === 'empty';
  return (
    <figure className={cx('vui-media', size !== 'md' && 'vui-media--' + size, rounded && 'vui-media--rounded', bordered && 'vui-media--bordered', className)}>
      <div className={cx('vui-media__frame', 'vui-media__frame--' + st)} style={{ aspectRatio: RATIO[ratio] || ratio }} aria-busy={st === 'loading' || undefined}>
        {media}
        {empty && (children || (
          <div className="vui-media__fallback">
            {!(showRatio && !placeholder) && <Glyph name={'image'} />}
            {showRatio && <span className="vui-media__ratio">{ratioLabel}</span>}
            <span>{placeholder ?? (st === 'error' ? 'Couldn’t load media' : showRatio ? null : 'No media')}</span>
          </div>
        ))}
        {showPlay && <button type="button" className="vui-media__play" aria-label={'Play ' + (title || 'video')} onClick={play}><Glyph name="play" /></button>}
        {badge && st !== 'loading' && <span className="vui-media__badge">{badge}</span>}
        {overlay && st !== 'loading' && <div className="vui-media__overlay">{overlay}</div>}
      </div>
      {(caption || credit) && <figcaption className="vui-media__caption"><span>{caption}</span>{credit && <span className="vui-media__credit">{credit}</span>}</figcaption>}
    </figure>
  );
}
