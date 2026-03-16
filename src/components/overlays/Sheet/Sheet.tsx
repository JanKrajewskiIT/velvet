import { FiX } from 'solid-icons/fi';
import { createSignal, createUniqueId, type JSX, Show } from 'solid-js';
import { Portal } from 'solid-js/web';

import useEscapeKey from '~/hooks/useEscapeKey';
import useFocusTrap from '~/hooks/useFocusTrap';
import useOverlayAnimation from '~/hooks/useOverlayAnimation';
import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import IconButton from '../../buttons/IconButton/IconButton';
import Heading from '../../typography/Heading/Heading';
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
  const [panelRef, setPanelRef] = createSignal<HTMLElement | undefined>();
  const titleId = createUniqueId();
  const entered = useOverlayAnimation(() => props.open);

  const side = () => props.side ?? 'bottom';
  const size = () => props.size ?? 'md';

  useEscapeKey(
    () => props.open,
    () => props.onClose()
  );

  useFocusTrap(panelRef, () => props.open);

  const panelClass = () =>
    classNames(styles.panel, styles[side()], styles[size()], entered() && styles.panelVisible, props.class);

  return (
    <Show when={props.open}>
      <Portal>
        <div
          class={classNames(styles.overlay, entered() && styles.overlayVisible)}
          aria-hidden="true"
          onClick={() => props.onClose()}
        />
        <div
          ref={setPanelRef}
          class={panelClass()}
          role="dialog"
          aria-modal="true"
          aria-labelledby={props.title ? titleId : undefined}
        >
          <Show when={side() === 'bottom'}>
            <div class={styles.dragHandle} />
          </Show>
          <div class={styles.header}>
            <Show when={props.title}>
              <Heading as="h2" level={2} id={titleId} class={styles.title}>
                {props.title}
              </Heading>
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
