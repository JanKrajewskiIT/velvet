import type { JSX } from '@solidjs/web';
import { createEffect, createSignal, Show, untrack } from 'solid-js';

import { createControllable } from '../../hooks/createControllable';
import { useTranslate } from '../../i18n/useTranslate';
import { booleanAttribute } from '../../utils/booleanAttribute';
import { cx } from '../../utils/cx';
import { withDefaults } from '../../utils/props';
import { Button } from '../actions/Button';
import { ConfirmDialog } from '../feedback/ConfirmDialog';
import { NavbarChip } from '../navigation/NavbarChip';
import { dispatchTradingAction } from './dispatchTradingAction';
import styles from './KillSwitchButton.module.css';

export interface KillSwitchButtonProps {
  active?: boolean;
  onActivate?: () => void;
  onActiveClick?: () => void;
  /** Receives the click instead of the built-in typed confirmation, which is then not rendered; use when the application owns the confirmation. */
  onRequest?: () => void;
  disabled?: boolean;
  scope?: string;
  label?: string;
  activeLabel?: string;
  title?: JSX.Element;
  description?: JSX.Element;
  confirmLabel?: string;
  cancelLabel?: string;
  /** Defaults to the localized STOP token. Empty text disables the typing gate. */
  requireText?: string;
  /** @default 'chip' */
  variant?: 'chip' | 'button';
  /** @default true */
  collapse?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  accessibleLabel?: string;
  class?: string;
}

interface StopConfirmation {
  scope: string | undefined;
  requireText: string;
  action: KillSwitchButtonProps['onActivate'];
}

export const KillSwitchButton = (props: KillSwitchButtonProps) => {
  const p = withDefaults(
    { active: false, variant: 'chip', collapse: true } satisfies Partial<KillSwitchButtonProps>,
    props,
  );
  const translate = useTranslate();
  const required = () => p.requireText ?? translate('velvet.trading.killSwitchButton.stop');
  const snapshot = (): StopConfirmation => ({ scope: p.scope, requireText: required(), action: p.onActivate });
  const [isOpen, setOpen] = createControllable({
    value: () => p.open,
    defaultValue: false,
    onChange: (next) => p.onOpenChange?.(next),
  });
  const [request, setRequest] = createSignal<StopConfirmation | undefined>(
    untrack(() => (isOpen() ? snapshot() : undefined)),
  );
  const valid = (value: StopConfirmation): boolean =>
    !p.active && value.scope === p.scope && value.requireText === required() && value.action === p.onActivate;
  const dialogOpen = () => {
    const pending = request();
    return isOpen() && !!pending && valid(pending);
  };
  createEffect(
    isOpen,
    (open) => {
      if (!open) setRequest(undefined);
      else if (!request()) setRequest(snapshot());
    },
    { defer: true },
  );
  createEffect(
    () => {
      const pending = request();
      return !!pending && !valid(pending);
    },
    (stale) => {
      if (stale) {
        setRequest(undefined);
        if (isOpen()) setOpen(false);
      }
    },
  );
  const click = () => {
    if (p.active) {
      if (p.onActiveClick) dispatchTradingAction(p.onActiveClick);
      return;
    }
    if (p.onRequest) {
      dispatchTradingAction(p.onRequest);
      return;
    }
    if (request() && isOpen()) return;
    setRequest(snapshot());
    setOpen(true);
  };
  const cancel = () => {
    setRequest(undefined);
    setOpen(false);
  };
  const confirm = () => {
    const pending = request();
    if (!isOpen() || !pending || !valid(pending)) return;
    setRequest(undefined);
    setOpen(false);
    if (valid(pending)) dispatchTradingAction(() => pending.action?.());
  };
  const caption = () =>
    p.active
      ? (p.activeLabel ?? translate('velvet.trading.killSwitchButton.stop'))
      : (p.label ?? translate('velvet.trading.killSwitchButton.label'));
  const name = () =>
    p.accessibleLabel ||
    (p.scope
      ? translate('velvet.trading.killSwitchButton.scopedLabel', { label: caption(), scope: p.scope })
      : caption());

  return (
    <>
      <Show
        when={p.variant === 'chip'}
        fallback={
          <Button
            variant="danger"
            size="sm"
            iconLeft="stop"
            aria-pressed={booleanAttribute(p.active)}
            aria-label={name()}
            disabled={p.disabled}
            onClick={click}
            class={cx(styles.root, p.class)}
            data-variant="button"
          >
            {caption()}
          </Button>
        }
      >
        <NavbarChip
          icon="stop"
          collapse={p.collapse}
          pressed={p.active}
          label={name()}
          disabled={p.disabled}
          onClick={click}
          class={cx(styles.root, p.class)}
          data-variant="chip"
        >
          {caption()}
        </NavbarChip>
      </Show>
      <Show when={!p.onRequest}>
        <ConfirmDialog
          open={dialogOpen()}
          tone="danger"
          title={p.title ?? translate('velvet.trading.killSwitchButton.title')}
          description={p.description}
          confirmLabel={p.confirmLabel ?? translate('velvet.trading.killSwitchButton.confirmLabel')}
          cancelLabel={p.cancelLabel ?? translate('velvet.common.cancel')}
          requireText={required()}
          onCancel={cancel}
          onConfirm={confirm}
        />
      </Show>
    </>
  );
};
