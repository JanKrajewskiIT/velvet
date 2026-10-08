import React from 'react';
import { cx } from '../primitives/cx.js';
const HC = [[-15,-15,0],[-47,-15,.2],[-31,-43,.2],[1,-43,.2],[17,-15,.2],[-31,13,.2],[1,13,.2],[-63,-43,.4],[33,-43,.4],[-15,41,.4],[-63,13,.4],[33,13,.4],[-15,-71,.4],[-47,-71,.4],[17,-71,.4],[-47,41,.4],[17,41,.4],[-79,-15,.4],[49,-15,.4],[-63,-99,.6],[33,-99,.6],[1,-99,.6],[-31,-99,.6],[-63,69,.6],[33,69,.6],[1,69,.6],[-31,69,.6],[-95,-43,.6],[-95,13,.6],[49,41,.6],[-79,-71,.6],[-111,-15,.6],[65,-43,.6],[65,13,.6],[-79,41,.6],[49,-71,.6],[81,-15,.6]];
const PR = [0, -0.875, -0.75, -0.625, -0.5, -0.375, -0.25, -0.125];
const ORB = [0, -1.4286, -2.8571, -4.2857, -5.7143, -7.1429, -8.5714];
function Bike() {
  const wheel = (x) => (
    <g transform={'translate(' + x + ',19)'}>
      <circle className="b-tire" r="9" strokeDasharray="56.549 56.549" />
      <g className="b-spkspin" strokeDasharray="31.416 31.416" strokeDashoffset="-23.562"><circle className="b-spk" r="5" /><circle className="b-spk" r="5" transform="rotate(180,0,0)" /></g>
    </g>
  );
  return (
    <svg viewBox="0 0 48 30" width="48" height="30" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1">
        {wheel(9.5)}
        <g transform="translate(24,19)"><g className="b-pedspin" strokeDasharray="25.133 25.133" strokeDashoffset="-21.991" transform="rotate(67.5,0,0)"><circle className="b-ped" r="4" /><circle className="b-ped" r="4" transform="rotate(180,0,0)" /></g></g>
        {wheel(38.5)}
        <polyline className="b-seat" points="14 3,18 3" strokeDasharray="5 5" />
        <polyline className="b-body" points="16 3,24 19,9.5 19,18 8,34 7,24 19" strokeDasharray="79 79" />
        <path className="b-bars" d="m30,2h6s1,0,1,1-1,1-1,1" strokeDasharray="10 10" />
        <polyline className="b-front" points="32.5 2,38.5 19" strokeDasharray="19 19" />
      </g>
    </svg>
  );
}
const BODY = {
  bike: () => <Bike />,
  'bouncing-dots': () => [['15%', 0], ['45%', 0.2], ['75%', 0.3]].map(([l, d], i) => <React.Fragment key={i}><span className="d" style={{ '--l': l, '--dl': d + 's' }} /><span className="s" style={{ '--l': l, '--dl': d + 's' }} /></React.Fragment>),
  'concentric-pulse': () => ['90px', '60px', '30px'].map((s) => <span key={s} style={{ '--sz': s }} />),
  'corner-pulse': () => [0, 1, 2, 3].map((i) => <span key={i} />),
  'dual-plane': () => null,
  ellipsis: () => [0, 1, 2, 3].map((i) => <span key={i} />),
  equalizer: () => ['0s', '0.3s', '0.45s'].map((d, i) => <span key={i} style={{ '--dl': d }} />),
  honeycomb: () => HC.map(([x, y, d], i) => <span key={i} className="g" style={{ '--x': x + 'px', '--y': y + 'px', '--dl': d + 's' }}><span className="h" /><span className="h" /><span className="h" /></span>),
  'jelly-triangle': (id) => <><span className="d" /><span className="t" /><svg width="0" height="0" aria-hidden="true"><defs><filter id={id}><feGaussianBlur in="SourceGraphic" stdDeviation="7.3" result="blur" /><feColorMatrix in="blur" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="ooze" /><feBlend in="SourceGraphic" in2="ooze" /></filter></defs></svg></>,
  'orbit-squares': () => ORB.map((d, i) => <span key={i} style={{ '--dl': d + 's' }} />),
  'pulse-ring': () => PR.map((f, i) => <span key={i} style={{ '--a': i * 45 + 'deg', '--f': f }} />),
  'ripple-dots': () => ['-0.3s', '-0.1s', '0.1s', '0.3s', '0.5s'].map((d, i) => <span key={i} style={{ '--dl': d }} />),
  'shape-trail': (_, shape) => <svg viewBox={shape === 'triangle' ? '0 0 86 80' : '0 0 80 80'} aria-hidden="true">{shape === 'triangle' ? <polygon points="43 8 79 72 7 72" /> : shape === 'square' ? <rect x="8" y="8" width="64" height="64" /> : <circle cx="40" cy="40" r="32" />}</svg>,
  'shuffle-grid': () => Array.from({ length: 9 }, (_, i) => <span key={i} />),
};
const CLS = { bike: 'bike', 'bouncing-dots': 'bounce', 'concentric-pulse': 'concentric', 'corner-pulse': 'corner', 'dual-plane': 'dualplane', ellipsis: 'ellipsis', equalizer: 'equalizer', honeycomb: 'honeycomb', 'jelly-triangle': 'jelly', 'orbit-squares': 'orbit', 'pulse-ring': 'pulsering', 'ripple-dots': 'ripple', 'shape-trail': 'trail', 'shuffle-grid': 'shuffle' };
export const LOADER_VARIANTS = Object.keys(CLS);
export function Loader({ variant = 'ripple-dots', shape = 'circle', scale, tone = 'brand', label = 'Loading', decorative = false, className, style }) {
  const id = 'vui-jelly-' + React.useId().replace(/:/g, '');
  const v = CLS[variant] ? variant : 'ripple-dots';
  const st = { ...(scale && scale !== 1 ? { zoom: scale } : null), ...(tone === 'current' ? { '--ld-c': 'currentColor' } : null), ...(v === 'jelly-triangle' ? { '--jf': 'url(#' + id + ')' } : null), ...style };
  return (
    <div role={decorative ? undefined : 'status'} aria-label={decorative ? undefined : label} aria-hidden={decorative || undefined} className={cx('vui-ld', 'vui-ld-' + CLS[v], v === 'shape-trail' && shape === 'triangle' && 'vui-ld-trail--triangle', className)} style={st}>
      {BODY[v](id, shape)}
    </div>
  );
}
export function PageLoader({ fullScreen = true, variant = 'ripple-dots', label = 'Loading', className }) {
  return (
    <div role="status" aria-busy="true" aria-live="polite" aria-label={label} className={cx('vui-page-loader', fullScreen && 'vui-page-loader--full', className)}>
      <Loader variant={variant} decorative />
    </div>
  );
}
