import {
  children as resolveChildren,
  createEffect,
  createMemo,
  createSignal,
  For,
  type JSX,
  onCleanup,
  Show,
  splitProps,
} from 'solid-js';

import { useI18n } from '~/i18n/I18nProvider';
import type Props from '~/models/Props';
import type { DivCoreNativeProps } from '~/models/Props';
import classNames from '~/utils/classNames';

import MediaNavButton from '../MediaNavButton/MediaNavButton';
import styles from './Carousel.module.css';

interface CarouselOwnProps extends Omit<DivCoreNativeProps, 'children'> {
  children: JSX.Element;
  autoPlay?: boolean;
  interval?: number;
  showDots?: boolean;
  showArrows?: boolean;
}

const Carousel = (props: Props<CarouselOwnProps>) => {
  const { t } = useI18n();
  const [local, rest] = splitProps(props, ['children', 'autoPlay', 'interval', 'showDots', 'showArrows', 'class']);

  const resolved = resolveChildren(() => local.children);
  const [activeIndex, setActiveIndex] = createSignal(0);
  const [hovered, setHovered] = createSignal(false);
  const [trackRef, setTrackRef] = createSignal<HTMLDivElement | undefined>();

  const slides = createMemo(() => {
    const c = resolved();
    return Array.isArray(c) ? c : [c];
  });

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
    if (!local.autoPlay || hovered()) return;
    const ms = local.interval ?? 5000;
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

  const showArrows = () => local.showArrows ?? true;
  const showDots = () => local.showDots ?? true;

  return (
    <div
      {...rest}
      class={classNames(styles.carousel, local.class)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div class={styles.track} ref={setTrackRef}>
        <For each={slides()}>{(slide) => <div class={styles.slide}>{slide}</div>}</For>
      </div>

      <Show when={showArrows()}>
        <MediaNavButton
          direction="prev"
          class={classNames(styles.arrow, styles.arrowPrev)}
          onClick={goPrev}
          label={t('carousel.previousSlide')}
        />
        <MediaNavButton
          direction="next"
          class={classNames(styles.arrow, styles.arrowNext)}
          onClick={goNext}
          label={t('carousel.nextSlide')}
        />
      </Show>

      <Show when={showDots()}>
        <div class={styles.dots}>
          <For each={slides()}>
            {(_, i) => (
              <button
                type="button"
                class={classNames(styles.dot, i() === activeIndex() && styles.dotActive)}
                onClick={() => scrollTo(i())}
                aria-label={t('carousel.goToSlide', { index: i() + 1 })}
              />
            )}
          </For>
        </div>
      </Show>
    </div>
  );
};

export type { CarouselOwnProps };
export default Carousel;
