import { useAuth } from '@jankrajewskiit/auth';
import { createUniqueId, type JSX, mergeProps, Show, splitProps } from 'solid-js';

import type { ButtonVariant } from '../components/actions/Button';
import { buttonClass, type ButtonSize } from '../components/actions/buttonClass';
import { Spinner } from '../components/feedback/Spinner';
import { Glyph } from '../components/primitives/Glyph';
import { useTranslate } from '../i18n/useTranslate';
import { cx } from '../utils/cx';
import { createAuthAction } from './createAuthAction';

export interface AuthButtonProps extends Omit<JSX.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** Defaults to the current path, query and hash when sign-in starts. */
  returnUrl?: string;
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

/** Signs in or out through the nearest Velvet Auth provider. */
export const AuthButton = (props: AuthButtonProps) => {
  const p = mergeProps({ size: 'md' } satisfies Partial<AuthButtonProps>, props);
  const [local, rest] = splitProps(p, [
    'returnUrl',
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
  const auth = useAuth();
  const action = createAuthAction(auth, local);
  const translate = useTranslate();
  const errorId = createUniqueId();
  const busy = () => action.busy() || auth.isLoading();
  const label = () =>
    auth.isAuthenticated()
      ? (local.signOutLabel ?? translate('velvet.actions.authButton.signOut'))
      : (local.signInLabel ?? translate('velvet.actions.authButton.signIn'));

  const click: JSX.EventHandler<HTMLButtonElement, MouseEvent> = (event) => {
    const handler = local.onClick;
    if (typeof handler === 'function') handler(event);
    else if (handler) handler[0](handler[1], event);
    if (event.defaultPrevented || local.disabled || busy()) return;
    void (auth.isAuthenticated() ? action.signOut() : action.signIn());
  };

  return (
    <>
      <button
        {...rest}
        type="button"
        class={cx(
          buttonClass({
            variant: local.variant ?? (auth.isAuthenticated() ? 'secondary' : 'primary'),
            size: local.size,
            icon: local.iconOnly,
          }),
          'vui-auth',
          local.class,
        )}
        disabled={local.disabled || busy()}
        onClick={click}
        aria-busy={busy() || undefined}
        aria-label={local.iconOnly ? label() : rest['aria-label']}
        aria-describedby={
          [local['aria-describedby'], action.failed() ? errorId : undefined].filter(Boolean).join(' ') || undefined
        }
        title={
          rest.title ??
          (action.failed() ? translate('velvet.actions.authButton.failed') : local.iconOnly ? label() : undefined)
        }
        data-state={auth.isAuthenticated() ? 'authenticated' : 'anonymous'}
      >
        <Show when={!busy()} fallback={<Spinner size="inline" tone="current" />}>
          <span class="vui-auth__icon" aria-hidden="true">
            <Show when={auth.isAuthenticated()} fallback={<Glyph name="log-in" />}>
              <Glyph name="log-out" />
            </Show>
          </span>
        </Show>
        <Show when={!local.iconOnly}>
          <span>{label()}</span>
        </Show>
      </button>
      <span id={errorId} class="vui-sr-only" role="status">
        <Show when={action.failed()}>{translate('velvet.actions.authButton.failed')}</Show>
      </span>
    </>
  );
};
