import { Index, type JSX } from 'solid-js';

import { LoaderBike } from './LoaderBike';
import styles from './loaderBodies.module.css';
import { LoaderShapeTrail } from './LoaderShapeTrail';
import { LoaderSpans } from './LoaderSpans';

export type LoaderShape = 'circle' | 'triangle' | 'square';

/** What a variant needs besides its own constants. */
export interface LoaderBodyContext {
  /** Unique id for the SVG goo filter of `jelly-triangle`. */
  filterId: string;
  shape: LoaderShape;
}

/** Honeycomb cells: x, y, animation delay (s). */
const HONEYCOMB: ReadonlyArray<readonly [number, number, number]> = [
  [-15, -15, 0],
  [-47, -15, 0.2],
  [-31, -43, 0.2],
  [1, -43, 0.2],
  [17, -15, 0.2],
  [-31, 13, 0.2],
  [1, 13, 0.2],
  [-63, -43, 0.4],
  [33, -43, 0.4],
  [-15, 41, 0.4],
  [-63, 13, 0.4],
  [33, 13, 0.4],
  [-15, -71, 0.4],
  [-47, -71, 0.4],
  [17, -71, 0.4],
  [-47, 41, 0.4],
  [17, 41, 0.4],
  [-79, -15, 0.4],
  [49, -15, 0.4],
  [-63, -99, 0.6],
  [33, -99, 0.6],
  [1, -99, 0.6],
  [-31, -99, 0.6],
  [-63, 69, 0.6],
  [33, 69, 0.6],
  [1, 69, 0.6],
  [-31, 69, 0.6],
  [-95, -43, 0.6],
  [-95, 13, 0.6],
  [49, 41, 0.6],
  [-79, -71, 0.6],
  [-111, -15, 0.6],
  [65, -43, 0.6],
  [65, 13, 0.6],
  [-79, 41, 0.6],
  [49, -71, 0.6],
  [81, -15, 0.6],
];
const PULSE_RING_PHASES = [0, -0.875, -0.75, -0.625, -0.5, -0.375, -0.25, -0.125] as const;
const ORBIT_DELAYS = [0, -1.4286, -2.8571, -4.2857, -5.7143, -7.1429, -8.5714] as const;
const BOUNCE_DOTS = [
  ['15%', 0],
  ['45%', 0.2],
  ['75%', 0.3],
] as const;
const CONCENTRIC_SIZES = ['90px', '60px', '30px'] as const;
const EQUALIZER_DELAYS = ['0s', '0.3s', '0.45s'] as const;
const RIPPLE_DELAYS = ['-0.3s', '-0.1s', '0.1s', '0.3s', '0.5s'] as const;
const FOUR = [0, 1, 2, 3] as const;
const SHUFFLE_CELLS = Array.from({ length: 9 }, (_, i) => i);

/** Inner markup of each loader variant — the structure the loader stylesheet animates. */
export const LOADER_BODIES = {
  bike: () => <LoaderBike />,
  'bouncing-dots': () => (
    <Index each={BOUNCE_DOTS}>
      {(dot) => (
        <>
          <span class={styles.d} style={{ '--l': dot()[0], '--dl': `${dot()[1]}s` }} />
          <span class={styles.s} style={{ '--l': dot()[0], '--dl': `${dot()[1]}s` }} />
        </>
      )}
    </Index>
  ),
  'concentric-pulse': () => (
    <Index each={CONCENTRIC_SIZES}>{(size) => <span class={styles.part} style={{ '--sz': size() }} />}</Index>
  ),
  'corner-pulse': () => <LoaderSpans count={FOUR} />,
  'dual-plane': () => null,
  ellipsis: () => <LoaderSpans count={FOUR} />,
  equalizer: () => (
    <Index each={EQUALIZER_DELAYS}>{(delay) => <span class={styles.part} style={{ '--dl': delay() }} />}</Index>
  ),
  honeycomb: () => (
    <Index each={HONEYCOMB}>
      {(cell) => (
        <span class={styles.g} style={{ '--x': `${cell()[0]}px`, '--y': `${cell()[1]}px`, '--dl': `${cell()[2]}s` }}>
          <span class={styles.h} />
          <span class={styles.h} />
          <span class={styles.h} />
        </span>
      )}
    </Index>
  ),
  'jelly-triangle': (context) => (
    <>
      <span class={styles.d} />
      <span class={styles.t} />
      <svg class={styles.filter} width="0" height="0" aria-hidden="true">
        <defs>
          <filter id={context.filterId}>
            <feGaussianBlur in="SourceGraphic" stdDeviation="7.3" result="blur" />
            <feColorMatrix
              in="blur"
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
              result="ooze"
            />
            <feBlend in="SourceGraphic" in2="ooze" />
          </filter>
        </defs>
      </svg>
    </>
  ),
  'orbit-squares': () => (
    <Index each={ORBIT_DELAYS}>{(delay) => <span class={styles.part} style={{ '--dl': `${delay()}s` }} />}</Index>
  ),
  'pulse-ring': () => (
    <Index each={PULSE_RING_PHASES}>
      {(phase, i) => <span class={styles.part} style={{ '--a': `${i * 45}deg`, '--f': phase() }} />}
    </Index>
  ),
  'ripple-dots': () => (
    <Index each={RIPPLE_DELAYS}>{(delay) => <span class={styles.part} style={{ '--dl': delay() }} />}</Index>
  ),
  'shape-trail': (context) => <LoaderShapeTrail shape={context.shape} />,
  'shuffle-grid': () => <LoaderSpans count={SHUFFLE_CELLS} />,
} satisfies Record<string, (context: LoaderBodyContext) => JSX.Element>;

/** Modifier class per variant (`vui-ld-<suffix>`). */
export const LOADER_CLASS_SUFFIX: Record<keyof typeof LOADER_BODIES, string> = {
  bike: 'bike',
  'bouncing-dots': 'bounce',
  'concentric-pulse': 'concentric',
  'corner-pulse': 'corner',
  'dual-plane': 'dualplane',
  ellipsis: 'ellipsis',
  equalizer: 'equalizer',
  honeycomb: 'honeycomb',
  'jelly-triangle': 'jelly',
  'orbit-squares': 'orbit',
  'pulse-ring': 'pulsering',
  'ripple-dots': 'ripple',
  'shape-trail': 'trail',
  'shuffle-grid': 'shuffle',
};
