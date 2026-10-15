import { createSignal, type JSX, mergeProps, onCleanup, onMount, Show } from 'solid-js';

import { cx } from '../../utils/cx';
import { nonNegativeNumber, positiveNumber } from '../../utils/numericOption';
import styles from './Marquee.module.css';
import { MarqueeCopy } from './MarqueeCopy';
import { MarqueePresentation } from './MarqueePresentation';

const FALLBACK_DURATION_S = 20;
const MIN_DURATION_S = 4;
const DEFAULT_SPEED_PX_S = 40;
const DEFAULT_GAP_PX = 48;

export interface MarqueeProps {
  children: JSX.Element;
  /** Independently renders an inert presentation lane for dynamic content. Never return the original DOM nodes. */
  renderCopy?: () => JSX.Element;
  /** Refreshes the snapshot after property-only or canvas updates when renderCopy is absent. */
  copyVersion?: unknown;
  /** px per second. @default 40 */
  speed?: number;
  /** @default 'left' */
  direction?: 'left' | 'right';
  /** px. @default 48 */
  gap?: number;
  /** @default true */
  pauseOnHover?: boolean;
  /** Edge fade mask. @default true */
  fade?: boolean;
  /** Accessible name of the region. */
  label?: string;
  class?: string;
}

/**
 * Infinite horizontal scroller (logo walls, testimonials). The rendered content has an inert presentation copy.
 * Pauses on hover and keyboard focus; static under reduced motion.
 */
export const Marquee = (props: MarqueeProps) => {
  const p = mergeProps(
    {
      speed: DEFAULT_SPEED_PX_S,
      direction: 'left',
      gap: DEFAULT_GAP_PX,
      pauseOnHover: true,
      fade: true,
    } satisfies Partial<MarqueeProps>,
    props,
  );
  let group!: HTMLDivElement;
  const [contentWidth, setContentWidth] = createSignal(0);
  const speed = () => positiveNumber(p.speed, DEFAULT_SPEED_PX_S);
  const gap = () => nonNegativeNumber(p.gap, DEFAULT_GAP_PX);
  const duration = () => {
    const seconds = contentWidth() / speed();
    return Number.isFinite(seconds) && seconds > 0 ? Math.max(MIN_DURATION_S, seconds) : FALLBACK_DURATION_S;
  };

  onMount(() => {
    setContentWidth(group.scrollWidth);
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(() => setContentWidth(group.scrollWidth));
    observer.observe(group);
    onCleanup(() => observer.disconnect());
  });

  return (
    <div
      class={cx(
        styles.marquee,
        p.pauseOnHover && styles.marqueeVariantPause,
        p.fade && styles.marqueeVariantFade,
        p.class,
      )}
      role="region"
      aria-label={p.label}
    >
      <div
        class={styles.marqueePartTrack}
        style={{
          'animation-duration': `${duration()}s`,
          'animation-direction': p.direction === 'right' ? 'reverse' : 'normal',
          gap: `${gap()}px`,
        }}
      >
        <div
          ref={(element) => {
            group = element;
          }}
          class={styles.marqueePartGroup}
          style={{ gap: `${gap()}px` }}
        >
          {p.children}
        </div>
        <Show
          when={p.renderCopy}
          keyed
          fallback={<MarqueeCopy source={() => group} gap={gap()} version={p.copyVersion} />}
        >
          {(render) => <MarqueePresentation render={render} gap={gap()} />}
        </Show>
      </div>
    </div>
  );
};
