import { createSignal, mergeProps, Show } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { Spinner } from '../feedback/Spinner';
import { Glyph } from '../primitives/Glyph';
import { buttonClass } from './buttonClass';

export interface AuthButtonProps {
  signedIn: boolean;
  onSignIn?: () => void | Promise<void>;
  onSignOut?: () => void | Promise<void>;
  /** Receives a failure of the sign-in / sign-out handler. Without it the failure is rethrown. */
  onError?: (error: unknown) => void;
  /** @default localized "Sign in" */
  signInLabel?: string;
  /** @default localized "Sign out" */
  signOutLabel?: string;
  iconOnly?: boolean;
  /** @default 'md' */
  size?: 'sm' | 'md' | 'lg';
  class?: string;
}

/** Session toggle: primary "Sign in" when signed out, secondary "Sign out" when signed in. Handlers may be async. */
export const AuthButton = (props: AuthButtonProps) => {
  const p = mergeProps({ size: 'md' } satisfies Partial<AuthButtonProps>, props);
  const translate = useTranslate();
  const [busy, setBusy] = createSignal(false);
  const label = () =>
    p.signedIn
      ? (p.signOutLabel ?? translate('velvet.actions.authButton.signOut'))
      : (p.signInLabel ?? translate('velvet.actions.authButton.signIn'));

  const run = async () => {
    setBusy(true);
    try {
      await (p.signedIn ? p.onSignOut : p.onSignIn)?.();
    } catch (error) {
      if (!p.onError) throw error;
      p.onError(error);
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      type="button"
      class={cx(
        buttonClass({ variant: p.signedIn ? 'secondary' : 'primary', size: p.size, icon: p.iconOnly }),
        'vui-auth',
        p.class,
      )}
      disabled={busy()}
      onClick={() => void run()}
      aria-label={p.iconOnly ? label() : undefined}
      title={p.iconOnly ? label() : undefined}
    >
      <Show when={!busy()} fallback={<Spinner size="inline" tone="current" />}>
        <span class="vui-auth__icon" aria-hidden="true">
          <Show when={p.signedIn} fallback={<Glyph name="log-in" />}>
            <Glyph name="log-out" />
          </Show>
        </span>
      </Show>
      <Show when={!p.iconOnly}>
        <span>{label()}</span>
      </Show>
    </button>
  );
};
