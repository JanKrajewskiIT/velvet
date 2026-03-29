import type { JSX } from 'solid-js';

import { useI18n } from '~/i18n/I18nProvider';
import type Props from '~/models/Props';

import { useAuth } from './AuthProvider';
import RequireAuth from './RequireAuth';
import { getCurrentReturnUrl } from './utils';

interface AuthGuardProps {
  roles?: string | string[];
  fallback?: JSX.Element;
  children: JSX.Element;
}

const AuthGuard = (props: Props<AuthGuardProps>) => {
  const auth = useAuth();
  const { t } = useI18n();

  const handleUnauthenticated = () => {
    const returnUrl = getCurrentReturnUrl();
    return auth.signIn(returnUrl);
  };

  return (
    <RequireAuth
      class={props.class}
      isLoading={auth.isLoading()}
      isAuthenticated={auth.isAuthenticated()}
      roles={props.roles}
      hasAnyRole={auth.hasAnyRole}
      onUnauthenticated={handleUnauthenticated}
      accessDeniedFallback={props.fallback}
      accessDeniedTitle={t('accessDenied.forbidden.title')}
      accessDeniedDescription={t('accessDenied.forbidden.description')}
      accessDeniedGoHomeLabel={t('accessDenied.goHome')}
    >
      {props.children}
    </RequireAuth>
  );
};

export type { AuthGuardProps };
export default AuthGuard;
