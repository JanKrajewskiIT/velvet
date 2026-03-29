import { createSignal, type JSX, Show } from 'solid-js';

import useClickOutside from '~/hooks/useClickOutside';
import useEscapeKey from '~/hooks/useEscapeKey';
import type Props from '~/models/Props';
import type { ButtonCoreNativeProps } from '~/models/Props';
import classNames from '~/utils/classNames';

import Surface from '../../surfaces/Surface/Surface';
import Text from '../../typography/Text/Text';
import styles from './Popover.module.css';

interface PopoverProps {
  trigger: (triggerProps: ButtonCoreNativeProps) => JSX.Element;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const Popover = (props: Props<PopoverProps>) => {
  const [internalOpen, setInternalOpen] = createSignal(false);
  let rootRef: HTMLDivElement | undefined;

  const isOpen = () => props.open ?? internalOpen();

  const setOpen = (value: boolean) => {
    setInternalOpen(value);
    props.onOpenChange?.(value);
  };

  const toggle = () => setOpen(!isOpen());
  const close = () => setOpen(false);

  const position = () => props.position ?? 'bottom';

  useClickOutside(() => rootRef, isOpen, close);

  useEscapeKey(isOpen, close);

  return (
    <div ref={rootRef} class={classNames(styles.wrapper, props.class)}>
      {props.trigger({
        onClick: toggle,
      })}
      <Show when={isOpen()}>
        <Surface
          class={classNames(styles.content, styles[position()])}
          role="dialog"
          aria-modal="false"
          radius="md"
          elevation="popover"
          blur
        >
          <Text as="p" variant="bodySm" tone="muted">
            {props.content}
          </Text>
        </Surface>
      </Show>
    </div>
  );
};

export default Popover;
