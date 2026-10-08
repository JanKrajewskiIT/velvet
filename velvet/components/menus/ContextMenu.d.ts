import * as React from 'react';
import { MenuItem } from './Menu';
/** Right-click (or Shift+F10 / Menu key) menu for a region. Opens at the pointer, clamps to the viewport, closes on scroll/outside click. Always duplicate critical actions somewhere visible — context menus are undiscoverable. */
export interface ContextMenuProps {
  items: MenuItem[];
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
  /** The region that responds to right-click */
  children?: React.ReactNode;
}
export declare function ContextMenu(props: ContextMenuProps): JSX.Element;
