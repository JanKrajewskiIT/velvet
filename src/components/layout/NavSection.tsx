import { type JSX, useContext } from 'solid-js';

import { SectionLabel } from '../primitives/SectionLabel';
import styles from './NavSection.module.css';
import { SidebarContext } from './sidebarContext';

export interface NavSectionProps {
  children?: JSX.Element;
}

/** Small uppercase group label between NavItems; a short divider in the rail. */
export const NavSection = (props: NavSectionProps) => {
  const sidebar = useContext(SidebarContext);
  return (
    <SectionLabel class={styles.navSection} data-collapsed={sidebar?.collapsed()} role="presentation">
      {props.children}
    </SectionLabel>
  );
};
