import { IoChevronDown } from 'solid-icons/io';
import { createSignal, type JSX, Show } from 'solid-js';

import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import useClickOutside from '../../../hooks/useClickOutside';
import useEscapeKey from '../../../hooks/useEscapeKey';
import ButtonBase from '../shared/ButtonBase';
import DropdownSurface from '../shared/DropdownSurface';
import styles from './DropdownButton.module.css';

interface DropdownButtonProps {
  label: JSX.Element;
  variant?: 'primary' | 'ghost';
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
      <ButtonBase
        class={styles.trigger}
        variant={props.variant ?? 'ghost'}
        onClick={toggle}
        aria-haspopup="menu"
        aria-expanded={open()}
      >
        {props.label}
        <IoChevronDown class={classNames(styles.chevron, open() && styles.chevronOpen)} />
      </ButtonBase>
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
