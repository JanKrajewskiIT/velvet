import { FiChevronLeft, FiChevronRight } from 'solid-icons/fi';
import { children as resolveChildren, createEffect, createSignal, For, type JSX, onCleanup, Show } from 'solid-js';

import type Props from '~/models/Props';

import styles from './Carousel.module.css';

interface CarouselProps {
  children: JSX.Element;
  autoPlay?: boolean;
  interval?: number;
  showDots?: boolean;
  showArrows?: boolean;
}

const Carousel = (props: Props<CarouselProps>) => {
  const resolved = resolveChildren(() => props.children);
  const [activeIndex, setActiveIndex] = createSignal(0);
  const [hovered, setHovered] = createSignal(false);
  let trackRef: HTMLDivElement | undefined;

  const slides = () => {
    const c = resolved();
    return Array.isArray(c) ? c : [c];
  };

  const scrollTo = (index: number) => {
    const count = slides().length;
    if (count === 0) return;
    const clamped = Math.max(0, Math.min(index, count - 1));
    setActiveIndex(clamped);
    trackRef?.children[clamped]?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'start',
    });
  };

  const goNext = () => {
    const count = slides().length;
    scrollTo(activeIndex() >= count - 1 ? 0 : activeIndex() + 1);
  };

  const goPrev = () => {
    const count = slides().length;
    scrollTo(activeIndex() <= 0 ? count - 1 : activeIndex() - 1);
  };

  createEffect(() => {
    if (!props.autoPlay || hovered()) return;
    const ms = props.interval ?? 5000;
    const timer = setInterval(goNext, ms);
    onCleanup(() => clearInterval(timer));
  });

  const showArrows = () => props.showArrows ?? true;
  const showDots = () => props.showDots ?? true;

  return (
    <div
      class={`${styles.carousel} ${props.class ?? ''}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div class={styles.track} ref={trackRef}>
        <For each={slides()}>{(slide) => <div class={styles.slide}>{slide}</div>}</For>
      </div>

      <Show when={showArrows()}>
        <button
          type="button"
          class={`${styles.arrow} ${styles.arrowPrev}`}
          onClick={goPrev}
          aria-label="Previous slide"
        >
          <FiChevronLeft />
        </button>
        <button type="button" class={`${styles.arrow} ${styles.arrowNext}`} onClick={goNext} aria-label="Next slide">
          <FiChevronRight />
        </button>
      </Show>

      <Show when={showDots()}>
        <div class={styles.dots}>
          <For each={slides()}>
            {(_, i) => (
              <button
                type="button"
                class={`${styles.dot} ${i() === activeIndex() ? styles.dotActive : ''}`}
                onClick={() => scrollTo(i())}
                aria-label={`Go to slide ${i() + 1}`}
              />
            )}
          </For>
        </div>
      </Show>
    </div>
  );
};

export default Carousel;
