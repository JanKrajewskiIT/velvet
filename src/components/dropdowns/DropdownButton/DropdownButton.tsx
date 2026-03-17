import { type JSX, Show } from 'solid-js';

import Button, { type ButtonSize } from '~/components/buttons/Button/Button';
import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import DropdownSurface from '../DropdownSurface/DropdownSurface';
import DropdownTriggerContent from '../DropdownTriggerContent/DropdownTriggerContent';
import useDropdownState from '../shared/useDropdownState';
import styles from './DropdownButton.module.css';

interface DropdownButtonProps {
  label: JSX.Element;
  variant?: 'primary' | 'ghost';
  size?: ButtonSize;
  children: JSX.Element;
}

const DropdownButton = (props: Props<DropdownButtonProps>) => {
  let wrapperRef: HTMLDivElement | undefined;
  const dropdown = useDropdownState(() => wrapperRef);

  return (
    <div ref={wrapperRef} class={classNames(styles.wrapper, props.class)}>
      <Button
        class={styles.trigger}
        variant={props.variant ?? 'ghost'}
        size={props.size ?? 'md'}
        onClick={dropdown.toggle}
        aria-haspopup="menu"
        aria-expanded={dropdown.open()}
      >
        <DropdownTriggerContent label={props.label} open={dropdown.open()} class={styles.triggerContent} />
      </Button>
      <Show when={dropdown.open()}>
        <DropdownSurface
          class={styles.menu}
          align="left"
          origin="topLeft"
          role="menu"
          tabIndex={-1}
          onClick={dropdown.close}
          scrollable={false}
        >
          {props.children}
        </DropdownSurface>
      </Show>
    </div>
  );
};

export default DropdownButton;
