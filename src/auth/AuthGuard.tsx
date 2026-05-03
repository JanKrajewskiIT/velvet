import { getCurrentReturnUrl } from '@jankrajewskiit/auth';
import { createEffect, createMemo, type JSX, Show } from 'solid-js';

import { useAuth } from '~/auth';
import AccessDenied from '~/components/feedback/AccessDenied/AccessDenied';
import PageLoader from '~/components/loaders/PageLoader/PageLoader';
import { useI18n } from '~/i18n';
import type Props from '~/models/Props';

export type Role = string;
export type UnauthorizedBehavior = 'access-denied' | 'redirect';

interface AuthGuardProps {
  roles?: Role | Role[];
  unauthorizedBehavior?: UnauthorizedBehavior;
  children: JSX.Element;
}

const AuthGuard = (props: Props<AuthGuardProps>) => {
  const auth = useAuth();
  const { ts } = useI18n();

  const requiredRoles = createMemo(() => {
    if (!props.roles) return [] as string[];
    return Array.isArray(props.roles) ? props.roles : [props.roles];
  });

  const hasAccess = createMemo(() => {
    const roles = requiredRoles();
    if (roles.length === 0) return true;
    return auth.hasAnyRole(...roles);
  });

  const shouldRedirect = createMemo(() => (props.unauthorizedBehavior ?? 'access-denied') === 'redirect');

  createEffect(() => {
    if (!auth.isLoading() && !auth.isAuthenticated() && shouldRedirect()) {
      void auth.signIn(getCurrentReturnUrl());
    }
  });

  return (
    <Show when={!auth.isLoading()} fallback={<PageLoader />}>
      <Show
        when={auth.isAuthenticated()}
        fallback={
          <Show when={!shouldRedirect()}>
            <AccessDenied
              label={ts('accessDenied.unauthorized.title')}
              description={ts('accessDenied.unauthorized.description')}
              goHomeLabel={ts('common.logIn')}
              onGoHome={() => {
                void auth.signIn(getCurrentReturnUrl());
              }}
            />
          </Show>
        }
      >
        <Show
          when={hasAccess()}
          fallback={
            <AccessDenied
              label={ts('accessDenied.forbidden.title')}
              description={ts('accessDenied.forbidden.description')}
              goHomeLabel={ts('accessDenied.goHome')}
            />
          }
        >
          {props.children}
        </Show>
      </Show>
    </Show>
  );
};

export type { AuthGuardProps };
export default AuthGuard;
