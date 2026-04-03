import { FiLogIn, FiLogOut } from 'solid-icons/fi';
import { createMemo, createSignal, splitProps } from 'solid-js';

import type { ButtonVariant } from '~/components/buttons/Button/Button';
import IconButton from '~/components/buttons/IconButton/IconButton';
import Icon from '~/components/media/Icon/Icon';
import { useI18n } from '~/i18n/I18nProvider';
import type Props from '~/models/Props';
import type { ButtonCoreNativeProps } from '~/models/Props';

import { useAuth } from './AuthProvider';
import { getCurrentReturnUrl } from './utils';

interface AuthActionButtonProps extends Omit<ButtonCoreNativeProps, 'title'> {
  returnUrl?: string;
  variant?: ButtonVariant;
}

const AuthActionButton = (props: Props<AuthActionButtonProps>) => {
  const [local, rest] = splitProps(props, ['returnUrl', 'variant', 'disabled', 'onClick']);
  const auth = useAuth();
  const { ts } = useI18n();
  const [isAuthenticating, setIsAuthenticating] = createSignal(false);

  const label = createMemo(() => (auth.isAuthenticated() ? ts('common.logOut') : ts('common.logIn')));

  const icon = createMemo(() =>
    auth.isAuthenticated() ? (
      <Icon icon={FiLogOut} />
    ) : (
      <Icon icon={FiLogIn} variant={isAuthenticating() ? 'primary' : 'inherit'} />
    ),
  );

  const handleAuthAction: ButtonCoreNativeProps['onClick'] = (event) => {
    const onClick = local.onClick;
    if (typeof onClick === 'function') {
      onClick(event);
    }

    if (isAuthenticating()) {
      return;
    }

    if (auth.isAuthenticated()) {
      void auth.signOut();
      return;
    }

    setIsAuthenticating(true);
    const currentPath = getCurrentReturnUrl();
    void auth.signIn(local.returnUrl ?? currentPath).finally(() => {
      setIsAuthenticating(false);
    });
  };

  return (
    <IconButton
      {...rest}
      icon={icon()}
      label={label()}
      onClick={handleAuthAction}
      variant={local.variant}
      disabled={local.disabled || isAuthenticating()}
      aria-busy={isAuthenticating() ? 'true' : undefined}
      data-state={auth.isAuthenticated() ? 'authenticated' : 'anonymous'}
    />
  );
};

export type { AuthActionButtonProps };
export default AuthActionButton;
