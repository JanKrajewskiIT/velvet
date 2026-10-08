import * as React from 'react';
/** Atom. Sunken track holding raised, mutually-exclusive items. Build view switchers, compact filters, theme pickers from it; OptionSwitcher variant="track" renders it, Tabs variant="segmented" and ThemeToggle appearance="segmented" share its --segment-* tokens. Owns no state — set role (radiogroup / tablist) and selection yourself. */
export interface SegmentedProps extends React.HTMLAttributes<HTMLDivElement> {
  /** md = 30px items (36px track) · sm = 26px items. @default 'md' */
  size?: 'sm' | 'md';
  /** Stretch to container width; items share it equally */
  block?: boolean;
  /** Pill track + pill items */
  round?: boolean;
  /** Square icon-only items */
  iconOnly?: boolean;
  children?: React.ReactNode;
}
export declare function Segmented(props: SegmentedProps): JSX.Element;
export interface SegmentedItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Writes aria-checked (role="radio"), aria-selected (role="tab") or aria-pressed (no role) */
  selected?: boolean;
  /** Icon name or node, before the label */
  icon?: string | React.ReactNode;
  children?: React.ReactNode;
}
export declare const SegmentedItem: React.ForwardRefExoticComponent<SegmentedItemProps & React.RefAttributes<HTMLButtonElement>>;
