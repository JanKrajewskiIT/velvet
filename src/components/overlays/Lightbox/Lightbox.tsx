import { IoChevronBack, IoChevronForward, IoClose } from 'solid-icons/io';
import { createEffect, createSignal, onCleanup, Show } from 'solid-js';
import { Portal } from 'solid-js/web';

import useEscapeKey from '~/hooks/useEscapeKey';
import type Props from '~/models/Props';

import styles from './Lightbox.module.css';

export interface LightboxImage {
  src: string;
  alt?: string;
  caption?: string;
}

interface LightboxProps {
  images: LightboxImage[];
  open: boolean;
  onClose: () => void;
  startIndex?: number;
  closeLabel?: string;
}

const Lightbox = (props: Props<LightboxProps>) => {
  const [currentIndex, setCurrentIndex] = createSignal(0);

  const closeLabel = () => props.closeLabel ?? 'Close';
  const total = () => props.images.length;
  const currentImage = () => props.images[currentIndex()];

  const goPrev = () => {
    setCurrentIndex((i) => (i > 0 ? i - 1 : total() - 1));
  };

  const goNext = () => {
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

  createEffect(() => {
    setCurrentIndex(props.startIndex ?? 0);
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
        <div role="dialog" aria-modal="true" aria-label={closeLabel()} class={`${styles.overlay} ${props.class ?? ''}`}>
          <button
            type="button"
            class={styles.backdrop}
            aria-label={closeLabel()}
            onClick={() => props.onClose()}
            tabIndex={-1}
          />
          <button class={styles.close} type="button" aria-label={closeLabel()} onClick={() => props.onClose()}>
            <IoClose />
          </button>

          <Show when={total() > 1}>
            <span class={styles.counter}>
              {currentIndex() + 1} / {total()}
            </span>
          </Show>

          <div class={styles.imageContainer}>
            <Show when={total() > 1}>
              <button class={`${styles.nav} ${styles.prev}`} type="button" aria-label="Previous" onClick={goPrev}>
                <IoChevronBack />
              </button>
            </Show>

            <img class={styles.image} src={currentImage()?.src} alt={currentImage()?.alt ?? ''} draggable={false} />

            <Show when={total() > 1}>
              <button class={`${styles.nav} ${styles.next}`} type="button" aria-label="Next" onClick={goNext}>
                <IoChevronForward />
              </button>
            </Show>
          </div>

          <Show when={currentImage()?.caption}>
            <p class={styles.caption}>{currentImage()?.caption}</p>
          </Show>
        </div>
      </Portal>
    </Show>
  );
};

export default Lightbox;
