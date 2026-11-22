import { useAuth } from '@jankrajewskiit/auth';

import { AuthControl, type AuthControlProps } from '../components/actions/AuthControl';
import { useTranslate } from '../i18n/useTranslate';
import { partitionProps } from '../utils/props';
import { createAuthAction } from './createAuthAction';

export interface AuthButtonProps extends Omit<
  AuthControlProps,
  'signedIn' | 'initializing' | 'pending' | 'error' | 'onSignIn' | 'onSignOut'
> {
  /** Defaults to the current path, query and hash when sign-in starts. */
  returnUrl?: string;
}

export const AuthButton = (props: AuthButtonProps) => {
  const [local, rest] = partitionProps(props, ['returnUrl', 'onError']);
  const auth = useAuth();
  const action = createAuthAction(auth, local);
  const translate = useTranslate();
  return (
    <AuthControl
      {...rest}
      signedIn={auth.isAuthenticated()}
      initializing={auth.isLoading()}
      pending={action.busy()}
      error={action.failed() ? translate('velvet.actions.authButton.failed') : undefined}
      onSignIn={action.signIn}
      onSignOut={action.signOut}
      onError={local.onError}
    />
  );
};
