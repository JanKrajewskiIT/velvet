import { createMemo, createUniqueId, type JSX, Show, splitProps } from 'solid-js';

import IconButton from '~/components/buttons/IconButton/IconButton';
import useDropdownPanel from '~/hooks/useDropdownPanel';
import { useI18n } from '~/i18n/I18nProvider';
import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import DropdownSurface from '../Dropdown/DropdownSurface/DropdownSurface';
import styles from './DropdownMenu.module.css';

interface DropdownMenuMessages {
  triggerAriaLabel?: string;
  menuAriaLabel?: string;
}

interface DropdownMenuProps {
  trigger: JSX.Element;
  children: JSX.Element;
  label?: string;
  messages?: DropdownMenuMessages;
}

const DropdownMenu = (props: Props<DropdownMenuProps>) => {
  const { t } = useI18n();
  const [local, rest] = splitProps(props, ['class', 'trigger', 'children', 'label', 'messages']);
  const menuId = createUniqueId();
  let menuRef: HTMLDivElement | undefined;
  let panelRef: HTMLDivElement | undefined;
  let triggerRef: HTMLButtonElement | undefined;
  const dropdown = useDropdownPanel({
    rootRef: () => menuRef,
    panelRef: () => panelRef,
    triggerRef: () => triggerRef,
    focusTriggerOnTab: true,
  });
  const triggerAriaLabel = createMemo(() => local.messages?.triggerAriaLabel ?? local.label ?? t('dropdown.openMenu'));
  const menuAriaLabel = createMemo(() => local.messages?.menuAriaLabel ?? t('common.menuOptions'));

  const toggle = () => {
    if (dropdown.open()) {
      dropdown.close();
      return;
    }
    dropdown.openAndFocus('first');
  };

  const handleTriggerKeyDown = (e: KeyboardEvent) => {
    dropdown.openFromKeyboard(e, { ignoreWhenOpen: true });
  };

  return (
    <div {...rest} ref={menuRef} class={classNames(styles.wrapper, local.class)}>
      <IconButton
        ref={triggerRef}
        icon={local.trigger}
        label={triggerAriaLabel()}
        onClick={toggle}
        onKeyDown={handleTriggerKeyDown}
        aria-haspopup="menu"
        aria-expanded={dropdown.open()}
        aria-controls={dropdown.open() ? menuId : undefined}
        variant="subtle"
        size="sm"
      />
      <Show when={dropdown.open()}>
        <DropdownSurface
          ref={panelRef}
          id={menuId}
          class={styles.menu}
          align="left"
          origin="topLeft"
          role="menu"
          aria-label={menuAriaLabel()}
          tabIndex={-1}
          onKeyDown={dropdown.handlePanelKeyDown}
          onClick={dropdown.close}
        >
          {local.children}
        </DropdownSurface>
      </Show>
    </div>
  );
};

export default DropdownMenu;
export type { DropdownMenuMessages, DropdownMenuProps };
