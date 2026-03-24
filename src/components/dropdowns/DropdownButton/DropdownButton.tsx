import { FiChevronDown } from 'solid-icons/fi';
import { createUniqueId, type JSX, Show } from 'solid-js';

import Button, { type ButtonSize } from '~/components/buttons/Button/Button';
import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import DropdownSurface from '../DropdownSurface/DropdownSurface';
import DropdownTriggerContent from '../DropdownTriggerContent/DropdownTriggerContent';
import {
  createDropdownSurfaceKeyDownHandler,
  focusDropdownItem,
  getDropdownOpenTarget,
} from '../shared/dropdownKeyboard';
import useDropdownState from '../shared/useDropdownState';
import styles from './DropdownButton.module.css';

interface DropdownButtonProps {
  label: JSX.Element;
  variant?: 'primary' | 'ghost';
  size?: ButtonSize;
  children: JSX.Element;
}

const DropdownButton = (props: Props<DropdownButtonProps>) => {
  const menuId = createUniqueId();
  let wrapperRef: HTMLDivElement | undefined;
  let panelRef: HTMLDivElement | undefined;
  let triggerRef: HTMLButtonElement | undefined;
  const dropdown = useDropdownState(() => wrapperRef);

  const handleTriggerKeyDown = (event: KeyboardEvent) => {
    const target = getDropdownOpenTarget(event);
    if (!target) return;
    dropdown.openDropdown();
    requestAnimationFrame(() => {
      if (!panelRef) return;
      focusDropdownItem(panelRef, target);
    });
  };

  const handleMenuKeyDown = createDropdownSurfaceKeyDownHandler({
    getSurface: () => panelRef,
    closeDropdown: dropdown.close,
    focusTrigger: () => triggerRef?.focus(),
    focusTriggerOnTab: true,
  });

  return (
    <div ref={wrapperRef} class={classNames(styles.wrapper, props.class)}>
      <Button
        ref={triggerRef}
        class={styles.trigger}
        variant={props.variant ?? 'ghost'}
        size={props.size ?? 'md'}
        onClick={dropdown.toggle}
        onKeyDown={handleTriggerKeyDown}
        aria-haspopup="menu"
        aria-expanded={dropdown.open()}
        aria-controls={dropdown.open() ? menuId : undefined}
      >
        <DropdownTriggerContent
          label={props.label}
          tone={props.variant === 'primary' ? 'inverse' : 'default'}
          class={styles.triggerContent}
        >
          <span class={classNames(styles.chevron, dropdown.open() && styles.chevronOpen)}>
            <FiChevronDown />
          </span>
        </DropdownTriggerContent>
      </Button>
      <Show when={dropdown.open()}>
        <DropdownSurface
          ref={panelRef}
          id={menuId}
          class={styles.menu}
          align="left"
          origin="topLeft"
          role="menu"
          tabIndex={-1}
          onKeyDown={handleMenuKeyDown}
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
