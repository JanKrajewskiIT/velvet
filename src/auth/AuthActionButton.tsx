import { mergeProps } from 'solid-js';

import { AuthButton, type AuthButtonProps } from './AuthButton';

export type AuthActionButtonProps = AuthButtonProps;

/** Compact session action retained for applications using the original Velvet Auth integration. */
export const AuthActionButton = (props: AuthActionButtonProps) => {
  const p = mergeProps({ iconOnly: true, variant: 'ghost' } satisfies Partial<AuthActionButtonProps>, props);
  return <AuthButton {...p} />;
};
