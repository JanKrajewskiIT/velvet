/** Light/dark switch — two overlapping rings with filled sun/moon; the selected ring fills and scales up. Uncontrolled by default: sets html[data-theme] and persists via the Velvet theme key (localStorage 'vui-theme'), staying in sync with other toggles. Pass value+onChange to control. variant: light (default, on light/neutral surfaces) · navbar (on Navbar tone="brand" / brand fills) · dark (on dark or media surfaces). */
export interface ThemeToggleProps {
  /** Controlled theme. Omit to drive the document theme directly. */
  value?: 'light' | 'dark' | 'system';
  onChange?: (theme: 'light' | 'dark' | 'system') => void;
  /** Preferred name — same callback as onChange (onChange stays as an alias). */
  onValueChange?: (theme: 'light' | 'dark' | 'system') => void;
  /** @default 'light' */
  variant?: 'light' | 'navbar' | 'dark';
  /** rings = overlapping filled rings (expressive, settings/hero) · segmented = compact pill with line icons, light · system · dark (toolbars, headers, docs). @default 'rings' */
  appearance?: 'rings' | 'segmented';
  /** Adds a third 'System' option (follows OS prefers-color-scheme; stored as 'system'). @default true for segmented, false for rings */
  showSystem?: boolean;
  /** @default 'System' */
  systemLabel?: string;
  /** md = 32px rings, sm = 24px. @default 'md' */
  size?: 'sm' | 'md';
  /** @default 'Light' */
  lightLabel?: string;
  /** @default 'Dark' */
  darkLabel?: string;
  /** Group label. @default 'Color theme' */
  label?: string;
  className?: string;
}
export declare function ThemeToggle(props: ThemeToggleProps): JSX.Element;
