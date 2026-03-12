import { FiX } from 'solid-icons/fi';
import { createEffect, createSignal, createUniqueId, type JSX, Show } from 'solid-js';
import { Portal } from 'solid-js/web';

import type Props from '~/models/Props';

import useEscapeKey from '../../../hooks/useEscapeKey';
import useFocusTrap from '../../../hooks/useFocusTrap';
import IconButton from '../../inputs/IconButton/IconButton';
import styles from './Drawer.module.css';

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  closeLabel: string;
  title: JSX.Element;
  subtitle?: JSX.Element;
  children?: JSX.Element;
  actions?: JSX.Element;
}

const Drawer = (props: Props<DrawerProps>) => {
  const [entered, setEntered] = createSignal(false);
  const titleId = createUniqueId();
  const [drawerRef, setDrawerRef] = createSignal<HTMLElement | undefined>();

  useEscapeKey(
    () => props.open,
    () => props.onClose()
  );

  useFocusTrap(drawerRef, () => props.open);

  createEffect(() => {
    if (!props.open) {
      setEntered(false);
      return;
    }

    if (typeof window === 'undefined') {
      setEntered(true);
      return;
    }

    setEntered(false);
    requestAnimationFrame(() => setEntered(true));
  });

  return (
    <Show when={props.open}>
      <Portal>
        <div
          class={`${styles.overlay} ${entered() ? styles.overlayVisible : ''}`}
          aria-hidden="true"
          onClick={() => props.onClose()}
        />
        <div
          ref={setDrawerRef}
          class={`${styles.drawer} ${entered() ? styles.drawerVisible : ''} ${props.class ?? ''}`}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
        >
          <div class={styles.header}>
            <div class={styles.titleBlock}>
              <h2 id={titleId} class={styles.name}>
                {props.title}
              </h2>
              <Show when={props.subtitle}>
                <p class={styles.subtitle}>{props.subtitle}</p>
              </Show>
            </div>
            <IconButton icon={<FiX />} title={props.closeLabel} onClick={() => props.onClose()} />
          </div>

          <Show when={props.children}>
            <div class={styles.body}>{props.children}</div>
          </Show>

          <Show when={props.actions}>
            <div class={styles.footer}>{props.actions}</div>
          </Show>
        </div>
      </Portal>
    </Show>
  );
};

export default Drawer;
