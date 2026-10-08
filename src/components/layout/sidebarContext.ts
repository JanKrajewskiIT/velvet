import { type Accessor, createContext, useContext } from 'solid-js';

export interface SidebarContextValue {
  collapsed: Accessor<boolean>;
  /** Asks the owner to expand the sidebar; false when the owner cannot change `collapsed`. */
  expand: () => boolean;
}

export const SidebarContext = createContext<SidebarContextValue>();

export const useSidebar = (): SidebarContextValue => {
  const context = useContext(SidebarContext);
  if (!context) throw new Error('NavItem must be rendered inside a Sidebar.');
  return context;
};
