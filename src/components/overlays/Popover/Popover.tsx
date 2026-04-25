import { createMemo, createSignal, type JSX, Show, splitProps } from 'solid-js';

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

const positionClassByValue: Record<NonNullable<PopoverProps['position']>, string | undefined> = {
  top: styles.top,
  bottom: styles.bottom,
  left: styles.left,
  right: styles.right,
};

const Popover = (props: Props<PopoverProps>) => {
  const [local, rest] = splitProps(props, ['trigger', 'content', 'position', 'open', 'onOpenChange', 'class']);
  const [internalOpen, setInternalOpen] = createSignal(false);
  let rootRef: HTMLDivElement | undefined;

  const isOpen = () => local.open ?? internalOpen();

  const setOpen = (value: boolean) => {
    setInternalOpen(value);
    local.onOpenChange?.(value);
  };

  const toggle = () => setOpen(!isOpen());
  const close = () => setOpen(false);

  const position = createMemo(() => local.position ?? 'bottom');

  useClickOutside(() => rootRef, isOpen, close);

  useEscapeKey(isOpen, close);

  return (
    <div {...rest} ref={rootRef} class={classNames(styles.wrapper, local.class)}>
      {local.trigger({
        onClick: toggle,
      })}
      <Show when={isOpen()}>
        <Surface
          class={classNames(styles.content, positionClassByValue[position()])}
          role="dialog"
          aria-modal="false"
          radius="md"
          elevation="popover"
          blur
        >
          <Text as="p" variant="bodySm" tone="muted">
            {local.content}
          </Text>
        </Surface>
      </Show>
    </div>
  );
};

export default Popover;
