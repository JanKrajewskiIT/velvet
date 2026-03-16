import { FiPlus } from 'solid-icons/fi';
import { createSignal, createUniqueId, For, type JSX, Show } from 'solid-js';

import useClickOutside from '~/hooks/useClickOutside';
import useEscapeKey from '~/hooks/useEscapeKey';
import type Props from '~/models/Props';

import Button from '../../buttons/Button/Button';
import Tooltip from '../../overlays/Tooltip/Tooltip';
import styles from './SpeedDial.module.css';

export interface SpeedDialAction {
  icon: JSX.Element;
  label: string;
  onClick: () => void;
}

interface SpeedDialProps {
  actions: SpeedDialAction[];
  icon?: JSX.Element;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'inline';
  direction?: 'up' | 'down' | 'left' | 'right';
  actionsLabel?: string;
  openLabel?: string;
  closeLabel?: string;
}

const SpeedDial = (props: Props<SpeedDialProps>) => {
  const [open, setOpen] = createSignal(false);
  const menuId = createUniqueId();
  let containerRef: HTMLDivElement | undefined;

  useClickOutside(
    () => containerRef,
    open,
    () => setOpen(false)
  );

  useEscapeKey(open, () => setOpen(false));

  const position = () => props.position ?? 'bottom-right';
  const direction = () => props.direction ?? 'up';
  const actionsLabel = () => props.actionsLabel ?? 'Quick actions';
  const hasActions = () => props.actions.length > 0;
  const openLabel = () => props.openLabel ?? 'Open quick actions';
  const closeLabel = () => props.closeLabel ?? 'Close quick actions';

  const toggle = () => {
    if (!hasActions()) return;
    setOpen((prev) => !prev);
  };

  const handleAction = (action: SpeedDialAction) => {
    action.onClick();
    setOpen(false);
  };

  const tooltipPosition = (): 'top' | 'bottom' | 'left' | 'right' => {
    if (direction() === 'left') return 'top';
    if (direction() === 'right') return 'top';
    if (position() === 'bottom-right' || position() === 'top-right') return 'left';
    return 'right';
  };

  return (
    <div ref={containerRef} class={`${styles.speedDial} ${styles[position()]} ${props.class ?? ''}`}>
      <Show when={open() && hasActions()}>
        <div id={menuId} class={`${styles.actions} ${styles[direction()]}`} role="menu" aria-label={actionsLabel()}>
          <For each={props.actions}>
            {(action, index) => (
              <div class={styles.actionWrapper} style={{ '--action-delay': `${index() * 30}ms` }}>
                <Tooltip content={action.label} position={tooltipPosition()}>
                  <Button
                    variant="ghost"
                    size="sm"
                    iconOnly
                    class={styles.actionButton}
                    onClick={() => handleAction(action)}
                    aria-label={action.label}
                    role="menuitem"
                  >
                    {action.icon}
                  </Button>
                </Tooltip>
              </div>
            )}
          </For>
        </div>
      </Show>
      <Button
        iconOnly
        size="lg"
        class={`${styles.fab} ${open() ? styles.fabOpen : ''}`}
        onClick={toggle}
        disabled={!hasActions()}
        aria-expanded={open()}
        aria-controls={menuId}
        aria-label={open() ? closeLabel() : openLabel()}
      >
        <span class={styles.fabIcon}>{props.icon ?? <FiPlus size={24} />}</span>
      </Button>
    </div>
  );
};

export default SpeedDial;
