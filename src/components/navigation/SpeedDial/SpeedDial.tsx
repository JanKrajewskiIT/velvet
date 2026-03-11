import { FiPlus } from 'solid-icons/fi';
import { createSignal, For, type JSX, Show } from 'solid-js';

import type Props from '~/models/Props';

import useClickOutside from '../../../hooks/useClickOutside';
import styles from './SpeedDial.module.css';

export interface SpeedDialAction {
  icon: JSX.Element;
  label: string;
  onClick: () => void;
}

interface SpeedDialProps {
  actions: SpeedDialAction[];
  icon?: JSX.Element;
  position?: 'bottom-right' | 'bottom-left';
  direction?: 'up' | 'left';
}

const SpeedDial = (props: Props<SpeedDialProps>) => {
  const [open, setOpen] = createSignal(false);
  let containerRef: HTMLDivElement | undefined;

  useClickOutside(
    () => containerRef,
    open,
    () => setOpen(false)
  );

  const position = () => props.position ?? 'bottom-right';
  const direction = () => props.direction ?? 'up';

  const toggle = () => setOpen((prev) => !prev);

  const handleAction = (action: SpeedDialAction) => {
    action.onClick();
    setOpen(false);
  };

  const tooltipSide = () => (position() === 'bottom-right' ? 'left' : 'right');

  return (
    <div ref={containerRef} class={`${styles.speedDial} ${styles[position()]} ${props.class ?? ''}`}>
      <Show when={open()}>
        <div class={`${styles.actions} ${styles[direction()]}`}>
          <For each={props.actions}>
            {(action, index) => (
              <div class={styles.actionWrapper} style={{ 'animation-delay': `${index() * 30}ms` }}>
                <span class={`${styles.tooltip} ${styles[tooltipSide()]}`}>{action.label}</span>
                <button
                  type="button"
                  class={styles.actionButton}
                  onClick={() => handleAction(action)}
                  aria-label={action.label}
                >
                  {action.icon}
                </button>
              </div>
            )}
          </For>
        </div>
      </Show>
      <button
        type="button"
        class={`${styles.fab} ${open() ? styles.fabOpen : ''}`}
        onClick={toggle}
        aria-expanded={open()}
        aria-label={open() ? 'Close actions' : 'Open actions'}
      >
        <span class={styles.fabIcon}>{props.icon ?? <FiPlus size={24} />}</span>
      </button>
    </div>
  );
};

export default SpeedDial;
