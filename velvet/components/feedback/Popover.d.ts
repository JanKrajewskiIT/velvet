import * as React from 'react';
/** Floating panel on the top material (material-4). For rich content — profiles, quick settings, small forms. openOn="hover" makes it a hover card (profile/link previews): opens after openDelay, stays open while the pointer is over the trigger or panel, also opens on focus. Use Tooltip for plain-text hints. Closes on outside click and Esc. */
export interface PopoverProps {
  /** Element that toggles the popover — usually a Button or IconButton. Receives aria-expanded. */
  trigger: React.ReactNode;
  title?: React.ReactNode;
  side?: 'bottom' | 'top';
  align?: 'start' | 'end';
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** click (default) or hover — hover = HoverCard behaviour. @default 'click' */
  openOn?: 'click' | 'hover';
  /** Hover only. @default 350 */
  openDelay?: number;
  /** Hover only. @default 150 */
  closeDelay?: number;
  className?: string;
  children?: React.ReactNode;
}
export declare function Popover(props: PopoverProps): JSX.Element;
