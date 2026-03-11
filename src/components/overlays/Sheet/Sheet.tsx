import { FiX } from 'solid-icons/fi';
import { createEffect, createSignal, createUniqueId, type JSX, Show } from 'solid-js';
import { Portal } from 'solid-js/web';

import type Props from '~/models/Props';

import useEscapeKey from '../../../hooks/useEscapeKey';
import IconButton from '../../inputs/IconButton/IconButton';
import styles from './Sheet.module.css';

interface SheetProps {
  open: boolean;
  onClose: () => void;
  closeLabel: string;
  title?: JSX.Element;
  children?: JSX.Element;
  side?: 'bottom' | 'left' | 'right';
  size?: 'sm' | 'md' | 'lg';
}

const Sheet = (props: Props<SheetProps>) => {
  const [entered, setEntered] = createSignal(false);
  const titleId = createUniqueId();

  const side = () => props.side ?? 'bottom';
  const size = () => props.size ?? 'md';

  useEscapeKey(
    () => props.open,
    () => props.onClose()
  );

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

  const panelClass = () =>
    `${styles.panel} ${styles[side()]} ${styles[size()]} ${entered() ? styles.panelVisible : ''} ${props.class ?? ''}`;

  return (
    <Show when={props.open}>
      <Portal>
        <div
          class={`${styles.overlay} ${entered() ? styles.overlayVisible : ''}`}
          aria-hidden="true"
          onClick={() => props.onClose()}
        />
        <div class={panelClass()} role="dialog" aria-modal="true" aria-labelledby={props.title ? titleId : undefined}>
          <Show when={side() === 'bottom'}>
            <div class={styles.dragHandle} />
          </Show>
          <div class={styles.header}>
            <Show when={props.title}>
              <h2 id={titleId} class={styles.title}>
                {props.title}
              </h2>
            </Show>
            <IconButton icon={<FiX />} title={props.closeLabel} onClick={() => props.onClose()} />
          </div>
          <Show when={props.children}>
            <div class={styles.body}>{props.children}</div>
          </Show>
        </div>
      </Portal>
    </Show>
  );
};

export default Sheet;
