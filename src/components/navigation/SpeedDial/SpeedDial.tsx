import { FiPlus } from 'solid-icons/fi';
import { createMemo, createSignal, createUniqueId, For, type JSX, Show, splitProps } from 'solid-js';

import useClickOutside from '~/hooks/useClickOutside';
import useEscapeKey from '~/hooks/useEscapeKey';
import { useI18n } from '~/i18n/I18nProvider';
import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import Button from '../../buttons/Button/Button';
import RoundIconButton from '../../buttons/RoundIconButton/RoundIconButton';
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
}

const positionClassByValue: Record<NonNullable<SpeedDialProps['position']>, string | undefined> = {
  'bottom-right': styles.bottomRight,
  'bottom-left': styles.bottomLeft,
  'top-right': styles.topRight,
  'top-left': styles.topLeft,
  inline: styles.inline,
};

const directionClassByValue: Record<NonNullable<SpeedDialProps['direction']>, string | undefined> = {
  up: styles.up,
  down: styles.down,
  left: styles.left,
  right: styles.right,
};

const SpeedDial = (props: Props<SpeedDialProps>) => {
  const { ts } = useI18n();
  const [local, rest] = splitProps(props, ['class', 'actions', 'icon', 'position', 'direction']);
  const [open, setOpen] = createSignal(false);
  const menuId = createUniqueId();
  let containerRef: HTMLDivElement | undefined;

  useClickOutside(
    () => containerRef,
    open,
    () => setOpen(false),
  );

  useEscapeKey(open, () => setOpen(false));

  const position = createMemo(() => local.position ?? 'bottom-right');
  const direction = createMemo(() => local.direction ?? 'up');
  const hasActions = createMemo(() => local.actions.length > 0);

  const toggle = () => {
    if (!hasActions()) return;
    setOpen((prev) => !prev);
  };

  const handleAction = (action: SpeedDialAction) => {
    action.onClick();
    setOpen(false);
  };

  const tooltipPosition = createMemo<'top' | 'bottom' | 'left' | 'right'>(() => {
    if (direction() === 'left') return 'top';
    if (direction() === 'right') return 'top';
    if (position() === 'bottom-right' || position() === 'top-right') return 'left';
    return 'right';
  });

  return (
    <div
      {...rest}
      ref={containerRef}
      class={classNames(styles.speedDial, positionClassByValue[position()], local.class)}
    >
      <Show when={open() && hasActions()}>
        <div
          id={menuId}
          class={classNames(styles.actions, directionClassByValue[direction()])}
          role="menu"
          aria-label={ts('speedDial.actions')}
        >
          <For each={local.actions}>
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
      <RoundIconButton
        size="lg"
        class={classNames(styles.fab, open() && styles.fabOpen)}
        onClick={toggle}
        disabled={!hasActions()}
        aria-expanded={open()}
        aria-controls={menuId}
        label={open() ? ts('speedDial.close') : ts('speedDial.open')}
        elevation="glow"
        icon={<span class={styles.fabIcon}>{local.icon ?? <FiPlus size={24} />}</span>}
      />
    </div>
  );
};

export default SpeedDial;
export type { SpeedDialProps };
