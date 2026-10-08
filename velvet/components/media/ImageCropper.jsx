import React from 'react';
import { IconButton } from '../actions/IconButton.jsx';
import { Slider } from '../forms/Slider.jsx';
import { cx } from '../primitives/cx.js';
const lim = (v, m) => Math.max(-m, Math.min(m, v));
export function ImageCropper({ src, alt = '', aspect = 1, shape = 'rect', height = 320, minZoom = 1, maxZoom = 4, zoom: zoomProp, defaultZoom = 1, onZoomChange, onCropChange, rotatable = true, className }) {
  const stage = React.useRef(null), frame = React.useRef(null), drag = React.useRef(null);
  const [W, setW] = React.useState(480);
  const [nat, setNat] = React.useState(null);
  const [zi, setZi] = React.useState(defaultZoom);
  const zoom = zoomProp ?? zi;
  const [rot, setRot] = React.useState(0);
  const [off, setOff] = React.useState({ x: 0, y: 0 });
  const [dragging, setDragging] = React.useState(false);
  React.useLayoutEffect(() => {
    const el = stage.current; if (!el) return;
    const ro = new ResizeObserver(() => setW(el.clientWidth)); ro.observe(el); setW(el.clientWidth);
    return () => ro.disconnect();
  }, []);
  const a = shape === 'circle' ? 1 : aspect;
  const pad = 24;
  const fw = Math.max(40, Math.min(W - pad * 2, (height - pad * 2) * a)), fh = fw / a;
  const rw = nat ? (rot % 180 ? nat.h : nat.w) : 1, rh = nat ? (rot % 180 ? nat.w : nat.h) : 1;
  const base = Math.max(fw / rw, fh / rh);
  const s = base * zoom;
  const clamp = (o, sc = s) => ({ x: lim(o.x, (rw * sc - fw) / 2), y: lim(o.y, (rh * sc - fh) / 2) });
  const o = clamp(off);
  const zoomRef = React.useRef(zoom); zoomRef.current = zoom;
  const setZoom = (z) => {
    const nz = Math.max(minZoom, Math.min(maxZoom, z));
    setOff((p) => clamp({ x: (p.x * nz) / zoomRef.current, y: (p.y * nz) / zoomRef.current }, base * nz));
    if (zoomProp === undefined) setZi(nz);
    onZoomChange && onZoomChange(nz);
  };
  const setZoomRef = React.useRef(setZoom); setZoomRef.current = setZoom;
  React.useEffect(() => {
    const el = stage.current; if (!el) return;
    const w = (e) => { e.preventDefault(); setZoomRef.current(zoomRef.current * (1 - e.deltaY * 0.0015)); };
    el.addEventListener('wheel', w, { passive: false });
    return () => el.removeEventListener('wheel', w);
  }, []);
  React.useEffect(() => {
    if (!nat || !onCropChange) return;
    onCropChange({ x: Math.round(((rw * s - fw) / 2 - o.x) / s), y: Math.round(((rh * s - fh) / 2 - o.y) / s), width: Math.round(fw / s), height: Math.round(fh / s), zoom, rotation: rot });
  }, [nat, o.x, o.y, s, rot, fw, fh]);
  const down = (e) => { if (e.button) return; drag.current = { x: e.clientX, y: e.clientY, o }; setDragging(true); e.currentTarget.setPointerCapture(e.pointerId); frame.current && frame.current.focus({ preventScroll: true }); };
  const move = (e) => { const d = drag.current; if (d) setOff(clamp({ x: d.o.x + e.clientX - d.x, y: d.o.y + e.clientY - d.y })); };
  const up = () => { drag.current = null; setDragging(false); };
  const onKey = (e) => {
    const st = e.shiftKey ? 40 : 10;
    const m = { ArrowLeft: [st, 0], ArrowRight: [-st, 0], ArrowUp: [0, st], ArrowDown: [0, -st] }[e.key];
    if (m) { e.preventDefault(); setOff(clamp({ x: o.x + m[0], y: o.y + m[1] })); }
    else if (e.key === '+' || e.key === '=') { e.preventDefault(); setZoom(zoom + 0.1); }
    else if (e.key === '-') { e.preventDefault(); setZoom(zoom - 0.1); }
  };
  const reset = () => { setRot(0); setOff({ x: 0, y: 0 }); setZoom(1); };
  return (
    <div className={cx('vui-crop', className)}>
      <div ref={stage} className={cx('vui-crop__stage', dragging && 'vui-crop__stage--drag')} style={{ height }} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}>
        {src && <img src={src} alt={alt} draggable={false} className="vui-crop__img" onLoad={(e) => setNat({ w: e.currentTarget.naturalWidth, h: e.currentTarget.naturalHeight })}
          style={{ width: nat ? nat.w * s : undefined, height: nat ? nat.h * s : undefined, visibility: nat ? 'visible' : 'hidden', transform: 'translate(calc(-50% + ' + o.x + 'px), calc(-50% + ' + o.y + 'px)) rotate(' + rot + 'deg)' }} />}
        <div ref={frame} className={cx('vui-crop__frame', shape === 'circle' && 'vui-crop__frame--circle')} style={{ width: fw, height: fh }} tabIndex={0} role="group"
          aria-label="Crop area. Drag or use arrow keys to move the image, plus and minus to zoom." onKeyDown={onKey}><span className="vui-crop__grid" /></div>
      </div>
      <div className="vui-crop__bar">
        {rotatable && <IconButton icon="rotate-ccw" label="Rotate 90° left" size="sm" variant="secondary" onClick={() => { setRot((rot + 270) % 360); setOff({ x: 0, y: 0 }); }} />}
        <Slider className="vui-crop__zoom" label="Zoom" min={minZoom} max={maxZoom} step={0.01} value={zoom} onValueChange={setZoom} format={(v) => Math.round(v * 100) + '%'} />
        <IconButton icon="refresh" label="Reset" size="sm" variant="ghost" onClick={reset} />
      </div>
    </div>
  );
}
