import { Show } from 'solid-js';
import { Portal } from 'solid-js/web';

import { createModalRoot } from '../feedback/createModalRoot';
import styles from './Lightbox.module.css';
import { LightboxPanel } from './LightboxPanel';
import type { LightboxProps } from './lightboxTypes';

export type { LightboxProps } from './lightboxTypes';
/** Full-screen image viewer: ←→ / Esc, click to zoom, thumbnail strip, focus trapped and restored. Controlled by index (−1 / null = closed). */
export const Lightbox = (props: LightboxProps) => {
  const openIndex = () => {
    const index = props.index;
    return index !== null && index >= 0 && index < props.images.length ? index : undefined;
  };
  const isOpen = () => openIndex() !== undefined;
  const ref = createModalRoot(isOpen, { onEscape: () => props.onClose?.() });
  return (
    <Show when={isOpen()}>
      <Portal>
        <LightboxPanel class={styles.root} lightbox={props} index={openIndex() ?? 0} ref={ref} />
      </Portal>
    </Show>
  );
};
