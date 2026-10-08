import React from 'react';
import { Glyph } from '../primitives/Glyph.jsx';
import { PlayerButton } from './VideoPlayer.jsx';
import { cx } from '../primitives/cx.js';
import { fmtTime as fmt } from './time.js';
const wave = (seed, n) => {
  let h = 2166136261;
  for (const c of String(seed)) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  const r = () => { h ^= h << 13; h ^= h >>> 17; h ^= h << 5; return (h >>> 0) / 4294967296; };
  let p = 0.5;
  return Array.from({ length: n }, (_, i) => { p = p * 0.5 + r() * 0.5; return Math.min(1, 0.16 + p * (0.55 + 0.6 * Math.sin((i / n) * Math.PI))); });
};
export function AudioPlayer({ src, title, artist, cover, peaks, bars = 72, rates = [1, 1.25, 1.5, 2, 0.75], size = 'md', className }) {
  const au = React.useRef(null), wv = React.useRef(null), drag = React.useRef(false);
  const [st, setSt] = React.useState({ playing: false, t: 0, d: 0 });
  const [rate, setRate] = React.useState(1);
  const [muted, setMuted] = React.useState(false);
  const n = size === 'sm' ? Math.min(bars, 48) : bars;
  const P = React.useMemo(() => (peaks && peaks.length ? Array.from({ length: n }, (_, i) => peaks[Math.floor((i * peaks.length) / n)]) : wave(title || src, n)), [peaks, n, title, src]);
  const sync = () => { const a = au.current; if (a) setSt({ playing: !a.paused && !a.ended, t: a.currentTime, d: a.duration || 0 }); };
  const toggle = () => { const a = au.current; if (!a) return; if (a.paused || a.ended) a.play().catch(() => {}); else a.pause(); };
  const seek = (s) => { const a = au.current; if (!a || !a.duration) return; a.currentTime = Math.max(0, Math.min(a.duration, s)); sync(); };
  const at = (e) => { const r = wv.current.getBoundingClientRect(); seek(((e.clientX - r.left) / r.width) * st.d); };
  React.useEffect(() => { if (au.current) au.current.playbackRate = rate; }, [rate]);
  React.useEffect(() => { if (au.current) au.current.muted = muted; }, [muted]);
  const pct = st.d ? st.t / st.d : 0;
  const onKey = (e) => {
    const m = { ArrowLeft: -5, ArrowRight: 5, PageDown: -15, PageUp: 15 };
    if (m[e.key] != null) { e.preventDefault(); seek(st.t + m[e.key]); }
    else if (e.key === 'Home') { e.preventDefault(); seek(0); }
    else if (e.key === 'End') { e.preventDefault(); seek(st.d); }
    else if (e.key === ' ') { e.preventDefault(); toggle(); }
  };
  return (
    <div className={cx('vui-audio', 'vui-audio--' + size, st.playing && 'vui-audio--playing', className)}>
      <audio ref={au} src={src} preload="metadata" onPlay={sync} onPause={sync} onTimeUpdate={sync} onLoadedMetadata={sync} onEnded={sync} />
      {cover && <img className="vui-audio__cover" src={cover} alt="" />}
      <button type="button" className="vui-audio__play" aria-label={st.playing ? 'Pause' : 'Play'} onClick={toggle}><Glyph name={st.playing ? 'pause' : 'play'} /></button>
      <div className="vui-audio__main">
        {(title || artist) && <div className="vui-audio__head">{title && <span className="vui-audio__title">{title}</span>}{artist && <span className="vui-audio__artist">{artist}</span>}</div>}
        <div className="vui-audio__track">
          <div ref={wv} className="vui-audio__wave" role="slider" tabIndex={0} aria-label={'Seek' + (title ? ' — ' + title : '')} aria-valuemin={0} aria-valuemax={Math.round(st.d)} aria-valuenow={Math.round(st.t)} aria-valuetext={fmt(st.t) + ' of ' + fmt(st.d)}
            onKeyDown={onKey} onPointerDown={(e) => { drag.current = true; e.currentTarget.setPointerCapture(e.pointerId); at(e); }} onPointerMove={(e) => drag.current && at(e)} onPointerUp={() => { drag.current = false; }}>
            {P.map((p, i) => <i key={i} className={i / n < pct ? 'vui-audio__bar--on' : undefined} style={{ height: Math.max(8, p * 100) + '%' }} />)}
          </div>
          <span className="vui-audio__time">{fmt(st.t)} / {fmt(st.d)}</span>
        </div>
      </div>
      <div className="vui-audio__tools">
        <PlayerButton label={'Playback speed ' + rate + '×'} onClick={() => setRate(rates[(rates.indexOf(rate) + 1) % rates.length])} className="vui-player__btn--txt">{rate}×</PlayerButton>
        <PlayerButton icon="volume" label={muted ? 'Unmute' : 'Mute'} pressed={muted} className={muted ? 'vui-player__btn--muted' : undefined} onClick={() => setMuted(!muted)} />
      </div>
    </div>
  );
}
