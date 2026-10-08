import type { JSX } from 'solid-js';

import { SectionLabel } from '../primitives/SectionLabel';

export interface NavSectionProps {
  children?: JSX.Element;
}

/** Small uppercase group label between NavItems; a short divider in the rail. */
export const NavSection = (props: NavSectionProps) => (
  <SectionLabel class="vui-nav-section" role="presentation">
    {props.children}
  </SectionLabel>
);
