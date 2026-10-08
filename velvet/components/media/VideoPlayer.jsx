import React from 'react';
import { Glyph } from '../primitives/Glyph.jsx';
import { cx } from '../primitives/cx.js';
import { fmtTime as fmt } from './time.js';
export function PlayerButton({ icon, label, onClick, pressed, className, children }) {
  return <button type="button" className={cx('vui-player__btn', className)} aria-label={label} title={label} aria-pressed={pressed} onClick={onClick}>{icon ? <Glyph name={icon} /> : children}</button>;
}
export function VideoPlayer({ src, poster, title, tracks = [], autoPlay = false, muted: mutedProp = false, loop = false, ratio = 'video', rates = [0.75, 1, 1.25, 1.5, 2], onEnded, className }) {
  const vid = React.useRef(null), wrap = React.useRef(null), idleT = React.useRef(0);
  const [st, setSt] = React.useState({ playing: false, t: 0, d: 0, buf: 0 });
  const [muted, setMuted] = React.useState(mutedProp);
  const [vol, setVol] = React.useState(1);
  const [rate, setRate] = React.useState(1);
  const [idle, setIdle] = React.useState(false);
  const [fs, setFs] = React.useState(false);
  const [cc, setCc] = React.useState(false);
  const sync = () => { const v = vid.current; if (!v) return; setSt({ playing: !v.paused && !v.ended, t: v.currentTime, d: v.duration || 0, buf: v.buffered.length ? v.buffered.end(v.buffered.length - 1) : 0 }); };
  const toggle = () => { const v = vid.current; if (!v) return; if (v.paused || v.ended) v.play().catch(() => {}); else v.pause(); };
  const seek = (s) => { const v = vid.current; if (!v || !v.duration) return; v.currentTime = Math.max(0, Math.min(v.duration, s)); sync(); };
  React.useEffect(() => { const v = vid.current; if (v) { v.muted = muted; v.volume = vol; } }, [muted, vol]);
  React.useEffect(() => { const v = vid.current; if (v) v.playbackRate = rate; }, [rate]);
  React.useEffect(() => { const v = vid.current; if (v && v.textTracks && v.textTracks[0]) v.textTracks[0].mode = cc ? 'showing' : 'hidden'; }, [cc, tracks.length]);
  React.useEffect(() => {
    const f = () => setFs(document.fullscreenElement === wrap.current);
    document.addEventListener('fullscreenchange', f);
    return () => { document.removeEventListener('fullscreenchange', f); clearTimeout(idleT.current); };
  }, []);
  const poke = () => { setIdle(false); clearTimeout(idleT.current); idleT.current = setTimeout(() => setIdle(true), 2500); };
  const fullscreen = () => { if (document.fullscreenElement) document.exitFullscreen(); else if (wrap.current && wrap.current.requestFullscreen) wrap.current.requestFullscreen().catch(() => {}); };
  const nextRate = () => setRate(rates[(rates.indexOf(rate) + 1) % rates.length]);
  const onKey = (e) => {
    const k = e.key.toLowerCase(); const tag = e.target.tagName;
    if (tag === 'BUTTON' && (k === ' ' || k === 'enter')) return;
    if (tag === 'INPUT' && k.startsWith('arrow')) return;
    const map = { ' ': toggle, k: toggle, arrowleft: () => seek(st.t - 5), arrowright: () => seek(st.t + 5), j: () => seek(st.t - 10), l: () => seek(st.t + 10), m: () => setMuted(!muted), f: fullscreen, c: () => tracks.length && setCc(!cc), home: () => seek(0), end: () => seek(st.d) };
    if (map[k]) { e.preventDefault(); map[k](); poke(); }
  };
  const pct = st.d ? (st.t / st.d) * 100 : 0, bpct = st.d ? (st.buf / st.d) * 100 : 0;
  const level = muted ? 0 : vol;
  return (
    <div ref={wrap} className={cx('vui-player', st.playing && idle && 'vui-player--idle', fs && 'vui-player--fs', className)} style={{ aspectRatio: 'var(--aspect-' + ratio + ')' }}
      tabIndex={0} role="region" aria-label={(title ? title + ' — ' : '') + 'video player'} onKeyDown={onKey} onMouseMove={poke} onMouseLeave={() => st.playing && setIdle(true)}>
      <video ref={vid} className="vui-player__media" src={src} poster={poster} autoPlay={autoPlay} muted={muted} loop={loop} playsInline preload="metadata" onClick={toggle} onDoubleClick={fullscreen}
        onPlay={sync} onPause={sync} onTimeUpdate={sync} onLoadedMetadata={sync} onProgress={sync} onEnded={() => { sync(); onEnded && onEnded(); }}>
        {tracks.map((t, i) => <track key={i} kind={t.kind || 'subtitles'} src={t.src} srcLang={t.srcLang} label={t.label} />)}
      </video>
      {title && <div className="vui-player__title">{title}</div>}
      {!st.playing && <button type="button" className="vui-player__big" aria-label="Play" onClick={toggle}><Glyph name="play" /></button>}
      <div className="vui-player__bar">
        <input type="range" className="vui-player__range vui-player__seek" min={0} max={st.d || 0} step="0.1" value={st.t} onChange={(e) => seek(+e.target.value)} aria-label="Seek" aria-valuetext={fmt(st.t) + ' of ' + fmt(st.d)} style={{ '--p': pct + '%', '--b': bpct + '%' }} />
        <div className="vui-player__row">
          <PlayerButton icon={st.playing ? 'pause' : 'play'} label={st.playing ? 'Pause (k)' : 'Play (k)'} onClick={toggle} />
          <div className="vui-player__vol">
            <PlayerButton icon="volume" className={level === 0 ? 'vui-player__btn--muted' : undefined} label={muted ? 'Unmute (m)' : 'Mute (m)'} onClick={() => setMuted(!muted)} />
            <input type="range" className="vui-player__range vui-player__volume" min={0} max={1} step="0.05" value={level} onChange={(e) => { setVol(+e.target.value); setMuted(+e.target.value === 0); }} aria-label="Volume" aria-valuetext={Math.round(level * 100) + '%'} style={{ '--p': level * 100 + '%' }} />
          </div>
          <span className="vui-player__time">{fmt(st.t)}<span> / {fmt(st.d)}</span></span>
          <span className="vui-player__sp" />
          {tracks.length > 0 && <PlayerButton label="Captions (c)" pressed={cc} onClick={() => setCc(!cc)} className="vui-player__btn--txt">CC</PlayerButton>}
          <PlayerButton label={'Playback speed ' + rate + '×'} onClick={nextRate} className="vui-player__btn--txt">{rate}×</PlayerButton>
          <PlayerButton icon="maximize" label={fs ? 'Exit full screen (f)' : 'Full screen (f)'} onClick={fullscreen} />
        </div>
      </div>
    </div>
  );
}
