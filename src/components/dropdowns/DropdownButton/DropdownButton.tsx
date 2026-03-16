import { IoChevronDown } from 'solid-icons/io';
import { createSignal, type JSX, Show } from 'solid-js';

import useClickOutside from '~/hooks/useClickOutside';
import useEscapeKey from '~/hooks/useEscapeKey';
import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import Button, { type ButtonSize } from '../../buttons/Button/Button';
import DropdownSurface from '../../inputs/shared/DropdownSurface';
import styles from './DropdownButton.module.css';

interface DropdownButtonProps {
  label: JSX.Element;
  variant?: 'primary' | 'ghost';
  size?: ButtonSize;
  children: JSX.Element;
}

const DropdownButton = (props: Props<DropdownButtonProps>) => {
  const [open, setOpen] = createSignal(false);
  let wrapperRef: HTMLDivElement | undefined;

  const close = (): void => {
    setOpen(false);
  };

  useEscapeKey(() => open(), close);

  useClickOutside(
    () => wrapperRef,
    () => open(),
    close
  );

  const toggle = () => setOpen(!open());

  const handleMenuKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      close();
    }
  };

  return (
    <div ref={wrapperRef} class={`${styles.wrapper} ${props.class ?? ''}`}>
      <Button
        class={styles.trigger}
        variant={props.variant ?? 'ghost'}
        size={props.size ?? 'md'}
        onClick={toggle}
        aria-haspopup="menu"
        aria-expanded={open()}
      >
        {props.label}
        <IoChevronDown class={classNames(styles.chevron, open() && styles.chevronOpen)} />
      </Button>
      <Show when={open()}>
        <DropdownSurface
          class={styles.menu}
          role="menu"
          tabIndex={-1}
          onClick={close}
          onKeyDown={handleMenuKeyDown}
          scrollable={false}
        >
          {props.children}
        </DropdownSurface>
      </Show>
    </div>
  );
};

export default DropdownButton;
