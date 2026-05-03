import { IoClose } from 'solid-icons/io';
import { createEffect, createMemo, createSignal, type JSX, on, onCleanup, Show, splitProps, untrack } from 'solid-js';
import { Portal } from 'solid-js/web';

import IconButton from '~/components/buttons/IconButton/IconButton';
import Text from '~/components/typography/Text/Text';
import useEscapeKey from '~/hooks/useEscapeKey';
import useFocusTrap from '~/hooks/useFocusTrap';
import { useI18n } from '~/i18n';
import type Props from '~/models/Props';
import type { DivCoreNativeProps } from '~/models/Props';
import classNames from '~/utils/classNames';

import MediaNavButton from '../MediaNavButton/MediaNavButton';
import styles from './Lightbox.module.css';

let lightboxOpenCount = 0;
let previousBodyOverflow: string | null = null;

const lockBodyScroll = () => {
  if (typeof document === 'undefined') return;
  if (lightboxOpenCount === 0) {
    previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
  }
  lightboxOpenCount += 1;
};

const unlockBodyScroll = () => {
  if (typeof document === 'undefined') return;
  if (lightboxOpenCount === 0) return;
  lightboxOpenCount -= 1;
  if (lightboxOpenCount === 0) {
    document.body.style.overflow = previousBodyOverflow ?? '';
    previousBodyOverflow = null;
  }
};

export interface LightboxImage {
  src: string;
  alt?: string;
  caption?: string;
}

interface LightboxOwnProps extends Omit<DivCoreNativeProps, 'onClose'> {
  images: LightboxImage[];
  open: boolean;
  onClose: () => void;
  startIndex?: number;
}

const Lightbox = (props: Props<LightboxOwnProps>) => {
  const { ts } = useI18n();
  const [local, rest] = splitProps(props, ['images', 'open', 'onClose', 'startIndex', 'class']);

  const [currentIndex, setCurrentIndex] = createSignal(0);
  let overlayRef: HTMLDivElement | undefined;

  const closeLabel = createMemo(() => ts('common.close'));
  const previousLabel = createMemo(() => ts('common.previous'));
  const nextLabel = createMemo(() => ts('common.next'));
  const viewerLabel = createMemo(() => ts('lightbox.imageViewer'));
  const total = createMemo(() => local.images.length);
  const hasManyImages = createMemo(() => total() > 1);
  const isVisible = createMemo(() => local.open && total() > 0);
  const currentImage = createMemo(() => local.images[currentIndex()]);

  const goPrev = () => {
    if (!hasManyImages()) return;
    setCurrentIndex((i) => (i > 0 ? i - 1 : total() - 1));
  };

  const goNext = () => {
    if (!hasManyImages()) return;
    setCurrentIndex((i) => (i < total() - 1 ? i + 1 : 0));
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') goPrev();
    if (e.key === 'ArrowRight') goNext();
  };

  const handleOverlayPointerDown: JSX.EventHandler<HTMLDivElement, PointerEvent> = (e) => {
    if (e.target === e.currentTarget) {
      local.onClose();
    }
  };

  useEscapeKey(
    () => isVisible(),
    () => local.onClose(),
  );

  useFocusTrap(
    () => overlayRef,
    () => isVisible(),
  );

  createEffect(
    on(
      () => local.startIndex ?? 0,
      (startIndex) => {
        const maxIndex = Math.max(untrack(total) - 1, 0);
        setCurrentIndex(Math.min(Math.max(startIndex, 0), maxIndex));
      },
    ),
  );

  createEffect(
    on(
      total,
      (nextTotal) => {
        const maxIndex = Math.max(nextTotal - 1, 0);
        setCurrentIndex((current) => Math.min(current, maxIndex));
      },
      { defer: true },
    ),
  );

  createEffect(
    on(isVisible, (visible) => {
      if (typeof document === 'undefined') return;
      if (!visible) return;

      lockBodyScroll();
      document.addEventListener('keydown', handleKeyDown);

      onCleanup(() => {
        document.removeEventListener('keydown', handleKeyDown);
        unlockBodyScroll();
      });
    }),
  );

  return (
    <Show when={isVisible()}>
      <Portal>
        <div
          {...rest}
          ref={overlayRef}
          role="dialog"
          aria-modal="true"
          aria-label={viewerLabel()}
          class={classNames(styles.overlay, local.class)}
          onPointerDown={handleOverlayPointerDown}
        >
          <IconButton
            icon={IoClose}
            label={closeLabel()}
            class={styles.close}
            variant="outline"
            size="sm"
            onClick={local.onClose}
          />

          <Show when={hasManyImages()}>
            <Text as="span" variant="bodySm" tone="inverse" class={styles.counter}>
              {currentIndex() + 1} / {total()}
            </Text>
          </Show>

          <div class={styles.imageContainer}>
            <Show when={hasManyImages()}>
              <MediaNavButton
                direction="prev"
                label={previousLabel()}
                class={classNames(styles.nav, styles.prev)}
                onClick={goPrev}
              />
            </Show>

            <img class={styles.image} src={currentImage()?.src} alt={currentImage()?.alt ?? ''} draggable={false} />

            <Show when={hasManyImages()}>
              <MediaNavButton
                direction="next"
                label={nextLabel()}
                class={classNames(styles.nav, styles.next)}
                onClick={goNext}
              />
            </Show>
          </div>

          <Show when={currentImage()?.caption}>
            <Text as="p" variant="bodySm" tone="inverse" class={styles.caption}>
              {currentImage()?.caption}
            </Text>
          </Show>
        </div>
      </Portal>
    </Show>
  );
};

export type { LightboxOwnProps };
export default Lightbox;
