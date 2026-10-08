import * as React from 'react';
export interface TabItem { value: string; label: React.ReactNode; icon?: string | React.ReactNode; count?: number; disabled?: boolean }
/** Tab switcher with a sliding indicator. Arrow keys / Home / End move and select (roving tabindex). */
export interface TabsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  items: TabItem[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** Preferred name — same callback as onChange (onChange stays as an alias). */
  onValueChange?: (value: string) => void;
  /** underline = page sections · segmented = compact view toggle */
  variant?: 'underline' | 'segmented';
  /** vertical = settings-style list (underline variant only) */
  orientation?: 'horizontal' | 'vertical';
  block?: boolean;
}
export declare function Tabs(props: TabsProps): JSX.Element;
