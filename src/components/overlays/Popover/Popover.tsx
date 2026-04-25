import { createMemo, createSignal, type JSX, splitProps } from 'solid-js';

import Floating from '~/components/overlays/Floating/Floating';
import useClickOutside from '~/hooks/useClickOutside';
import useEscapeKey from '~/hooks/useEscapeKey';
import type Props from '~/models/Props';
import type { ButtonCoreNativeProps } from '~/models/Props';
import classNames from '~/utils/classNames';
import arrow from '~/utils/floating/middleware/arrow';
import type { Placement } from '~/utils/floating/types';

import Surface from '../../surfaces/Surface/Surface';
import Text from '../../typography/Text/Text';
import styles from './Popover.module.css';

type PopoverPosition = 'top' | 'bottom' | 'left' | 'right';

interface PopoverProps {
  trigger: (triggerProps: ButtonCoreNativeProps) => JSX.Element;
  content: string;
  position?: PopoverPosition;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const placementByPosition: Record<PopoverPosition, Placement> = {
  top: 'top',
  bottom: 'bottom',
  left: 'left',
  right: 'right',
};

const POPOVER_OFFSET = 8;

const Popover = (props: Props<PopoverProps>) => {
  const [local, rest] = splitProps(props, ['trigger', 'content', 'position', 'open', 'onOpenChange', 'class']);
  const [internalOpen, setInternalOpen] = createSignal(false);
  const [rootRef, setRootRef] = createSignal<HTMLDivElement | undefined>(undefined);
  const [floatingEl, setFloatingEl] = createSignal<HTMLDivElement | undefined>(undefined);
  const [arrowRef, setArrowRef] = createSignal<HTMLSpanElement | undefined>(undefined);

  const isOpen = (): boolean => local.open ?? internalOpen();

  const setOpen = (value: boolean): void => {
    setInternalOpen(value);
    local.onOpenChange?.(value);
  };

  const toggle = (): void => setOpen(!isOpen());
  const close = (): void => setOpen(false);

  const placement = createMemo<Placement>(() => placementByPosition[local.position ?? 'bottom']);

  useClickOutside(rootRef, isOpen, close, floatingEl);
  useEscapeKey(isOpen, close);

  const middleware = () => [arrow({ element: () => arrowRef() })];

  return (
    <div {...rest} ref={setRootRef} class={classNames(styles.wrapper, local.class)}>
      {local.trigger({ onClick: toggle })}
      <Floating
        anchor={rootRef}
        open={isOpen()}
        placement={placement()}
        offset={POPOVER_OFFSET}
        padding={8}
        extraMiddleware={middleware()}
        ref={setFloatingEl}
      >
        <Surface class={styles.content} role="dialog" aria-modal="false" radius="md" elevation="popover" blur>
          <Text as="p" variant="bodySm" tone="muted">
            {local.content}
          </Text>
          <span ref={setArrowRef} class={styles.arrow} aria-hidden="true" />
        </Surface>
      </Floating>
    </div>
  );
};

export default Popover;
