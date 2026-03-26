import { FiChevronDown } from 'solid-icons/fi';
import { createUniqueId, type JSX, Show } from 'solid-js';

import Button from '~/components/buttons/Button/Button';
import useDropdownPanel from '~/hooks/useDropdownPanel';
import type Props from '~/models/Props';
import type { ComponentSize } from '~/models/Props';
import classNames from '~/utils/classNames';

import DropdownSurface from '../Dropdown/DropdownSurface/DropdownSurface';
import DropdownTriggerContent from '../Dropdown/DropdownTriggerContent/DropdownTriggerContent';
import styles from './DropdownButton.module.css';

interface DropdownButtonProps {
  label: string;
  variant?: 'primary' | 'ghost';
  size?: ComponentSize;
  children: JSX.Element;
}

const DropdownButton = (props: Props<DropdownButtonProps>) => {
  const menuId = createUniqueId();
  let wrapperRef: HTMLDivElement | undefined;
  let panelRef: HTMLDivElement | undefined;
  let triggerRef: HTMLButtonElement | undefined;
  const dropdown = useDropdownPanel({
    rootRef: () => wrapperRef,
    panelRef: () => panelRef,
    triggerRef: () => triggerRef,
    focusTriggerOnTab: true,
  });

  const handleTriggerKeyDown = (event: KeyboardEvent) => {
    dropdown.openFromKeyboard(event, { ignoreWhenOpen: true });
  };

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
          onKeyDown={dropdown.handlePanelKeyDown}
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
