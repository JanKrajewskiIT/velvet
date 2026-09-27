import {
  children as resolveChildren,
  createEffect,
  createMemo,
  createSignal,
  For,
  type JSX,
  onCleanup,
  splitProps,
} from 'solid-js';

import { useI18n } from '~/i18n';
import type Props from '~/models/Props';
import type { DivCoreNativeProps } from '~/models/Props';
import classNames from '~/utils/classNames';

import MediaNavButton from '../MediaNavButton/MediaNavButton';
import styles from './Carousel.module.css';

interface CarouselOwnProps extends Omit<DivCoreNativeProps, 'children'> {
  children: JSX.Element;
  autoPlay?: boolean;
  interval?: number;
}

const Carousel = (props: Props<CarouselOwnProps>) => {
  const { ts } = useI18n();
  const [local, rest] = splitProps(props, ['children', 'autoPlay', 'interval', 'class']);

  const resolved = resolveChildren(() => local.children);
  const [activeIndex, setActiveIndex] = createSignal(0);
  const [hovered, setHovered] = createSignal(false);
  const [trackRef, setTrackRef] = createSignal<HTMLDivElement | undefined>();

  const slides = createMemo(() => {
    const c = resolved();
    return Array.isArray(c) ? c : [c];
  });
  const slideCount = createMemo(() => slides().length);
  const previousSlideLabel = createMemo(() => ts('carousel.previousSlide'));
  const nextSlideLabel = createMemo(() => ts('carousel.nextSlide'));
  const scrollTo = (index: number) => {
    const count = slideCount();
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
    const count = slideCount();
    scrollTo(activeIndex() >= count - 1 ? 0 : activeIndex() + 1);
  };

  const goPrev = () => {
    const count = slideCount();
    scrollTo(activeIndex() <= 0 ? count - 1 : activeIndex() - 1);
  };

  createEffect(() => {
    if (!local.autoPlay || hovered()) return;
    const ms = local.interval ?? 5000;
    const timer = setInterval(goNext, ms);
    onCleanup(() => clearInterval(timer));
  });

  createEffect(() => {
    const initialTrack = trackRef();
    if (!initialTrack) return;

    let rafId: number | undefined;
    const syncFromScroll = () => {
      if (rafId !== undefined) return;
      rafId = requestAnimationFrame(() => {
        rafId = undefined;
        const count = initialTrack.children.length;
        if (count === 0) return;
        const slideWidth = initialTrack.clientWidth;
        const index = Math.round(initialTrack.scrollLeft / slideWidth);
        const clamped = Math.max(0, Math.min(index, count - 1));
        setActiveIndex(clamped);
      });
    };

    initialTrack.addEventListener('scroll', syncFromScroll, { passive: true });
    onCleanup(() => {
      if (rafId !== undefined) cancelAnimationFrame(rafId);
      initialTrack.removeEventListener('scroll', syncFromScroll);
    });
  });

  const resolveSlideButtonLabel = (index: number) => ts('carousel.goToSlide', { index: index + 1 });

  const handleMouseEnter = () => {
    setHovered(true);
  };

  const handleMouseLeave = () => {
    setHovered(false);
  };

  return (
    <div
      {...rest}
      class={classNames(styles.carousel, local.class)}
      role="region"
      aria-roledescription="carousel"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div class={styles.track} ref={setTrackRef}>
        <For each={slides()}>{(slide) => <div class={styles.slide}>{slide}</div>}</For>
      </div>

      <MediaNavButton
        direction="prev"
        class={classNames(styles.arrow, styles.arrowPrev)}
        onClick={goPrev}
        label={previousSlideLabel()}
      />
      <MediaNavButton
        direction="next"
        class={classNames(styles.arrow, styles.arrowNext)}
        onClick={goNext}
        label={nextSlideLabel()}
      />

      <div class={styles.dots}>
        <For each={slides()}>
          {(_, i) => (
            <button
              type="button"
              class={classNames(styles.dot, i() === activeIndex() && styles.dotActive)}
              onClick={() => scrollTo(i())}
              aria-label={resolveSlideButtonLabel(i())}
            />
          )}
        </For>
      </div>
    </div>
  );
};

export type { CarouselOwnProps };
export default Carousel;
