import * as React from 'react';
/** Square icon-only button. Always pass an accessible label. */
export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Velvet icon name or node */
  icon: string | React.ReactNode;
  /** Accessible label (also used as title) */
  label: string;
  /** raised = floating over content (carousel arrows) · overlay = on media / dark scrims (lightbox). @default 'ghost' */
  variant?: 'primary' | 'secondary' | 'soft' | 'ghost' | 'danger' | 'raised' | 'overlay';
  /** circle for floating nav arrows / media controls. @default 'square' */
  shape?: 'square' | 'circle';
  /** xs 24 · sm 32 · md 40 · lg 48. xs is for dense rows, table cells and chips. @default 'md' */
  size?: 'xs' | 'sm' | 'md' | 'lg';
}
export declare function IconButton(props: IconButtonProps): JSX.Element;
