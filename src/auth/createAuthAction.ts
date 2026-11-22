import { type AuthContextValue, getCurrentReturnUrl } from '@jankrajewskiit/auth';
import { type Accessor, createEffect, createSignal } from 'solid-js';

import { createOperation } from '../hooks/createOperation';

interface AuthActionOptions {
  readonly returnUrl?: string;
  readonly onError?: (error: unknown) => void;
}

interface AuthAction {
  busy: Accessor<boolean>;
  failed: Accessor<boolean>;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const createAuthAction = (auth: AuthContextValue, options: AuthActionOptions): AuthAction => {
  const { busy, begin } = createOperation({ concurrency: 'single-flight' });
  const [failed, setFailed] = createSignal(false);

  createEffect(
    auth.user,
    () => {
      setFailed(false);
    },
    { defer: true },
  );

  const run = async (operation: () => Promise<void>) => {
    if (auth.isLoading()) return;
    const run = begin();
    if (!run) return;
    const session = auth.user();
    const isCurrent = () => run.isCurrent() && auth.user() === session;
    setFailed(false);

    try {
      await operation();
      if (!isCurrent()) return;
      // Velvet Auth reports redirect failures through context even when its promise resolves.
      const error = auth.error();
      if (error !== null) throw new Error(error);
    } catch (error) {
      if (!isCurrent()) return;
      setFailed(true);
      options.onError?.(error);
    } finally {
      run.finish();
    }
  };

  const signIn = () => {
    const returnUrl = options.returnUrl ?? getCurrentReturnUrl();
    return run(() => auth.signIn(returnUrl));
  };

  return {
    busy,
    failed: () => failed() || auth.error() !== null,
    signIn,
    signOut: () => run(auth.signOut),
  };
};
