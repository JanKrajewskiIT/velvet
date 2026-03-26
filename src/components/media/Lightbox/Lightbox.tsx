import { IoClose } from 'solid-icons/io';
import { createEffect, createMemo, createSignal, type JSX, onCleanup, Show, splitProps } from 'solid-js';
import { Portal } from 'solid-js/web';

import IconButton from '~/components/buttons/IconButton/IconButton';
import Text from '~/components/typography/Text/Text';
import useEscapeKey from '~/hooks/useEscapeKey';
import useFocusTrap from '~/hooks/useFocusTrap';
import { useI18n } from '~/i18n/I18nProvider';
import type Props from '~/models/Props';
import type { DivCoreNativeProps } from '~/models/Props';
import classNames from '~/utils/classNames';

import MediaNavButton from '../MediaNavButton/MediaNavButton';
import styles from './Lightbox.module.css';

export interface LightboxImage {
  src: string;
  alt?: string;
  caption?: string;
}

interface LightboxMessages {
  closeLabel?: string;
  previousLabel?: string;
  nextLabel?: string;
}

interface LightboxOwnProps extends Omit<DivCoreNativeProps, 'onClose'> {
  images: LightboxImage[];
  open: boolean;
  onClose: () => void;
  startIndex?: number;
  closeLabel?: string;
  previousLabel?: string;
  nextLabel?: string;
  messages?: LightboxMessages;
}

const Lightbox = (props: Props<LightboxOwnProps>) => {
  const { t } = useI18n();
  const [local, rest] = splitProps(props, [
    'images',
    'open',
    'onClose',
    'startIndex',
    'closeLabel',
    'previousLabel',
    'nextLabel',
    'messages',
    'class',
  ]);

  const [currentIndex, setCurrentIndex] = createSignal(0);
  let overlayRef: HTMLDivElement | undefined;

  const closeLabel = () => local.messages?.closeLabel ?? local.closeLabel ?? t('common.close');
  const previousLabel = () => local.messages?.previousLabel ?? local.previousLabel ?? t('common.previous');
  const nextLabel = () => local.messages?.nextLabel ?? local.nextLabel ?? t('common.next');
  const total = () => local.images.length;
  const hasManyImages = () => total() > 1;
  const isVisible = () => local.open && total() > 0;
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
    () => local.onClose()
  );

  useFocusTrap(
    () => overlayRef,
    () => isVisible()
  );

  createEffect(() => {
    const maxIndex = Math.max(total() - 1, 0);
    const startIndex = local.startIndex ?? 0;
    setCurrentIndex(Math.min(Math.max(startIndex, 0), maxIndex));
  });

  createEffect(() => {
    if (typeof document === 'undefined') return;

    if (isVisible()) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
    }

    onCleanup(() => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
    });
  });

  return (
    <Show when={isVisible()}>
      <Portal>
        <div
          {...rest}
          ref={overlayRef}
          role="dialog"
          aria-modal="true"
          aria-label={t('lightbox.imageViewer')}
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
            <Text as="span" variant="bodySm" tone="inverse" class={styles.counter} style={{ opacity: '0.7' }}>
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
            <Text as="p" variant="bodySm" tone="inverse" class={styles.caption} style={{ opacity: '0.8' }}>
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
