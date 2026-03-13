import { createMemo, type JSX, Show } from 'solid-js';

import type Props from '~/models/Props';

import AccessDenied from '../../feedback/AccessDenied/AccessDenied';
import LoadingContainer from '../../feedback/LoadingContainer/LoadingContainer';
import AuthRedirect from '../AuthRedirect/AuthRedirect';

export interface RequireAuthProps {
  isLoading: boolean;
  isAuthenticated: boolean;
  children: JSX.Element;
  roles?: string | string[];
  hasAnyRole?: (...roles: string[]) => boolean;
  hasAccess?: boolean;
  onUnauthenticated?: () => void | Promise<void>;
  loadingFallback?: JSX.Element;
  unauthenticatedFallback?: JSX.Element;
  accessDeniedFallback?: JSX.Element;
  accessDeniedTitle: string;
  accessDeniedDescription: string;
  accessDeniedGoHomeLabel: string;
  accessDeniedGoHomeHref?: string;
}

const RequireAuth = (props: Props<RequireAuthProps>) => {
  const requiredRoles = createMemo(() => {
    if (!props.roles) return [] as string[];
    return Array.isArray(props.roles) ? props.roles : [props.roles];
  });

  const resolvedHasAccess = createMemo(() => {
    if (props.hasAccess !== undefined) return props.hasAccess;
    const roles = requiredRoles();
    if (roles.length === 0) return true;
    if (!props.hasAnyRole) return false;
    return props.hasAnyRole(...roles);
  });

  return (
    <Show when={!props.isLoading} fallback={props.loadingFallback ?? <LoadingContainer />}>
      <Show
        when={props.isAuthenticated}
        fallback={
          props.unauthenticatedFallback ??
          (props.onUnauthenticated ? <AuthRedirect onRedirect={props.onUnauthenticated} /> : null)
        }
      >
        <Show
          when={resolvedHasAccess()}
          fallback={
            props.accessDeniedFallback ?? (
              <AccessDenied
                title={props.accessDeniedTitle}
                description={props.accessDeniedDescription}
                goHomeLabel={props.accessDeniedGoHomeLabel}
                goHomeHref={props.accessDeniedGoHomeHref}
              />
            )
          }
        >
          {props.children}
        </Show>
      </Show>
    </Show>
  );
};

export default RequireAuth;
