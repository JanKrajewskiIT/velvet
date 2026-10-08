import { createSignal, type JSX, mergeProps, onCleanup, onMount } from 'solid-js';

import { cx } from '../../utils/cx';

const FALLBACK_DURATION_S = 20;
const MIN_DURATION_S = 4;

export interface MarqueeProps {
  children: JSX.Element;
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
 * Infinite horizontal scroller (logo walls, testimonials). Content is rendered twice; the copy is aria-hidden.
 * Pauses on hover; static under reduced motion.
 */
export const Marquee = (props: MarqueeProps) => {
  const p = mergeProps(
    { speed: 40, direction: 'left', gap: 48, pauseOnHover: true, fade: true } satisfies Partial<MarqueeProps>,
    props,
  );
  let group!: HTMLDivElement;
  const [contentWidth, setContentWidth] = createSignal(0);
  const duration = () => (contentWidth() ? Math.max(MIN_DURATION_S, contentWidth() / p.speed) : FALLBACK_DURATION_S);

  onMount(() => {
    setContentWidth(group.scrollWidth);
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(() => setContentWidth(group.scrollWidth));
    observer.observe(group);
    onCleanup(() => observer.disconnect());
  });

  return (
    <div
      class={cx('vui-marquee', p.pauseOnHover && 'vui-marquee--pause', p.fade && 'vui-marquee--fade', p.class)}
      role="region"
      aria-label={p.label}
    >
      <div
        class="vui-marquee__track"
        style={{
          'animation-duration': `${duration()}s`,
          'animation-direction': p.direction === 'right' ? 'reverse' : 'normal',
          gap: `${p.gap}px`,
        }}
      >
        <div ref={group} class="vui-marquee__group" style={{ gap: `${p.gap}px` }}>
          {p.children}
        </div>
        <div class="vui-marquee__group" style={{ gap: `${p.gap}px` }} aria-hidden="true">
          {p.children}
        </div>
      </div>
    </div>
  );
};
