import { FiX } from 'solid-icons/fi';
import { createSignal, type JSX, onMount, Show } from 'solid-js';
import { Portal } from 'solid-js/web';

import type Props from '../../../models/Props';
import IconButton from '../IconButton/IconButton';
import styles from './Drawer.module.css';

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  closeLabel: string;
  title: JSX.Element;
  subtitle?: JSX.Element;
  children: JSX.Element;
}

const Drawer = (props: Props<DrawerProps>) => {
  const [entered, setEntered] = createSignal(false);

  onMount(() => {
    requestAnimationFrame(() => setEntered(true));
  });

  return (
    <Show when={props.open}>
      <Portal>
        <div
          class={`${styles.overlay} ${entered() ? styles.overlayVisible : ''}`}
          role="button"
          tabIndex={-1}
          onClick={() => props.onClose()}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') props.onClose();
          }}
        />
        <div
          class={`${styles.drawer} ${entered() ? styles.drawerVisible : ''} ${props.class ?? ''}`}
        >
          <div class={styles.header}>
            <div class={styles.titleBlock}>
              <h2 class={styles.name}>{props.title}</h2>
              <Show when={props.subtitle}>
                <p class={styles.subtitle}>{props.subtitle}</p>
              </Show>
            </div>
            <IconButton
              icon={<FiX />}
              title={props.closeLabel}
              onClick={() => props.onClose()}
            />
          </div>
          <div class={styles.body}>{props.children}</div>
        </div>
      </Portal>
    </Show>
  );
};

export default Drawer;
