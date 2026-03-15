import { IoChevronBack, IoChevronForward, IoClose } from 'solid-icons/io';
import { createEffect, createSignal, onCleanup, Show } from 'solid-js';
import { Portal } from 'solid-js/web';

import useEscapeKey from '~/hooks/useEscapeKey';
import useFocusTrap from '~/hooks/useFocusTrap';
import type Props from '~/models/Props';

import IconButton from '../../inputs/IconButton/IconButton';
import Text from '../../typography/Text/Text';
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

interface LightboxProps {
  images: LightboxImage[];
  open: boolean;
  onClose: () => void;
  startIndex?: number;
  closeLabel?: string;
  previousLabel?: string;
  nextLabel?: string;
  messages?: LightboxMessages;
}

const Lightbox = (props: Props<LightboxProps>) => {
  const [currentIndex, setCurrentIndex] = createSignal(0);
  let overlayRef: HTMLDivElement | undefined;

  const closeLabel = () => props.messages?.closeLabel ?? props.closeLabel ?? 'Close';
  const previousLabel = () => props.messages?.previousLabel ?? props.previousLabel ?? 'Previous';
  const nextLabel = () => props.messages?.nextLabel ?? props.nextLabel ?? 'Next';
  const total = () => props.images.length;
  const currentImage = () => props.images[currentIndex()];

  const goPrev = () => {
    if (total() <= 1) return;
    setCurrentIndex((i) => (i > 0 ? i - 1 : total() - 1));
  };

  const goNext = () => {
    if (total() <= 1) return;
    setCurrentIndex((i) => (i < total() - 1 ? i + 1 : 0));
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') goPrev();
    if (e.key === 'ArrowRight') goNext();
  };

  useEscapeKey(
    () => props.open,
    () => props.onClose()
  );

  useFocusTrap(
    () => overlayRef,
    () => props.open
  );

  createEffect(() => {
    const maxIndex = Math.max(total() - 1, 0);
    const startIndex = props.startIndex ?? 0;
    setCurrentIndex(Math.min(Math.max(startIndex, 0), maxIndex));
  });

  createEffect(() => {
    if (typeof document === 'undefined') return;

    if (props.open) {
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
    <Show when={props.open}>
      <Portal>
        <div
          ref={overlayRef}
          role="dialog"
          aria-modal="true"
          aria-label={closeLabel()}
          class={`${styles.overlay} ${props.class ?? ''}`}
        >
          <button
            type="button"
            class={styles.backdrop}
            aria-label={closeLabel()}
            onClick={() => props.onClose()}
            tabIndex={-1}
          />
          <IconButton icon={<IoClose />} title={closeLabel()} class={styles.close} onClick={() => props.onClose()} />

          <Show when={total() > 1}>
            <span class={styles.counter}>
              {currentIndex() + 1} / {total()}
            </span>
          </Show>

          <div class={styles.imageContainer}>
            <Show when={total() > 1}>
              <IconButton
                icon={<IoChevronBack />}
                title={previousLabel()}
                class={`${styles.nav} ${styles.prev}`}
                onClick={goPrev}
              />
            </Show>

            <img class={styles.image} src={currentImage()?.src} alt={currentImage()?.alt ?? ''} draggable={false} />

            <Show when={total() > 1}>
              <IconButton
                icon={<IoChevronForward />}
                title={nextLabel()}
                class={`${styles.nav} ${styles.next}`}
                onClick={goNext}
              />
            </Show>
          </div>

          <Show when={currentImage()?.caption}>
            <Text as="p" class={styles.caption}>
              {currentImage()?.caption}
            </Text>
          </Show>
        </div>
      </Portal>
    </Show>
  );
};

export default Lightbox;
