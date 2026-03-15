import { createSignal, type JSX, Show } from 'solid-js';

import useClickOutside from '~/hooks/useClickOutside';
import useEscapeKey from '~/hooks/useEscapeKey';
import type Props from '~/models/Props';

import ButtonBase from '../../inputs/shared/ButtonBase';
import styles from './Popover.module.css';

interface PopoverProps {
  trigger: JSX.Element;
  content: JSX.Element;
  position?: 'top' | 'bottom' | 'left' | 'right';
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const Popover = (props: Props<PopoverProps>) => {
  const [internalOpen, setInternalOpen] = createSignal(false);
  let contentRef: HTMLDivElement | undefined;

  const isOpen = () => props.open ?? internalOpen();

  const setOpen = (value: boolean) => {
    setInternalOpen(value);
    props.onOpenChange?.(value);
  };

  const toggle = () => setOpen(!isOpen());
  const close = () => setOpen(false);

  const position = () => props.position ?? 'bottom';

  useClickOutside(() => contentRef, isOpen, close);

  useEscapeKey(isOpen, close);

  return (
    <div class={`${styles.wrapper} ${props.class ?? ''}`}>
      <ButtonBase class={styles.trigger} onClick={toggle} aria-haspopup="dialog" aria-expanded={isOpen()}>
        {props.trigger}
      </ButtonBase>
      <Show when={isOpen()}>
        <div ref={contentRef} class={`${styles.content} ${styles[position()]}`} role="dialog" aria-modal="false">
          {props.content}
        </div>
      </Show>
    </div>
  );
};

export default Popover;
