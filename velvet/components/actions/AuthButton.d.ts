import * as React from 'react';
/** Session toggle: primary "Sign in" when signed out, secondary "Sign out" when signed in; icon swaps with a small spin. Handlers may be async (spinner). */
export interface AuthButtonProps {
  signedIn: boolean;
  onSignIn?: () => void | Promise<void>;
  onSignOut?: () => void | Promise<void>;
  /** @default 'Sign in' */
  signInLabel?: string;
  /** @default 'Sign out' */
  signOutLabel?: string;
  iconOnly?: boolean;
  /** @default 'md' */
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}
export declare function AuthButton(props: AuthButtonProps): JSX.Element;
