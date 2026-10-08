import * as React from 'react';
export interface AnchorItem { id: string; label: React.ReactNode; /** 1 = section, 2 = subsection (indented). @default 1 */ level?: 1 | 2; }
/**
 * "On this page" table of contents. Highlights the section currently in view and smooth-scrolls to a section on click
 * (instant under reduced motion), moving focus to its heading. Works on the window or any scroll container.
 */
export interface AnchorProps {
  /** Each id must match a heading/section id in the document */
  items: AnchorItem[];
  /** Scroll container: ref, element or selector. Omit for the window. */
  container?: React.RefObject<HTMLElement> | HTMLElement | string;
  /** Distance from the container top at which a section counts as active. @default 24 */
  offset?: number;
  activeId?: string;
  onChange?: (id: string) => void;
  /** Preferred name — same callback as onChange (onChange stays as an alias). */
  onValueChange?: (id: string) => void;
  /** nav aria-label. @default 'On this page' */
  label?: string;
  /** Visible heading; null hides it. Defaults to label. */
  title?: React.ReactNode | null;
  className?: string;
}
export declare function Anchor(props: AnchorProps): JSX.Element;
