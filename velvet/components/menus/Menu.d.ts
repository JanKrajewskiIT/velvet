import * as React from 'react';
export interface MenuItem {
  label?: React.ReactNode;
  icon?: string | React.ReactNode;
  description?: React.ReactNode;
  /** Display-only hint, e.g. "⌘D" */
  shortcut?: string;
  onSelect?: () => void;
  /** Destructive — red text, red hover */
  danger?: boolean;
  disabled?: boolean;
  /** Makes it a menuitemcheckbox with a check column */
  checked?: boolean;
  /** Keep the menu open after selecting (checkbox lists) */
  keepOpen?: boolean;
  /** Renders a separator line (other fields ignored) */
  divider?: boolean;
  /** Renders a small group heading (other fields ignored) */
  section?: string;
}
/** Dropdown menu of actions attached to a trigger. ↑↓ / Home / End move, type to jump, Enter selects, Esc closes and refocuses the trigger. Panel sits on material-4. */
export interface MenuProps {
  /** Usually a Button or IconButton; receives aria-haspopup / aria-expanded. ↓ on the trigger opens. */
  trigger: React.ReactNode;
  items: MenuItem[];
  align?: 'start' | 'end';
  side?: 'bottom' | 'top';
  /** Initial open state when uncontrolled. */
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Min panel width (px) */
  width?: number;
  /** Where item icons sit. end = label first, icon trailing on the right (row/action menus where the verb should lead). @default 'start' */
  iconPosition?: 'start' | 'end';
  className?: string;
}
export declare function Menu(props: MenuProps): JSX.Element;
/** The bare menu panel — for custom positioning (ContextMenu uses it). onClose(refocus) */
export interface MenuPanelProps { items: MenuItem[]; onClose?: (refocus: boolean) => void; style?: React.CSSProperties; className?: string; autoFocus?: boolean; iconPosition?: 'start' | 'end' }
export declare function MenuPanel(props: MenuPanelProps): JSX.Element;
