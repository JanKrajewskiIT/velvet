import { useAuth } from '@jankrajewskiit/auth';
import { createEffect, createMemo, type JSX, mergeProps, on, Show } from 'solid-js';

import { Button } from '../components/actions/Button';
import { ErrorState } from '../components/feedback/ErrorState';
import { PageLoader } from '../components/feedback/PageLoader';
import { StatusPage } from '../components/feedback/StatusPage';
import { useTranslate } from '../i18n/useTranslate';
import { reportAsyncError } from '../utils/reportAsyncError';
import { createAuthAction } from './createAuthAction';

export type Role = string;
export type UnauthorizedBehavior = 'access-denied' | 'redirect';

export interface AuthGuardProps {
  /** Requires at least one listed role. Omitted or empty means any authenticated user. */
  roles?: Role | readonly Role[];
  /** @default 'access-denied' */
  unauthorizedBehavior?: UnauthorizedBehavior;
  /** Defaults to the current path, query and hash when sign-in starts. */
  returnUrl?: string;
  /** Receives current sign-in failures. The guard also presents a localized retry screen. */
  onError?: (error: unknown) => void;
  /** Adds a "go home" action to the forbidden screen. */
  onGoHome?: () => void;
  /** @default localized "Go to home page" */
  goHomeLabel?: string;
  children?: JSX.Element;
}

/** Resolves the Velvet Auth session and required roles before rendering protected content. */
export const AuthGuard = (props: AuthGuardProps) => {
  const p = mergeProps({ unauthorizedBehavior: 'access-denied' } satisfies Partial<AuthGuardProps>, props);
  const auth = useAuth();
  const action = createAuthAction(auth, p);
  const translate = useTranslate();
  const redirecting = () => p.unauthorizedBehavior === 'redirect';
  const requiredRoles = createMemo(() => (typeof p.roles === 'string' ? [p.roles] : (p.roles ?? [])));
  const hasAccess = () => requiredRoles().length === 0 || auth.hasAnyRole(...requiredRoles());

  const signIn = () => void action.signIn().catch(reportAsyncError);

  createEffect(
    on([auth.isLoading, auth.isAuthenticated, redirecting], ([loading, authenticated, redirect]) => {
      if (!loading && !authenticated && redirect && !action.failed()) signIn();
    }),
  );

  return (
    <Show when={!auth.isLoading() && !action.busy()} fallback={<PageLoader />}>
      <Show
        when={auth.isAuthenticated()}
        fallback={
          <Show
            when={!action.failed()}
            fallback={
              <ErrorState size="lg" description={translate('velvet.actions.authButton.failed')} onRetry={signIn} />
            }
          >
            <Show when={!redirecting()} fallback={<PageLoader />}>
              <StatusPage
                code={403}
                title={translate('velvet.patterns.authGuard.signInTitle')}
                description={translate('velvet.patterns.authGuard.signInDescription')}
                actions={<Button onClick={signIn}>{translate('velvet.actions.authButton.signIn')}</Button>}
              />
            </Show>
          </Show>
        }
      >
        <Show
          when={hasAccess()}
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
