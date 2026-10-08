import * as React from 'react';
/** Inline message inside content — form errors, plan limits, contextual tips. danger/warning announce as role=alert. */
export interface AlertProps {
  tone?: 'neutral' | 'brand' | 'info' | 'success' | 'warning' | 'danger';
  title?: React.ReactNode;
  children?: React.ReactNode;
  /** Buttons under the text */
  action?: React.ReactNode;
  onClose?: () => void;
  /** Icon name; null hides */
  icon?: string | null;
  /** soft = tinted fill · outline = border + raised surface · solid = strong fill. @default 'soft' */
  variant?: 'soft' | 'outline' | 'solid';
  className?: string;
}
export declare function Alert(props: AlertProps): JSX.Element;
/** Full-width strip at the top of the page/app — system status, trial ending, maintenance. One at a time. */
export interface BannerProps {
  tone?: 'neutral' | 'brand' | 'info' | 'success' | 'warning' | 'danger';
  children?: React.ReactNode;
  action?: React.ReactNode;
  onClose?: () => void;
  icon?: string | null;
  sticky?: boolean;
  className?: string;
}
export declare function Banner(props: BannerProps): JSX.Element;
