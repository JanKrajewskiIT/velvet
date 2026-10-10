import { type AuthContextValue, getCurrentReturnUrl } from '@jankrajewskiit/auth';
import { type Accessor, batch, createEffect, createSignal, on, onCleanup } from 'solid-js';

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
  const [busy, setBusy] = createSignal(false);
  const [failed, setFailed] = createSignal(false);
  let sequence = 0;
  let disposed = false;

  onCleanup(() => {
    disposed = true;
    sequence += 1;
  });

  createEffect(on(auth.user, () => setFailed(false), { defer: true }));

  const run = async (operation: () => Promise<void>) => {
    if (disposed || busy() || auth.isLoading()) return;
    const current = ++sequence;
    const session = auth.user();
    const isCurrent = () => !disposed && current === sequence && auth.user() === session;
    batch(() => {
      setBusy(true);
      setFailed(false);
    });

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
      if (current === sequence) setBusy(false);
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
