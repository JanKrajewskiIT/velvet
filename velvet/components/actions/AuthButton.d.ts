import * as React from 'react';
/** Session toggle: primary "Sign in" when signed out, secondary "Sign out" when signed in; icon swaps with a small spin. Handlers may be async (spinner); a rejected handler shows the error state (alert icon, danger edge, message announced + in the tooltip) until the next click. Session/roles live in the app — pass state in. */
export interface AuthButtonProps {
  signedIn: boolean;
  onSignIn?: () => void | Promise<void>;
  onSignOut?: () => void | Promise<void>;
  /** @default 'Sign in' */
  signInLabel?: string;
  /** @default 'Sign out' */
  signOutLabel?: string;
  /** Session still resolving: disabled, spinner, "Checking session…" */
  initializing?: boolean;
  /** An auth action started elsewhere is in flight (redirect, popup) */
  pending?: boolean;
  /** Last sign-in/out error from the app; clicking retries */
  error?: string | null;
  iconOnly?: boolean;
  /** @default 'md' */
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}
export declare function AuthButton(props: AuthButtonProps): JSX.Element;
