import { createEffect, createSignal, mergeProps, on, onCleanup } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { Glyph } from '../primitives/Glyph';
import { resolveScrollContainer, scrollBehavior, type ScrollContainer } from './scrollContainer';

export interface BackToTopProps {
  /** Scroll container: element, selector or accessor. Defaults to the window. */
  target?: ScrollContainer;
  /** px scrolled before it appears. @default 400 */
  threshold?: number;
  /** @default localized "Back to top" */
  label?: string;
  /** fixed = viewport corner · static = place it yourself. @default 'fixed' */
  position?: 'fixed' | 'static';
  class?: string;
}

const RING_RADIUS = 21;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

/** Floating "scroll to top" that appears after the threshold, with a ring showing scroll progress. Respects reduced motion. */
export const BackToTop = (props: BackToTopProps) => {
  const p = mergeProps({ threshold: 400, position: 'fixed' } satisfies Partial<BackToTopProps>, props);
  const translate = useTranslate();
  const label = () => p.label ?? translate('velvet.navigation.backToTop.label');
  const [progress, setProgress] = createSignal(0);
  const [visible, setVisible] = createSignal(false);

  createEffect(
    on([() => p.target, () => p.threshold], () => {
      const container = resolveScrollContainer(p.target);
      const source: HTMLElement | Window = container ?? window;
      const read = () => {
        const top = container ? container.scrollTop : window.scrollY;
        const max = container
          ? container.scrollHeight - container.clientHeight
          : document.documentElement.scrollHeight - window.innerHeight;
        setVisible(top > p.threshold);
        setProgress(max > 0 ? top / max : 0);
      };
      read();
      source.addEventListener('scroll', read, { passive: true });
      onCleanup(() => source.removeEventListener('scroll', read));
    }),
  );

  const scrollToTop = () => {
    (resolveScrollContainer(p.target) ?? window).scrollTo({ top: 0, behavior: scrollBehavior() });
  };

  return (
    <button
      type="button"
      aria-label={label()}
      title={label()}
      class={cx(
        'vui-backtop',
        p.position === 'fixed' && 'vui-backtop--fixed',
        visible() && 'vui-backtop--show',
        p.class,
      )}
      tabIndex={visible() ? 0 : -1}
      aria-hidden={!visible() || undefined}
      onClick={scrollToTop}
    >
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <circle cx="24" cy="24" r={RING_RADIUS} class="vui-backtop__track" />
        <circle
          cx="24"
          cy="24"
          r={RING_RADIUS}
          class="vui-backtop__ring"
          style={{ 'stroke-dasharray': RING_CIRCUMFERENCE, 'stroke-dashoffset': RING_CIRCUMFERENCE * (1 - progress()) }}
        />
      </svg>
      <Glyph name="arrow-up" />
    </button>
  );
};
