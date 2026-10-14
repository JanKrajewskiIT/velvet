import { createEffect, createMemo, createSignal, For, type JSX, mergeProps, onCleanup, onMount, Show } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { clamp } from '../../utils/math';
import { REDUCED_MOTION_QUERY } from '../../utils/motion';
import { nonNegativeNumber, positiveInteger } from '../../utils/numericOption';
import { IconButton } from '../actions/IconButton';

const DRAG_THRESHOLD_PX = 4;
const SWIPE_DISTANCE_PX = 50;
const DEFAULT_PER_VIEW = 1;
const DEFAULT_GAP_PX = 16;
const DEFAULT_AUTOPLAY_MS = 0;
const MAX_TIMER_MS = 2147483647;
const INDEPENDENT_CONTROL =
  'input,textarea,select,button,a[href],[contenteditable]:not([contenteditable="false"]),[role="slider"],[role="combobox"],[role="spinbutton"],[role="tab"],[role="menuitem"],[role="option"],[role="gridcell"],[role="treeitem"],[tabindex]:not([tabindex="-1"])';
const CAROUSEL_CONTROL = '.vui-carousel__arrow,.vui-carousel__dot,.vui-carousel__play';

export interface CarouselProps {
  slides: JSX.Element[];
  /** Slides visible at once. @default 1 */
  perView?: number;
  /** px. @default 16 */
  gap?: number;
  loop?: boolean;
  /** ms between slides; 0 = off. @default 0 */
  autoplay?: number;
  /** @default true */
  showDots?: boolean;
  /** @default true */
  showArrows?: boolean;
  /** Accessible name of the region. @default localized "Carousel" */
  label?: string;
  class?: string;
}

/** Horizontal slider with inert off-screen slides. Focus stops autoplay until explicitly resumed; hover pauses it temporarily. */
export const Carousel = (props: CarouselProps) => {
  const p = mergeProps(
    {
      perView: DEFAULT_PER_VIEW,
      gap: DEFAULT_GAP_PX,
      loop: false,
      autoplay: DEFAULT_AUTOPLAY_MS,
      showDots: true,
      showArrows: true,
    } satisfies Partial<CarouselProps>,
    props,
  );
  const translate = useTranslate();
  let viewport!: HTMLDivElement;
  let dragStartX: number | undefined;
  const [position, setPosition] = createSignal(0);
  const [hovered, setHovered] = createSignal(false);
  const [userPaused, setUserPaused] = createSignal(false);
  const [reducedMotion, setReducedMotion] = createSignal(false);
  const [dragOffset, setDragOffset] = createSignal(0);
  const [width, setWidth] = createSignal(0);

  const slides = createMemo(() => p.slides);
  const perView = () => positiveInteger(p.perView, DEFAULT_PER_VIEW);
  const gap = () => nonNegativeNumber(p.gap, DEFAULT_GAP_PX);
  const autoplay = () => Math.min(MAX_TIMER_MS, Math.trunc(nonNegativeNumber(p.autoplay, DEFAULT_AUTOPLAY_MS)));
  const max = () => Math.max(0, slides().length - perView());
  const index = () => Math.min(position(), max());
  const paused = () => userPaused() || hovered();
  const slideWidth = () => Math.max(0, (width() - gap() * (perView() - 1)) / perView());
  const offset = () => -(index() * (slideWidth() + gap())) + dragOffset();
  const dots = createMemo(() => Array.from({ length: max() + 1 }, (_, k) => k));
  const visible = (k: number) => k >= index() && k < index() + perView();
  const rotating = () => autoplay() > 0 && !paused() && !reducedMotion() && max() > 0;
  const go = (target: number) => {
    if (p.loop) setPosition(target < 0 ? max() : target > max() ? 0 : target);
    else setPosition(clamp(target, 0, max()));
  };

  onMount(() => {
    setWidth(viewport.clientWidth);
    const media = window.matchMedia(REDUCED_MOTION_QUERY);
    const onMotionChange = () => setReducedMotion(media.matches);
    onMotionChange();
    media.addEventListener('change', onMotionChange);
    onCleanup(() => media.removeEventListener('change', onMotionChange));
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(([entry]) => entry && setWidth(entry.contentRect.width));
    observer.observe(viewport);
    onCleanup(() => observer.disconnect());
  });

  createEffect(() => {
    if (!rotating()) return;
    const interval = autoplay();
    const timer = setInterval(() => setPosition((x) => (x >= max() ? 0 : x + 1)), interval);
    onCleanup(() => clearInterval(timer));
  });

  const endDrag = () => {
    dragStartX = undefined;
    setDragOffset(0);
  };

  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- region handles arrow keys bubbling from the focusable slide controls it contains
    <section
      class={cx('vui-carousel', p.class)}
      aria-roledescription={translate('velvet.media.carousel.roleDescription')}
      aria-label={p.label ?? translate('velvet.media.carousel.label')}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusIn={() => setUserPaused(true)}
      onKeyDown={(e) => {
        if (e.defaultPrevented || !(e.target instanceof Element)) return;
        if (e.target.closest(INDEPENDENT_CONTROL) && !e.target.closest(CAROUSEL_CONTROL)) return;
        if (e.key === 'ArrowRight') go(index() + 1);
        else if (e.key === 'ArrowLeft') go(index() - 1);
        else return;
        e.preventDefault();
      }}
    >
      <div
        ref={(element) => {
          viewport = element;
        }}
        class="vui-carousel__viewport"
        onPointerDown={(e) => {
          if (
            e.defaultPrevented ||
            (e.target instanceof Element &&
              (e.target.closest(INDEPENDENT_CONTROL) ||
                e.target.closest('.vui-carousel__viewport') !== e.currentTarget))
          )
            return;
          if (e.pointerType === 'mouse' && e.button !== 0) return;
          dragStartX = e.clientX;
        }}
        onPointerMove={(e) => {
          if (dragStartX === undefined) return;
          const distance = e.clientX - dragStartX;
          if (Math.abs(distance) <= DRAG_THRESHOLD_PX) return;
          e.currentTarget.setPointerCapture(e.pointerId);
          setDragOffset(distance);
        }}
        onPointerUp={() => {
          if (dragStartX === undefined) return;
          const distance = dragOffset();
          if (distance < -SWIPE_DISTANCE_PX) go(index() + 1);
          else if (distance > SWIPE_DISTANCE_PX) go(index() - 1);
          endDrag();
        }}
        onPointerCancel={endDrag}
        onLostPointerCapture={endDrag}
      >
        <div
          class={cx('vui-carousel__track', dragOffset() !== 0 && 'vui-carousel__track--drag')}
          style={{ gap: `${gap()}px`, transform: `translateX(${offset()}px)` }}
          aria-live={rotating() ? 'off' : 'polite'}
        >
          <For each={slides()}>
            {(slide, k) => (
              <div
                role="group"
                aria-roledescription={translate('velvet.media.carousel.slideRoleDescription')}
                aria-label={translate('velvet.media.carousel.slide', { index: k() + 1, count: slides().length })}
                aria-hidden={visible(k()) ? undefined : true}
                inert={visible(k()) ? undefined : true}
                class="vui-carousel__slide"
                style={{ flex: `0 0 ${slideWidth()}px` }}
              >
                {slide}
              </div>
            )}
          </For>
        </div>
      </div>
      <Show when={p.showArrows && slides().length > perView()}>
        <IconButton
          variant="raised"
          shape="circle"
          icon="chevron-left"
          label={translate('velvet.media.carousel.previous')}
          class="vui-carousel__arrow vui-carousel__arrow--prev"
          disabled={!p.loop && index() === 0}
          onClick={() => go(index() - 1)}
        />
        <IconButton
          variant="raised"
          shape="circle"
          icon="chevron-right"
          label={translate('velvet.media.carousel.next')}
          class="vui-carousel__arrow vui-carousel__arrow--next"
          disabled={!p.loop && index() >= max()}
          onClick={() => go(index() + 1)}
        />
      </Show>
      <Show when={(p.showDots && max() > 0) || autoplay() > 0}>
        <div class="vui-carousel__dots">
          <Show when={p.showDots && max() > 0}>
            <For each={dots()}>
              {(k) => (
                <button
                  type="button"
                  aria-label={translate('velvet.media.carousel.goTo', { index: k + 1 })}
                  aria-current={k === index() ? true : undefined}
                  class={cx('vui-carousel__dot', k === index() && 'vui-carousel__dot--on')}
                  onClick={() => setPosition(k)}
                />
              )}
            </For>
          </Show>
          <Show when={autoplay() > 0}>
            <IconButton
              variant="soft"
              shape="circle"
              size="xs"
              icon={userPaused() ? 'play' : 'pause'}
              label={
                userPaused()
                  ? translate('velvet.media.carousel.resumeAutoplay')
                  : translate('velvet.media.carousel.pauseAutoplay')
              }
              class="vui-carousel__play"
              onClick={() => setUserPaused(!userPaused())}
            />
          </Show>
        </div>
      </Show>
    </section>
  );
};
