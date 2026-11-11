import { createEffect, createSignal, createUniqueId, type JSX, mergeProps, on, Show, splitProps } from 'solid-js';

import { createOperation } from '../../hooks/createOperation';
import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { reportAsyncError } from '../../utils/reportAsyncError';
import { Spinner } from '../feedback/Spinner';
import { Glyph } from '../primitives/Glyph';
import { Text } from '../primitives/Text';
import styles from './AuthControl.module.css';
import type { ButtonVariant } from './Button';
import { buttonClass, type ButtonSize } from './buttonClass';

export interface AuthControlProps extends Omit<JSX.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  signedIn?: boolean;
  initializing?: boolean;
  pending?: boolean;
  error?: string | null;
  onSignIn?: () => void | Promise<void>;
  onSignOut?: () => void | Promise<void>;
  /** Receives current operation failures. A localized failure is also announced by the button. */
  onError?: (error: unknown) => void;
  /** @default localized "Sign in" */
  signInLabel?: string;
  /** @default localized "Sign out" */
  signOutLabel?: string;
  iconOnly?: boolean;
  /** Defaults to primary for sign-in and secondary for sign-out. */
  variant?: ButtonVariant;
  /** @default 'md' */
  size?: ButtonSize;
}

/** Neutral session action; AuthButton supplies the Velvet Auth integration. */
export const AuthControl = (props: AuthControlProps) => {
  const p = mergeProps({ size: 'md' } satisfies Partial<AuthControlProps>, props);
  const [local, rest] = splitProps(p, [
    'signedIn',
    'initializing',
    'pending',
    'error',
    'onSignIn',
    'onSignOut',
    'onError',
    'signInLabel',
    'signOutLabel',
    'iconOnly',
    'variant',
    'size',
    'class',
    'disabled',
    'onClick',
    'aria-describedby',
  ]);
  const operation = createOperation();
  const [failure, setFailure] = createSignal(false);
  createEffect(
    on(
      () => [local.signedIn, local.onSignIn, local.onSignOut],
      () => {
        operation.invalidate();
        setFailure(false);
      },
      { defer: true },
    ),
  );
  const translate = useTranslate();
  const errorId = createUniqueId();
  const busy = () => operation.busy() || local.pending || local.initializing;
  const error = () => local.error || (failure() ? translate('velvet.actions.authButton.failed') : undefined);
  const run = async () => {
    const operationRun = operation.begin();
    if (!operationRun) return;
    setFailure(false);
    try {
      await (local.signedIn ? local.onSignOut?.() : local.onSignIn?.());
    } catch (reason) {
      if (!operationRun.isCurrent()) return;
      setFailure(true);
      if (local.onError) local.onError(reason);
      else reportAsyncError(reason);
    } finally {
      operationRun.finish();
    }
  };
  const label = () =>
    local.initializing
      ? translate('velvet.actions.authButton.initializing')
      : local.signedIn
        ? (local.signOutLabel ?? translate('velvet.actions.authButton.signOut'))
        : (local.signInLabel ?? translate('velvet.actions.authButton.signIn'));

  const click: JSX.EventHandler<HTMLButtonElement, MouseEvent> = (event) => {
    const handler = local.onClick;
    if (typeof handler === 'function') handler(event);
    else if (handler) handler[0](handler[1], event);
    if (event.defaultPrevented || local.disabled || busy()) return;
    void run().catch(reportAsyncError);
  };

  return (
    <>
      <button
        {...rest}
        type="button"
        class={cx(
          buttonClass({
            variant: local.variant ?? (local.signedIn || local.initializing ? 'secondary' : 'primary'),
            size: local.size,
            icon: local.iconOnly,
          }),
          'vui-auth',
          error() && !busy() && styles.authVariantError,
          local.class,
        )}
        disabled={local.disabled || busy()}
        onClick={click}
        aria-busy={busy() || undefined}
        aria-label={local.iconOnly ? label() : rest['aria-label']}
        aria-describedby={
          [local['aria-describedby'], error() ? errorId : undefined].filter(Boolean).join(' ') || undefined
        }
        title={rest.title ?? (error() || (local.iconOnly ? label() : undefined))}
        data-state={local.signedIn ? 'authenticated' : 'anonymous'}
      >
        <Show when={!busy()} fallback={<Spinner size="inline" tone="current" />}>
          <span class={styles.authPartIcon} aria-hidden="true">
            <Show when={error()} fallback={<Glyph name={local.signedIn ? 'log-out' : 'log-in'} />}>
              <Glyph name="alert-circle" />
            </Show>
          </span>
        </Show>
        <Show when={!local.iconOnly}>
          <Text
            as="span"
            variant={local.size === 'lg' ? 'button-lg' : local.size === 'md' ? 'button' : 'button-sm'}
            tone="inherit"
          >
            {label()}
          </Text>
        </Show>
      </button>
      <Text as="span" variant="caption" tone="inherit" id={errorId} class={styles.srOnly} role="status">
        {error()}
      </Text>
    </>
  );
};
