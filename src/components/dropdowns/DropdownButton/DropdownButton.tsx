import { FiChevronDown } from 'solid-icons/fi';
import { createMemo, createUniqueId, type JSX, Show, splitProps } from 'solid-js';

import Button from '~/components/buttons/Button/Button';
import {
  type ButtonVariant,
  DEFAULT_DROPDOWN_BUTTON_VARIANT,
  resolveDropdownTriggerTone,
} from '~/components/buttons/shared/buttonVariants';
import useDropdownPanel from '~/hooks/useDropdownPanel';
import type Props from '~/models/Props';
import type { ComponentSize } from '~/models/Props';
import classNames from '~/utils/classNames';

import DropdownSurface from '../Dropdown/DropdownSurface/DropdownSurface';
import DropdownTriggerContent from '../Dropdown/DropdownTriggerContent/DropdownTriggerContent';
import styles from './DropdownButton.module.css';

interface DropdownButtonProps {
  label: string;
  variant?: ButtonVariant;
  size?: ComponentSize;
  children: JSX.Element;
}

const DropdownButton = (props: Props<DropdownButtonProps>) => {
  const [local, rest] = splitProps(props, ['class', 'label', 'variant', 'size', 'children']);
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
  const variant = createMemo<ButtonVariant>(() => local.variant ?? DEFAULT_DROPDOWN_BUTTON_VARIANT);
  const size = createMemo(() => local.size ?? 'md');
  const triggerTone = createMemo(() => resolveDropdownTriggerTone(variant()));
  const wrapperClass = createMemo(() => classNames(styles.wrapper, local.class));

  return (
    <div {...rest} ref={wrapperRef} class={wrapperClass()}>
      <Button
        ref={triggerRef}
        class={styles.trigger}
        variant={variant()}
        size={size()}
        onClick={dropdown.toggle}
        onKeyDown={handleTriggerKeyDown}
        aria-haspopup="menu"
        aria-expanded={dropdown.open()}
        aria-controls={dropdown.open() ? menuId : undefined}
      >
        <DropdownTriggerContent label={local.label} tone={triggerTone()} size={size()} class={styles.triggerContent}>
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
          anchor={() => wrapperRef}
          role="menu"
          tabIndex={-1}
          onKeyDown={dropdown.handlePanelKeyDown}
          onClick={dropdown.close}
          scrollable={false}
        >
          {local.children}
        </DropdownSurface>
      </Show>
    </div>
  );
};

export default DropdownButton;
