import { createMemo, type JSX, Show } from 'solid-js';

import AccessDenied from '~/components/feedback/AccessDenied/AccessDenied';
import PageLoader from '~/components/loaders/PageLoader/PageLoader';
import type Props from '~/models/Props';

import AuthRedirect from './AuthRedirect';

interface RequireAuthBaseProps {
  isLoading: boolean;
  isAuthenticated: boolean;
  children: JSX.Element;
  roles?: string | string[];
  hasAnyRole?: (...roles: string[]) => boolean;
  hasAccess?: boolean;
  onUnauthenticated?: () => void | Promise<void>;
  loadingFallback?: JSX.Element;
  unauthenticatedFallback?: JSX.Element;
}

interface RequireAuthDefaultAccessDeniedProps {
  accessDeniedFallback?: undefined;
  accessDeniedTitle: string;
  accessDeniedDescription: string;
  accessDeniedGoHomeLabel: string;
  accessDeniedGoHomeHref?: string;
}

interface RequireAuthCustomAccessDeniedProps {
  accessDeniedFallback: JSX.Element;
  accessDeniedTitle?: string;
  accessDeniedDescription?: string;
  accessDeniedGoHomeLabel?: string;
  accessDeniedGoHomeHref?: string;
}

export type RequireAuthProps = RequireAuthBaseProps &
  (RequireAuthDefaultAccessDeniedProps | RequireAuthCustomAccessDeniedProps);

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

  const unauthenticatedFallback = createMemo(() => {
    if (props.unauthenticatedFallback !== undefined) return props.unauthenticatedFallback;
    if (!props.onUnauthenticated) return null;
    return <AuthRedirect onRedirect={props.onUnauthenticated} />;
  });

  const accessDeniedFallback = createMemo(() => {
    if (props.accessDeniedFallback !== undefined) return props.accessDeniedFallback;

    const defaultAccessDeniedProps = props as RequireAuthBaseProps & RequireAuthDefaultAccessDeniedProps;

    return (
      <AccessDenied
        label={defaultAccessDeniedProps.accessDeniedTitle}
        description={defaultAccessDeniedProps.accessDeniedDescription}
        goHomeLabel={defaultAccessDeniedProps.accessDeniedGoHomeLabel}
        goHomeHref={defaultAccessDeniedProps.accessDeniedGoHomeHref}
      />
    );
  });

  return (
    <Show when={!props.isLoading} fallback={props.loadingFallback ?? <PageLoader />}>
      <Show when={props.isAuthenticated} fallback={unauthenticatedFallback()}>
        <Show when={resolvedHasAccess()} fallback={accessDeniedFallback()}>
          {props.children}
        </Show>
      </Show>
    </Show>
  );
};

export default RequireAuth;
