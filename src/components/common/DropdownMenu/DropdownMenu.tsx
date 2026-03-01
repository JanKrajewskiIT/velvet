import { createSignal, type JSX, Show } from 'solid-js';

import useClickOutside from '../../../hooks/useClickOutside';
import useEscapeKey from '../../../hooks/useEscapeKey';
import type Props from '../../../models/Props';

import styles from './DropdownMenu.module.css';

interface DropdownMenuProps {
  trigger: JSX.Element;
  children: JSX.Element;
  label?: string;
}

const DropdownMenu = (props: Props<DropdownMenuProps>) => {
  const [open, setOpen] = createSignal(false);
  let menuRef: HTMLDivElement | undefined;

  const close = (): void => {
    setOpen(false);
  };

  useEscapeKey(() => open(), close);
  useClickOutside(
    () => menuRef,
    () => open(),
    close
  );

  const toggle = () => {
    setOpen(!open());
  };

  return (
    <div ref={menuRef} class={`${styles.wrapper} ${props.class ?? ''}`}>
      <button
        type="button"
        class={styles.trigger}
        onClick={toggle}
        aria-haspopup="true"
        aria-expanded={open()}
        aria-label={props.label}
      >
        {props.trigger}
      </button>
      <Show when={open()}>
        <div
          class={styles.menu}
          role="menu"
          tabIndex={0}
          onClick={() => {
            setOpen(false);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              setOpen(false);
            }
          }}
        >
          {props.children}
        </div>
      </Show>
    </div>
  );
};

export default DropdownMenu;
