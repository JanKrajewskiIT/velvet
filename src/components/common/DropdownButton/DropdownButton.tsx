import { IoChevronDown } from 'solid-icons/io';
import { createSignal, type JSX, Show } from 'solid-js';

import useClickOutside from '../../../hooks/useClickOutside';
import useEscapeKey from '../../../hooks/useEscapeKey';
import type Props from '../../../models/Props';

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

  return (
    <div ref={wrapperRef} class={`${styles.wrapper} ${props.class ?? ''}`}>
      <button
        type="button"
        class={`${styles.trigger} ${styles[props.variant ?? 'ghost']}`}
        onClick={() => setOpen(!open())}
        aria-haspopup="true"
        aria-expanded={open()}
      >
        {props.label}
        <IoChevronDown
          class={`${styles.chevron} ${open() ? styles.chevronOpen : ''}`}
        />
      </button>
      <Show when={open()}>
        <div
          class={styles.menu}
          role="menu"
          tabindex="-1"
          onClick={() => setOpen(false)}
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

export default DropdownButton;
