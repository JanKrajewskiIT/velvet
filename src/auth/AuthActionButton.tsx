import { mergeProps } from 'solid-js';

import { cx } from '../utils/cx';
import styles from './AuthActionButton.module.css';
import { AuthButton, type AuthButtonProps } from './AuthButton';

export type AuthActionButtonProps = AuthButtonProps;

/** Compact session action retained for applications using the original Velvet Auth integration. */
export const AuthActionButton = (props: AuthActionButtonProps) => {
  const p = mergeProps({ iconOnly: true, variant: 'ghost' } satisfies Partial<AuthActionButtonProps>, props);
  return <AuthButton {...p} class={cx(styles.root, p.class)} />;
};
