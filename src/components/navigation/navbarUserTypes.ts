import type { JSX } from 'solid-js';

import type { ThemePreference } from '../../theme/theme';
import type { MenuItem } from '../menus/menuItem';

export interface NavbarUserProps {
  name?: string;
  src?: string;
  items: MenuItem[];
  /** Name hides under 1024px. @default true */
  showName?: boolean;
  /** @default localized "Account menu" */
  label?: string;
  /** Menu min width in px. @default 220 */
  width?: number;
  compact?: boolean;
  email?: string;
  meta?: JSX.Element;
  theme?: ThemePreference;
  onThemeChange?: (theme: ThemePreference) => void;
  onSignOut?: () => void;
}
