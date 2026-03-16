import { FiChevronLeft, FiChevronRight } from 'solid-icons/fi';
import { children as resolveChildren, createEffect, createSignal, For, type JSX, onCleanup, Show } from 'solid-js';

import IconButton from '~/components/buttons/IconButton/IconButton';
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
  const [trackRef, setTrackRef] = createSignal<HTMLDivElement | undefined>();

  const slides = () => {
    const c = resolved();
    return Array.isArray(c) ? c : [c];
  };

  const scrollTo = (index: number) => {
    const count = slides().length;
    if (count === 0) return;
    const clamped = Math.max(0, Math.min(index, count - 1));
    setActiveIndex(clamped);
    const el = trackRef();
    el?.children[clamped]?.scrollIntoView({
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

  createEffect(() => {
    const el = trackRef();
    if (!el) return;

    const syncFromScroll = () => {
      const count = el.children.length;
      if (count === 0) return;
      const slideWidth = el.clientWidth;
      const index = Math.round(el.scrollLeft / slideWidth);
      const clamped = Math.max(0, Math.min(index, count - 1));
      setActiveIndex(clamped);
    };

    el.addEventListener('scroll', syncFromScroll);
    onCleanup(() => el.removeEventListener('scroll', syncFromScroll));
  });

  const showArrows = () => props.showArrows ?? true;
  const showDots = () => props.showDots ?? true;

  return (
    <div
      class={`${styles.carousel} ${props.class ?? ''}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div class={styles.track} ref={setTrackRef}>
        <For each={slides()}>{(slide) => <div class={styles.slide}>{slide}</div>}</For>
      </div>

      <Show when={showArrows()}>
        <IconButton
          class={`${styles.arrow} ${styles.arrowPrev}`}
          onClick={goPrev}
          title="Previous slide"
          variant="outline"
          size="sm"
          icon={<FiChevronLeft />}
        />
        <IconButton
          class={`${styles.arrow} ${styles.arrowNext}`}
          onClick={goNext}
          title="Next slide"
          variant="outline"
          size="sm"
          icon={<FiChevronRight />}
        />
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
