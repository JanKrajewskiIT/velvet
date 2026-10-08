import * as React from 'react';
import { MenuItem } from './Menu';
/** With onClick: split button — main action + chevron menu of alternatives ("Save" · Save as draft / Save & publish). Without onClick: a single button that opens the menu. */
export interface DropdownButtonProps {
  children?: React.ReactNode;
  /** Main action. Omit for a plain menu button. */
  onClick?: () => void;
  items: MenuItem[];
  variant?: 'primary' | 'secondary' | 'soft' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: string | React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  /** aria-label of the chevron. @default 'More options' */
  menuLabel?: string;
  className?: string;
}
export declare function DropdownButton(props: DropdownButtonProps): JSX.Element;
