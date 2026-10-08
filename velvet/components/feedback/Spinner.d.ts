import * as React from 'react';
/** Loader: ring (default, inline/buttons), dots (chat/typing), bars (audio/processing), pulse (live). Use Skeleton when content shape is known; Progress when % is known. */
export interface SpinnerProps {
  variant?: 'ring' | 'dots' | 'bars' | 'pulse';
  /** sm 16 · md 24 · lg 40 · inline = 1em of the host text (buttons, chips) */
  size?: 'sm' | 'md' | 'lg' | 'inline';
  /** Accessible status text. @default 'Loading' */
  label?: string;
  /** current = inherit text colour */
  tone?: 'brand' | 'current';
  className?: string;
}
export declare function Spinner(props: SpinnerProps): JSX.Element;
/** Dims its children and centres a spinner + label on top while show is true. */
export interface LoadingOverlayProps { show?: boolean; label?: string; children?: React.ReactNode; className?: string }
export declare function LoadingOverlay(props: LoadingOverlayProps): JSX.Element;
