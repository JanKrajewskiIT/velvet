import { createEffect, type JSX, mergeProps, Show } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { Button } from '../actions/Button';
import { PageLoader } from '../feedback/PageLoader';
import { StatusPage } from '../feedback/StatusPage';

export interface AuthGuardProps {
  /** The session is still being resolved: a page loader is shown. */
  loading?: boolean;
  authenticated: boolean;
  /** Whether the signed-in user may see the content, e.g. role check. @default true */
  authorized?: boolean;
  /** access-denied shows a sign-in prompt · redirect calls `onSignIn` as soon as the user is known to be signed out. @default 'access-denied' */
  unauthenticated?: 'access-denied' | 'redirect';
  onSignIn?: () => void | Promise<void>;
  /** Receives a failure of `onSignIn`. Without it the failure is rethrown. */
  onError?: (error: unknown) => void;
  /** Adds a "go home" action to the forbidden screen. */
  onGoHome?: () => void;
  /** @default localized "Go to home page" */
  goHomeLabel?: string;
  children?: JSX.Element;
}

/** Renders `children` only for signed-in, authorized users. Authentication state comes from props, so any auth library fits. */
export const AuthGuard = (props: AuthGuardProps) => {
  const p = mergeProps({ authorized: true, unauthenticated: 'access-denied' } satisfies Partial<AuthGuardProps>, props);
  const translate = useTranslate();
  const redirecting = () => p.unauthenticated === 'redirect';

  const signIn = async () => {
    try {
      await p.onSignIn?.();
    } catch (error) {
      if (!p.onError) throw error;
      p.onError(error);
    }
  };

  createEffect(() => {
    if (!p.loading && !p.authenticated && redirecting()) void signIn();
  });

  return (
    <Show when={!p.loading} fallback={<PageLoader />}>
      <Show
        when={p.authenticated}
        fallback={
          <Show when={!redirecting()} fallback={<PageLoader />}>
            <StatusPage
              code={403}
              title={translate('velvet.patterns.authGuard.signInTitle')}
              description={translate('velvet.patterns.authGuard.signInDescription')}
              actions={<Button onClick={() => void signIn()}>{translate('velvet.actions.authButton.signIn')}</Button>}
            />
          </Show>
        }
      >
        <Show
          when={p.authorized}
          fallback={
            <StatusPage
              code={403}
              actions={
                <Show when={p.onGoHome}>
                  {(goHome) => (
                    <Button variant="secondary" onClick={() => goHome()()}>
                      {p.goHomeLabel ?? translate('velvet.patterns.authGuard.goHome')}
                    </Button>
                  )}
                </Show>
              }
            />
          }
        >
          {p.children}
        </Show>
      </Show>
    </Show>
  );
};
